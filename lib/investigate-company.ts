import { chatJson } from "@/lib/openrouter";
import { fetchPublicCompanyPages } from "@/lib/fetch-public";
import {
  actionFromScore,
  confidenceFromSignals,
  computeScore,
  defaultBreakdown,
  evidenceStrengthFromSignals,
} from "@/lib/scoring";
import { buildDrafts } from "@/lib/drafts";
import {
  guessDomainFromName,
  normalizeCompanyInput,
} from "@/lib/normalize-url";
import type {
  EvidenceItem,
  InvestigationResult,
  Signal,
} from "@/types/proofpulse";

const SYSTEM = `You are ProofPulse's evidence analyst for Velho.
Return JSON only from PUBLIC website text.
Separate facts (must quote/support from text) vs hypotheses (ops automation guesses).
Never invent executives, emails, CVEs, or private systems.
confidence must be high|medium|low.
English.`;

interface LlmOut {
  companyName: string;
  industryHint: string | null;
  snapshotFacts: { text: string; sourceLabel: string }[];
  hypothesis: string;
  whyNow: string;
  gaps: string[];
}

export async function investigateCompany(
  input: string
): Promise<InvestigationResult> {
  const gaps: string[] = [];
  const warnings: string[] = [];
  const normalized = normalizeCompanyInput(input);
  let domain: string;
  let homepageUrl: string;

  if (normalized.kind === "domain") {
    domain = normalized.domain;
    homepageUrl = normalized.homepageUrl;
  } else {
    const guessed = guessDomainFromName(normalized.name);
    if (!guessed) {
      throw new Error(
        "Could not resolve a domain. Enter a domain (e.g. company.fi)."
      );
    }
    domain = guessed;
    homepageUrl = `https://${guessed}/`;
    warnings.push(
      `Interpreted name "${normalized.name}" as guessed domain ${guessed}.`
    );
  }

  const fetched = await fetchPublicCompanyPages(homepageUrl);
  gaps.push(...fetched.gaps);

  const signals: Signal[] = fetched.pages
    .filter((p) => p.ok)
    .map((p, i) => ({
      id: `live-sig-${i + 1}`,
      sourceType: "website" as const,
      sourceLabel: p.label,
      sourceUrl: p.url,
      publishedAt: null,
      summary: p.text.slice(0, 220),
    }));

  let llm: LlmOut | null = null;
  if (fetched.combinedText.trim()) {
    try {
      const raw = await chatJson(
        SYSTEM,
        `Domain: ${domain}\nText:\n"""${fetched.combinedText.slice(0, 18000)}"""\nReturn JSON: {"companyName","industryHint","snapshotFacts":[{"text","sourceLabel"}],"hypothesis","whyNow","gaps":[]}`
      );
      llm = JSON.parse(raw) as LlmOut;
    } catch (err) {
      gaps.push(
        err instanceof Error ? err.message : "LLM investigation failed"
      );
    }
  } else {
    gaps.unshift("No public website text could be retrieved.");
  }

  const companyId = domain.replace(/\W+/g, "-");
  const company = {
    id: companyId,
    name: llm?.companyName || domain.split(".")[0] || domain,
    domain,
    industryHint: llm?.industryHint ?? null,
    country: "FI",
  };

  const evidence: EvidenceItem[] = [];
  for (const [i, f] of (llm?.snapshotFacts || []).entries()) {
    evidence.push({
      id: `fact-${i + 1}`,
      kind: "fact",
      text: f.text,
      sourceUrl: homepageUrl,
      signalIds: signals[0] ? [signals[0].id] : [],
    });
  }
  for (const s of signals.slice(0, 2)) {
    if (!evidence.some((e) => e.text === s.summary)) {
      evidence.push({
        id: `fact-sig-${s.id}`,
        kind: "fact",
        text: s.summary,
        sourceUrl: s.sourceUrl,
        signalIds: [s.id],
      });
    }
  }

  const hypothesis =
    llm?.hypothesis ||
    "Public materials may indicate manual coordination/reporting load — hypothesis only.";
  evidence.push({
    id: "hyp-1",
    kind: "hypothesis",
    text: `${hypothesis} (Hypothesis to investigate — not confirmed internal process.)`,
    sourceUrl: null,
    signalIds: signals.map((s) => s.id),
  });

  const breakdown = defaultBreakdown(signals);
  const score = computeScore(breakdown);
  const confidence = confidenceFromSignals(signals);
  const evidenceStrength = evidenceStrengthFromSignals(signals);
  const recommendedAction = actionFromScore(score, confidence);

  const opportunity = {
    id: `${companyId}-opp`,
    companyId,
    hypothesis,
    score,
    confidence,
    evidenceStrength,
    estimatedAnnualValueEur: Math.round(10 * 0.6 * 40 * 52),
    recommendedAction,
    signalIds: signals.map((s) => s.id),
    whyNow:
      llm?.whyNow ||
      "Public web signals are available now for a short demonstration.",
    scoreBreakdown: breakdown,
  };

  if (llm?.gaps?.length) gaps.push(...llm.gaps);

  const lowConfidence = confidence === "low" || recommendedAction !== "pursue";
  const drafts = buildDrafts(company, opportunity, lowConfidence);

  const publicDocTexts = fetched.pages
    .filter((p) => p.ok && p.text.length > 200)
    .slice(0, 2)
    .map((p) => ({ name: p.label, text: p.text.slice(0, 4000) }));

  return {
    company,
    signals,
    evidence,
    opportunity,
    drafts,
    gaps: [...new Set(gaps)],
    warnings,
    publicDocTexts,
  };
}
