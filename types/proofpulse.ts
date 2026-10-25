export type Confidence = "high" | "medium" | "low";
export type EvidenceStrength = "strong" | "moderate" | "weak";
export type RecommendedAction = "pursue" | "investigate" | "reject";
export type SignalSourceType =
  | "website"
  | "jobs"
  | "procurement"
  | "registry"
  | "other";
export type EvidenceKind = "fact" | "hypothesis";
export type ReviewStatus = "pending" | "approved" | "rejected" | "investigate";

export interface ScoreBreakdown {
  relevance: number;
  evidenceStrength: number;
  timeliness: number;
  demoFeasibility: number;
  businessValue: number;
}

export interface Company {
  id: string;
  name: string;
  domain: string | null;
  industryHint: string | null;
  country: string;
}

export interface Signal {
  id: string;
  sourceType: SignalSourceType;
  sourceLabel: string;
  sourceUrl: string | null;
  publishedAt: string | null;
  summary: string;
}

export interface EvidenceItem {
  id: string;
  kind: EvidenceKind;
  text: string;
  sourceUrl: string | null;
  signalIds: string[];
}

export interface Opportunity {
  id: string;
  companyId: string;
  hypothesis: string;
  score: number;
  confidence: Confidence;
  evidenceStrength: EvidenceStrength;
  estimatedAnnualValueEur: number | null;
  recommendedAction: RecommendedAction;
  signalIds: string[];
  whyNow: string;
  scoreBreakdown: ScoreBreakdown;
}

export interface FeedEntry {
  opportunityId: string;
  companyId: string;
  companyName: string;
  domain: string | null;
  industryHint: string | null;
  hypothesis: string;
  score: number;
  confidence: Confidence;
  evidenceStrength: EvidenceStrength;
  estimatedAnnualValueEur: number | null;
  recommendedAction: RecommendedAction;
  signals: Pick<Signal, "id" | "sourceType" | "summary" | "sourceUrl">[];
}

export interface SeedRecord {
  company: Company;
  signals: Signal[];
  evidence: EvidenceItem[];
  opportunity: Opportunity;
}

export interface Demonstration {
  id: string;
  opportunityId: string | null;
  type: "document-consolidation";
  inputSource: "company-public" | "synthetic-fallback";
  inputs: { name: string; excerpt: string }[];
  output: {
    tablesExtracted: number;
    rows: Record<string, string>[];
    summary: string;
  };
  limitations: string[];
  status: "idle" | "running" | "complete" | "error";
}

export interface BusinessCaseAssumptions {
  hoursPerWeek: number;
  automationShare: number;
  laborCostEurPerHour: number;
}

export interface CeoGateResult {
  passed: boolean;
  failedCriteria: string[];
  allowDraft: boolean;
  draftLabelExtra: string | null;
}

export interface OutreachDraft {
  channel: "email" | "linkedin";
  addresseeRole: string;
  subject: string | null;
  body: string;
  draftLabel: string;
  reviewStatus: ReviewStatus;
  lowConfidence: boolean;
}

export interface InvestigationResult {
  company: Company;
  signals: Signal[];
  evidence: EvidenceItem[];
  opportunity: Opportunity;
  drafts: OutreachDraft[];
  gaps: string[];
  warnings: string[];
  publicDocTexts: { name: string; text: string }[];
}
