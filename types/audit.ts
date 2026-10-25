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

export interface Leak {
  id: string;
  title: string;
  impactScore: number;
  effortScore: number;
  rank: number;
  rationale: string;
  tryFirst: string;
  confidence: Confidence;
  signalIds: string[];
  conceptualFix: string;
  stagingPreviewHtml: string | null;
}

export interface OutreachDraft {
  channel: DraftChannel;
  addresseeRole: string;
  subject: string | null;
  body: string;
  draftLabel: string;
  relatedLeakIds: string[];
}

export interface AuditPack {
  status: PackStatus;
  mode: "aggressive-auditor";
  company: TargetCompany | null;
  signals: PublicSignal[];
  leaks: Leak[];
  drafts: OutreachDraft[];
  gaps: string[];
  generatedAt: string;
  warnings: string[];
}

export interface HeuristicFinding {
  id: string;
  title: string;
  detail: string;
  sourceUrl: string;
  sourceLabel: string;
  severity: "high" | "medium" | "low";
}
