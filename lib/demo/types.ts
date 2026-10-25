export type Confidence = "Low" | "Medium" | "High";

export type SourceType =
  | "Job ad"
  | "Procurement notice"
  | "Registry change"
  | "Company website";

export type DemoTypeId =
  | "report-consolidation"
  | "document-extraction"
  | "request-triage";

export interface Assumptions {
  hoursPerWeek: number;
  automationPct: number;
  costPerHour: number;
}

export interface EvidenceItem {
  text: string;
  sourceType: SourceType;
}

export interface Signal {
  id: string;
  title: string;
  sourceType: SourceType;
  evidence: EvidenceItem[];
  assumptions: string[];
  questions: string[];
  hypothesis: string;
  priority: number;
  confidence: Confidence;
  caution: string;
  defaults: Assumptions;
  recommendedDemo: DemoTypeId;
}

export interface ExampleCompany {
  id: string;
  name: string;
  industry: string;
  description: string;
  signals: Signal[];
}

export interface BusinessCase {
  clamped: Assumptions;
  hoursPerYear: number;
  annual: number;
  monthly: number;
}

export interface DemoType {
  id: DemoTypeId;
  name: string;
  runnable: boolean;
  dataNeeded: string[];
  steps: string[];
  runApproach: string;
  successMeasure: string;
  limitations: string[];
}

export interface ProofPlan {
  companyName: string;
  signalTitle: string;
  demoId: DemoTypeId;
  demoName: string;
  runnable: boolean;
  intro: string;
  dataNeeded: string[];
  steps: string[];
  runApproach: string;
  successMeasure: string;
  limitations: string[];
  valueLine: string;
}

export interface ReportInput {
  name: string;
  text: string;
  origin: "sample" | "user-supplied";
}

export interface ConsolidatedRow {
  metric: string;
  unit: string;
  perUnit: Record<string, number>;
  aggregate: number;
  aggregateLabel: "Total" | "Average";
  flagged: boolean;
}

export interface ConsolidationResult {
  inputs: ReportInput[];
  units: string[];
  rows: ConsolidatedRow[];
  manualWork: string[];
  warning?: string;
}

export interface MeetingDraft {
  addressee: string;
  subject: string;
  body: string;
  label: string;
}
