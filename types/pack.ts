export type Confidence = "high" | "medium" | "low";
export type PackStatus = "complete" | "partial" | "error";
export type DraftChannel = "email" | "linkedin";

export interface TargetCompany {
  name: string;
  domain: string;
  inputRaw: string;
  snapshot: string;
  industryHint: string | null;
  sizeHint: string | null;
}

export interface PublicSignal {
  id: string;
  sourceLabel: string;
  sourceUrl: string;
  excerpt: string;
  whyItMatters: string;
}

export interface OpportunityHypothesis {
  id: string;
  title: string;
  valueScore: number;
  effortScore: number;
  rank: number;
  rationale: string;
  tryFirst: string;
  confidence: Confidence;
  signalIds: string[];
}

export interface OutreachDraft {
  channel: DraftChannel;
  addresseeRole: string;
  subject: string | null;
  body: string;
  draftLabel: string;
  relatedOpportunityIds: string[];
}

export interface ProofPack {
  status: PackStatus;
  company: TargetCompany | null;
  signals: PublicSignal[];
  opportunities: OpportunityHypothesis[];
  drafts: OutreachDraft[];
  gaps: string[];
  generatedAt: string;
  warnings: string[];
}
