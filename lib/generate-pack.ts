import { ProofPackSchema } from "@/lib/schemas";
import { chatJson } from "@/lib/openrouter";
import { fetchPublicCompanyPages } from "@/lib/fetch-public";
import {
  guessDomainFromName,
  normalizeCompanyInput,
} from "@/lib/normalize-url";
import type {
  OpportunityHypothesis,
  OutreachDraft,
  ProofPack,
  PublicSignal,
  TargetCompany,
} from "@/types/pack";

const DRAFT_LABEL =
  "DRAFT — internal use only — do not send from this tool";

const SYSTEM = `You are a researcher for Velho, a strategic AI growth partner for established companies.
Build a "proof before pitch" pack from PUBLIC website text only.

Hard rules:
- Use ONLY facts supported by the provided source text. Cite by creating signals with excerpts from that text.
- Do NOT invent executive names, emails, phone numbers, internal systems, or private data.
- If evidence is thin, say so: fewer opportunities, confidence "low", and list gaps.
- Opportunities: target 3–5 automation / ops-friction hypotheses that block growth for established operators (COO / head of operations lens). Fewer than 3 only if signals are thin — never pad with fiction.
- Each opportunity needs: title, valueScore 1-5, effortScore 1-5, rank (1=best value/effort), rationale (plain language), tryFirst (concrete smallest useful build), confidence exactly one of "high"|"medium"|"low" (never "moderate"), signalIds referencing signal ids you create.
- If an opportunity has no supporting signal, confidence MUST be "low" and signalIds [].
- Drafts: exactly one email and one linkedin note for addresseeRole "COO / Head of Operations". Reference specific findings. Invite a short meeting. draftLabel MUST be exactly: "${DRAFT_LABEL}"
- Output JSON only matching the schema described in the user message.
- Prefer specificity over generic AI hype. Nordic/Finnish companies are a common audience but any public site is fine.
- English output.`;

interface LlmPack {
  company: {
    name: string;
    domain: string;
    snapshot: string;
    industryHint: string | null;
    sizeHint: string | null;
  };
  signals: PublicSignal[];
  opportunities: OpportunityHypothesis[];
  drafts: OutreachDraft[];
  gaps: string[];
  warnings: string[];
  languageLimitation?: boolean;
}

function normalizeConfidence(
  value: unknown
): "high" | "medium" | "low" {
  const raw = String(value || "").toLowerCase().trim();
  if (raw === "high") return "high";
  if (raw === "low") return "low";
  // map moderate / med / etc. → medium
  return "medium";
}

function normalizeOpportunities(
  opps: OpportunityHypothesis[],
  signalIds: Set<string>
): OpportunityHypothesis[] {
  return opps
    .slice(0, 5)
    .map((o, i) => {
      const validIds = (o.signalIds || []).filter((id) => signalIds.has(id));
      const confidence =
        validIds.length === 0 ? "low" : normalizeConfidence(o.confidence);
      return {
        ...o,
        id: o.id || `opp-${i + 1}`,
        signalIds: validIds,
        confidence,
        valueScore: clampScore(o.valueScore),
        effortScore: clampScore(o.effortScore),
        rank: o.rank || i + 1,
      };
    })
    .sort((a, b) => a.rank - b.rank)
    .map((o, i) => ({ ...o, rank: i + 1 }));
}

function clampScore(n: number): number {
  if (typeof n !== "number" || Number.isNaN(n)) return 3;
  return Math.min(5, Math.max(1, Math.round(n)));
}

function ensureDrafts(
  drafts: OutreachDraft[],
  companyName: string,
  oppIds: string[]
): OutreachDraft[] {
  const email = drafts.find((d) => d.channel === "email");
  const linkedin = drafts.find((d) => d.channel === "linkedin");
  const baseRelated = oppIds.slice(0, 2);

  const out: OutreachDraft[] = [];
  out.push({
    channel: "email",
    addresseeRole: "COO / Head of Operations",
    subject:
      email?.subject ||
      `Quick idea on ops friction at ${companyName} (draft)`,
    body:
      email?.body ||
      `Hi —\n\nLooking at public materials for ${companyName}, a few ops/automation angles stood out. Happy to walk through a small proof of concept if useful.\n\nBest`,
    draftLabel: DRAFT_LABEL,
    relatedOpportunityIds: email?.relatedOpportunityIds?.length
      ? email.relatedOpportunityIds
      : baseRelated,
  });
  out.push({
    channel: "linkedin",
    addresseeRole: "COO / Head of Operations",
    subject: null,
    body:
      linkedin?.body ||
      `Hi — noticed a few public signals of manual ops load at ${companyName}. Would a 15-min walkthrough of a small automation proof be useful?`,
    draftLabel: DRAFT_LABEL,
    relatedOpportunityIds: linkedin?.relatedOpportunityIds?.length
      ? linkedin.relatedOpportunityIds
      : baseRelated,
  });
  return out;
}

async function runLlm(
  domain: string,
  inputRaw: string,
  combinedText: string,
  fetchGaps: string[]
): Promise<LlmPack> {
  const user = `Company input: ${inputRaw}
Resolved domain: ${domain}

Public source text (may be incomplete; Finnish/Swedish/English OK):
"""
${combinedText || "(no text retrieved)"}
"""

Fetch gaps already observed:
${fetchGaps.length ? fetchGaps.map((g) => `- ${g}`).join("\n") : "- none"}

Return JSON object with keys:
{
  "company": { "name", "domain", "snapshot", "industryHint", "sizeHint" },
  "signals": [{ "id", "sourceLabel", "sourceUrl", "excerpt", "whyItMatters" }],
  "opportunities": [{ "id", "title", "valueScore", "effortScore", "rank", "rationale", "tryFirst", "confidence", "signalIds" }],
  "drafts": [{ "channel": "email"|"linkedin", "addresseeRole", "subject", "body", "draftLabel", "relatedOpportunityIds" }],
  "gaps": string[],
  "warnings": string[],
  "languageLimitation": boolean
}`;

  const raw = await chatJson(SYSTEM, user);
  const parsed = JSON.parse(raw) as LlmPack;
  return parsed;
}

function errorPack(
  inputRaw: string,
  gaps: string[],
  warnings: string[] = []
): ProofPack {
  return {
    status: "error",
    company: null,
    signals: [],
    opportunities: [],
    drafts: [],
    gaps,
    generatedAt: new Date().toISOString(),
    warnings,
  };
}

export async function generateProofPack(input: string): Promise<ProofPack> {
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
      return errorPack(input, [
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

  if (!fetched.combinedText.trim()) {
    return {
      status: "error",
      company: {
        name: domain.split(".")[0] || domain,
        domain,
        inputRaw: input,
        snapshot: "No public website text could be retrieved.",
        industryHint: null,
        sizeHint: null,
      },
      signals: [],
      opportunities: [],
      drafts: [],
      gaps,
      generatedAt: new Date().toISOString(),
      warnings,
    };
  }

  let llm: LlmPack | null = null;
  let lastError: string | null = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const repair =
        attempt === 0
          ? ""
          : `\nPrevious JSON failed validation: ${lastError}. Fix and return valid JSON only.`;
      llm = await runLlm(
        domain,
        input,
        fetched.combinedText + repair,
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
      company: {
        name: domain,
        domain,
        inputRaw: input,
        snapshot: "Public pages were fetched but analysis failed.",
        industryHint: null,
        sizeHint: null,
      },
      signals: [],
      opportunities: [],
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

  const signalIdSet = new Set(signals.map((s) => s.id));
  const opportunities = normalizeOpportunities(
    llm.opportunities || [],
    signalIdSet
  );

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
    opportunities.length < 3 ||
    fetched.pages.filter((p) => p.ok).length < 2;

  let status: ProofPack["status"] = "complete";
  if (thin || mergedGaps.length > 0) status = "partial";
  if (opportunities.length === 0 && signals.length === 0) status = "error";

  const drafts =
    status === "error"
      ? []
      : ensureDrafts(
          llm.drafts || [],
          company.name,
          opportunities.map((o) => o.id)
        );

  const pack: ProofPack = {
    status,
    company,
    signals,
    opportunities,
    drafts,
    gaps: mergedGaps,
    generatedAt: new Date().toISOString(),
    warnings: mergedWarnings,
  };

  const validated = ProofPackSchema.safeParse(pack);
  if (!validated.success) {
    // One repair attempt already done at LLM layer; return best-effort partial
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
