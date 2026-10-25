import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { FeedEntry, SeedRecord } from "@/types/proofpulse";

let cache: SeedRecord[] | null = null;

export function loadSeedRecords(): SeedRecord[] {
  if (cache) return cache;
  const path = join(process.cwd(), "data", "seed-companies.json");
  cache = JSON.parse(readFileSync(path, "utf8")) as SeedRecord[];
  return cache;
}

export function seedFeed(): FeedEntry[] {
  return loadSeedRecords()
    .map((r) => ({
      opportunityId: r.opportunity.id,
      companyId: r.company.id,
      companyName: r.company.name,
      domain: r.company.domain,
      industryHint: r.company.industryHint,
      hypothesis: r.opportunity.hypothesis,
      score: r.opportunity.score,
      confidence: r.opportunity.confidence,
      evidenceStrength: r.opportunity.evidenceStrength,
      estimatedAnnualValueEur: r.opportunity.estimatedAnnualValueEur,
      recommendedAction: r.opportunity.recommendedAction,
      signals: r.signals.map((s) => ({
        id: s.id,
        sourceType: s.sourceType,
        summary: s.summary,
        sourceUrl: s.sourceUrl,
      })),
    }))
    .sort((a, b) => b.score - a.score);
}

export function getSeedById(companyId: string): SeedRecord | undefined {
  return loadSeedRecords().find((r) => r.company.id === companyId);
}
