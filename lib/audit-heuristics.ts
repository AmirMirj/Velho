import type { FetchedPage, PublicFetchResult } from "@/lib/fetch-public";
import type { HeuristicFinding } from "@/types/audit";

const CTA_HINTS =
  /\b(contact|demo|get started|request|book|talk to|speak with|schedule|quote|buy|subscribe)\b/i;

/**
 * Deterministic UX/ops friction detectors from public HTML text.
 * Explicitly NOT security vulnerability scanning.
 */
export function runAuditHeuristics(
  fetched: PublicFetchResult
): HeuristicFinding[] {
  const findings: HeuristicFinding[] = [];
  let n = 0;
  const nextId = () => `heur-${++n}`;

  const okPages = fetched.pages.filter((p) => p.ok);
  const hasAbout = okPages.some((p) => /about/i.test(p.label));
  const hasCareers = okPages.some((p) => /career|job/i.test(p.label));
  const hasCompany = okPages.some((p) => /company|investor/i.test(p.label));
  const missingFamilies: string[] = [];
  if (!hasAbout) missingFamilies.push("about");
  if (!hasCareers) missingFamilies.push("careers/jobs");
  if (!hasCompany) missingFamilies.push("company/investors");

  if (missingFamilies.length >= 2) {
    findings.push({
      id: nextId(),
      title: "Key public journeys missing or unreachable",
      detail: `Could not retrieve usable public pages for: ${missingFamilies.join(
        ", "
      )}. Buyers and talent may bounce before converting.`,
      sourceUrl: fetched.pages[0]?.url || "",
      sourceLabel: "paths",
      severity: "high",
    });
  }

  for (const page of okPages) {
    if (page.text.length < 400 && page.label !== "homepage") {
      findings.push({
        id: nextId(),
        title: `Thin public content on ${page.label}`,
        detail: `Only ~${page.text.length} characters of readable text — weak trust/ops signal for buyers scanning this page.`,
        sourceUrl: page.url,
        sourceLabel: page.label,
        severity: "medium",
      });
    }
    if (page.text.length > 7000) {
      findings.push({
        id: nextId(),
        title: `Heavy public page payload on ${page.label}`,
        detail: `Extracted text is very large (~${page.text.length} chars). Likely slow/noisy experience that can hurt conversion.`,
        sourceUrl: page.url,
        sourceLabel: page.label,
        severity: "medium",
      });
    }
  }

  const home = okPages.find((p) => p.label === "homepage" || p.label === "/en");
  if (home && !CTA_HINTS.test(home.text)) {
    findings.push({
      id: nextId(),
      title: "Weak public call-to-action language on entry page",
      detail:
        "Homepage/entry copy lacks obvious contact/demo/CTA phrasing — operators may struggle to convert curious buyers.",
      sourceUrl: home.url,
      sourceLabel: home.label,
      severity: "medium",
    });
  }

  if (okPages.length === 1) {
    findings.push({
      id: nextId(),
      title: "Single public surface dominates the web presence",
      detail:
        "Only one substantial public page was retrieved. Ops and trust stories may be hard for buyers to verify without a call.",
      sourceUrl: okPages[0].url,
      sourceLabel: okPages[0].label,
      severity: "low",
    });
  }

  // Deduplicate by title; keep top 6 seeds for the LLM
  const seen = new Set<string>();
  const unique: HeuristicFinding[] = [];
  for (const f of findings) {
    if (seen.has(f.title)) continue;
    seen.add(f.title);
    unique.push(f);
    if (unique.length >= 6) break;
  }
  return unique;
}

export function heuristicsAsPromptBlock(
  findings: HeuristicFinding[],
  pages: FetchedPage[]
): string {
  const pageSummary = pages
    .map(
      (p) =>
        `- ${p.label} | ${p.url} | ${p.ok ? `ok (${p.text.length} chars)` : p.error || "fail"}`
    )
    .join("\n");
  const seeds = findings.length
    ? findings
        .map(
          (f) =>
            `- [${f.id}] (${f.severity}) ${f.title}: ${f.detail} (${f.sourceLabel} ${f.sourceUrl})`
        )
        .join("\n")
    : "- (none — rely on source text carefully)";
  return `Fetch page summary:\n${pageSummary}\n\nHeuristic UX/ops seeds (NOT security vulns):\n${seeds}`;
}
