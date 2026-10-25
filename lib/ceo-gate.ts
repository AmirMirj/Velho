import type {
  CeoGateResult,
  Demonstration,
  EvidenceItem,
  Opportunity,
} from "@/types/proofpulse";

export function runCeoAttentionTest(input: {
  opportunity: Opportunity;
  evidence: EvidenceItem[];
  demonstration: Demonstration | null;
  hasAssumptions: boolean;
  draftSpecific: boolean;
}): CeoGateResult {
  const failed: string[] = [];
  const facts = input.evidence.filter((e) => e.kind === "fact" && e.sourceUrl);
  if (facts.length < 1) failed.push("No cited public facts");
  if (!input.opportunity.hypothesis.trim()) failed.push("Missing opportunity hypothesis");
  if (
    !input.demonstration ||
    input.demonstration.status !== "complete"
  ) {
    failed.push("Working demonstration not completed");
  }
  if (!input.hasAssumptions) failed.push("Business-case assumptions missing");
  if (!input.draftSpecific) failed.push("Message not company-specific enough");
  if (input.opportunity.confidence === "low") {
    failed.push("Evidence confidence is low");
  }

  const passed = failed.length === 0;
  return {
    passed,
    failedCriteria: failed,
    allowDraft: true,
    draftLabelExtra: passed
      ? null
      : "INVESTIGATE / low confidence — soft gate failed",
  };
}
