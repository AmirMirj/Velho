import { AuditPackSchema } from "@/lib/schemas";
import { chatJson } from "@/lib/openrouter";
import { fetchPublicCompanyPages } from "@/lib/fetch-public";
import {
  heuristicsAsPromptBlock,
  runAuditHeuristics,
} from "@/lib/audit-heuristics";
import {
  guessDomainFromName,
  normalizeCompanyInput,
} from "@/lib/normalize-url";
import type {
  AuditPack,
  Leak,
  OutreachDraft,
  PublicSignal,
  TargetCompany,
} from "@/types/audit";

const DRAFT_LABEL =
  "DRAFT — internal use only — do not send from this tool";

const SYSTEM = `You are an aggressive-but-ethical public UX/ops auditor for Velho.
Build an "Aggressive Auditor" pack from PUBLIC website text + heuristic seeds only.

Hard rules:
- Use ONLY facts supported by provided source text / heuristics. Create signals with excerpts.
- Do NOT invent executives, emails, phones, internal systems, CVEs, or security vulnerabilities.
- NEVER claim you hacked, penetrated, or deployed code onto the prospect's production systems.
- Leaks = conversion/ops friction on public surfaces (thin pages, missing journeys, weak CTAs, heavy pages, unclear buyer paths) — NOT security exploits.
- Target 1–5 ranked leaks. Fewer if evidence is thin — never pad with fiction.
- Each leak: title, impactScore 1-5, effortScore 1-5, rank (1=best), rationale, tryFirst, confidence exactly "high"|"medium"|"low", signalIds, conceptualFix (what a conceptual coded fix would do), stagingPreviewHtml (small self-contained HTML snippet showing a concept UI improvement for THAT company; include a visible banner "CONCEPT / DRAFT FIX — not deployed on prospect systems"; no scripts; no external URLs except maybe https; keep under 4000 chars).
- If a leak has no supporting signal, confidence MUST be "low" and signalIds [].
- Drafts: exactly one email and one linkedin for addresseeRole "COO / Head of Operations". Reference specific leaks. Invite a short meeting. draftLabel MUST be exactly: "${DRAFT_LABEL}". Use relatedLeakIds.
- Tone can be sharp ("we found leaks costing conversions") but factual.
- Output JSON only. English.`;

interface LlmAudit {
  company: {
    name: string;
    domain: string;
    snapshot: string;
    industryHint: string | null;
    sizeHint: string | null;
  };
  signals: PublicSignal[];
  leaks: Leak[];
  drafts: OutreachDraft[];
  gaps: string[];
  warnings: string[];
  languageLimitation?: boolean;
}

function normalizeConfidence(value: unknown): "high" | "medium" | "low" {
  const raw = String(value || "").toLowerCase().trim();
  if (raw === "high") return "high";
  if (raw === "low") return "low";
  return "medium";
}

function clampScore(n: number): number {
  if (typeof n !== "number" || Number.isNaN(n)) return 3;
  return Math.min(5, Math.max(1, Math.round(n)));
}

function sanitizePreviewHtml(html: string | null | undefined, company: string): string {
  const banner =
    `<div style="background:#111;color:#f5e6c8;padding:10px 14px;font:14px/1.4 sans-serif">CONCEPT / DRAFT FIX — not deployed on ${company} production systems · Velho internal demo</div>`;
  let body = (html || "").trim();
  body = body
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
  if (body.length < 40) {
    body = `<main style="font:16px/1.5 system-ui;padding:24px;max-width:640px"><h1>Clearer path for buyers</h1><p>Concept UX for <strong>${company}</strong>: one primary CTA, shorter proof points, and a visible next step for ops leaders.</p><p><a href="#" style="display:inline-block;padding:10px 16px;background:#0f766e;color:#fff;text-decoration:none;border-radius:8px">Talk to operations</a></p></main>`;
  }
  if (!/CONCEPT\s*\/\s*DRAFT/i.test(body)) {
    body = banner + body;
  }
  return body.slice(0, 8000);
}

function normalizeLeaks(leaks: Leak[], signalIds: Set<string>, companyName: string): Leak[] {
  return leaks
    .slice(0, 5)
    .map((o, i) => {
      const validIds = (o.signalIds || []).filter((id) => signalIds.has(id));
      const confidence =
        validIds.length === 0 ? "low" : normalizeConfidence(o.confidence);
      return {
        ...o,
        id: o.id || `leak-${i + 1}`,
        signalIds: validIds,
        confidence,
        impactScore: clampScore(o.impactScore),
        effortScore: clampScore(o.effortScore),
        rank: o.rank || i + 1,
        conceptualFix:
          o.conceptualFix ||
          "Ship a focused landing/CTA improvement as a concept prototype.",
        stagingPreviewHtml: sanitizePreviewHtml(
          o.stagingPreviewHtml,
          companyName
        ),
      };
    })
    .sort((a, b) => a.rank - b.rank)
    .map((o, i) => ({ ...o, rank: i + 1 }));
}

function ensureDrafts(
  drafts: OutreachDraft[],
  companyName: string,
  leakIds: string[]
): OutreachDraft[] {
  const email = drafts.find((d) => d.channel === "email");
  const linkedin = drafts.find((d) => d.channel === "linkedin");
  const baseRelated = leakIds.slice(0, 2);
  return [
    {
      channel: "email",
      addresseeRole: "COO / Head of Operations",
      subject:
        email?.subject ||
        `Public conversion leaks at ${companyName} (draft)`,
      body:
        email?.body ||
        `Hi —\n\nWe reviewed public pages for ${companyName} and found conversion/ops friction you can see without a login. Happy to walk a conceptual fix in 15 minutes.\n\nBest`,
      draftLabel: DRAFT_LABEL,
      relatedLeakIds: email?.relatedLeakIds?.length
        ? email.relatedLeakIds
        : baseRelated,
    },
    {
      channel: "linkedin",
      addresseeRole: "COO / Head of Operations",
      subject: null,
      body:
        linkedin?.body ||
        `Hi — spotted a few public UX/ops leaks on ${companyName}'s site that likely cost conversions. Would a short walkthrough of a concept fix be useful?`,
      draftLabel: DRAFT_LABEL,
      relatedLeakIds: linkedin?.relatedLeakIds?.length
        ? linkedin.relatedLeakIds
        : baseRelated,
    },
  ];
}

async function runLlm(
  domain: string,
  inputRaw: string,
  combinedText: string,
  heuristicBlock: string,
  fetchGaps: string[]
): Promise<LlmAudit> {
  const user = `Company input: ${inputRaw}
Resolved domain: ${domain}

${heuristicBlock}

Public source text:
"""
${combinedText || "(no text retrieved)"}
"""

Fetch gaps:
${fetchGaps.length ? fetchGaps.map((g) => `- ${g}`).join("\n") : "- none"}

Return JSON:
{
  "company": { "name", "domain", "snapshot", "industryHint", "sizeHint" },
  "signals": [{ "id", "sourceLabel", "sourceUrl", "excerpt", "whyItMatters" }],
  "leaks": [{ "id", "title", "impactScore", "effortScore", "rank", "rationale", "tryFirst", "confidence", "signalIds", "conceptualFix", "stagingPreviewHtml" }],
  "drafts": [{ "channel": "email"|"linkedin", "addresseeRole", "subject", "body", "draftLabel", "relatedLeakIds" }],
  "gaps": string[],
  "warnings": string[],
  "languageLimitation": boolean
}`;

  const raw = await chatJson(SYSTEM, user);
  return JSON.parse(raw) as LlmAudit;
}

function errorPack(gaps: string[], warnings: string[] = []): AuditPack {
  return {
    status: "error",
    mode: "aggressive-auditor",
    company: null,
    signals: [],
    leaks: [],
    drafts: [],
    gaps,
    generatedAt: new Date().toISOString(),
    warnings,
  };
}

export async function generateAuditPack(input: string): Promise<AuditPack> {
  const normalized = normalizeCompanyInput(input);
  let domain: string;
  let homepageUrl: string;
  const gaps: string[] = [];
  const warnings: string[] = [];

  if (normalized.kind === "domain") {
    domain = normalized.domain;
    homepageUrl = normalized.homepageUrl;
  } else {
    const guessed = guessDomainFromName(normalized.name);
    if (!guessed) {
      return errorPack([
        "Could not resolve a domain from the company name. Enter a domain (e.g. company.fi).",
      ]);
    }
    domain = guessed;
    homepageUrl = `https://${guessed}/`;
    warnings.push(
      `Interpreted name "${normalized.name}" as guessed domain ${guessed}; prefer entering the real domain.`
    );
  }

  const fetched = await fetchPublicCompanyPages(homepageUrl);
  gaps.push(...fetched.gaps);
  const heuristics = runAuditHeuristics(fetched);
  const heuristicBlock = heuristicsAsPromptBlock(heuristics, fetched.pages);

  if (!fetched.combinedText.trim()) {
    return {
      status: "error",
      mode: "aggressive-auditor",
      company: {
        name: domain.split(".")[0] || domain,
        domain,
        inputRaw: input,
        snapshot: "No public website text could be retrieved.",
        industryHint: null,
        sizeHint: null,
      },
      signals: [],
      leaks: [],
      drafts: [],
      gaps,
      generatedAt: new Date().toISOString(),
      warnings,
    };
  }

  let llm: LlmAudit | null = null;
  let lastError: string | null = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const repair =
        attempt === 0
          ? ""
          : `\nPrevious JSON failed: ${lastError}. Fix and return valid JSON only.`;
      llm = await runLlm(
        domain,
        input,
        fetched.combinedText + repair,
        heuristicBlock,
        fetched.gaps
      );
      break;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }

  if (!llm) {
    return {
      status: "partial",
      mode: "aggressive-auditor",
      company: {
        name: domain,
        domain,
        inputRaw: input,
        snapshot: "Public pages were fetched but audit analysis failed.",
        industryHint: null,
        sizeHint: null,
      },
      signals: [],
      leaks: [],
      drafts: [],
      gaps: [...gaps, lastError || "LLM analysis failed"],
      generatedAt: new Date().toISOString(),
      warnings,
    };
  }

  const company: TargetCompany = {
    name: llm.company?.name || domain,
    domain: llm.company?.domain || domain,
    inputRaw: input,
    snapshot: llm.company?.snapshot || "Snapshot unavailable.",
    industryHint: llm.company?.industryHint ?? null,
    sizeHint: llm.company?.sizeHint ?? null,
  };

  const signals: PublicSignal[] = (llm.signals || []).map((s, i) => ({
    id: s.id || `sig-${i + 1}`,
    sourceLabel: s.sourceLabel || "public page",
    sourceUrl: s.sourceUrl || homepageUrl,
    excerpt: s.excerpt || "",
    whyItMatters: s.whyItMatters || "",
  }));

  // Seed signals from heuristics if LLM omitted them
  for (const h of heuristics) {
    if (!signals.some((s) => s.id === h.id) && h.sourceUrl) {
      signals.push({
        id: h.id,
        sourceLabel: h.sourceLabel,
        sourceUrl: h.sourceUrl,
        excerpt: h.detail.slice(0, 280),
        whyItMatters: "Deterministic public UX/ops heuristic seed.",
      });
    }
  }

  const signalIdSet = new Set(signals.map((s) => s.id));
  const leaks = normalizeLeaks(llm.leaks || [], signalIdSet, company.name);

  const mergedGaps = [...new Set([...gaps, ...(llm.gaps || [])])];
  const mergedWarnings = [
    ...new Set([
      ...warnings,
      ...(llm.warnings || []),
      ...(llm.languageLimitation
        ? ["Source language may limit nuance; pack is in English."]
        : []),
    ]),
  ];

  const thin =
    signals.length < 2 ||
    leaks.length < 2 ||
    fetched.pages.filter((p) => p.ok).length < 2;

  let status: AuditPack["status"] = "complete";
  if (thin || mergedGaps.length > 0) status = "partial";
  if (leaks.length === 0 && signals.length === 0) status = "error";

  const drafts =
    status === "error"
      ? []
      : ensureDrafts(
          llm.drafts || [],
          company.name,
          leaks.map((l) => l.id)
        );

  const pack: AuditPack = {
    status,
    mode: "aggressive-auditor",
    company,
    signals,
    leaks,
    drafts,
    gaps: mergedGaps,
    generatedAt: new Date().toISOString(),
    warnings: mergedWarnings,
  };

  const validated = AuditPackSchema.safeParse(pack);
  if (!validated.success) {
    return {
      ...pack,
      status: "partial",
      gaps: [
        ...pack.gaps,
        `Schema validation soft-fail: ${validated.error.message}`,
      ],
    };
  }

  return validated.data;
}
