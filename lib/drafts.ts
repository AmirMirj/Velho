import type { OutreachDraft, Opportunity, Company } from "@/types/proofpulse";

const DRAFT_LABEL = "Draft only — read before sharing";

export function buildDrafts(
  company: Company,
  opportunity: Opportunity,
  lowConfidence: boolean
): OutreachDraft[] {
  const extra = lowConfidence
    ? "\n\n(Note: We have only a few public clues so far. This is a guess, not a confirmed problem.)"
    : "";
  return [
    {
      channel: "email",
      addresseeRole: "Head of Operations",
      subject: `A small report example for ${company.name} (draft)`,
      body: `Hello —\n\nWe noticed a few things on public pages about ${company.name}. They may mean ${opportunity.hypothesis.toLowerCase()} This is only a guess, not a confirmed problem.\n\nWe made a small example of combining reports. It uses sample information and does not need access to your computer systems.\n\nWould you like to take a quick look?${extra}\n\nBest`,
      draftLabel: DRAFT_LABEL,
      reviewStatus: "pending",
      lowConfidence,
    },
    {
      channel: "linkedin",
      addresseeRole: "Head of Operations",
      subject: null,
      body: `Hello — we noticed a few things on public pages about ${company.name}. They may mean ${opportunity.hypothesis.toLowerCase()} This is only a guess. We made a small report example using sample information. Would you like to take a quick look?${extra}`,
      draftLabel: DRAFT_LABEL,
      reviewStatus: "pending",
      lowConfidence,
    },
  ];
}
