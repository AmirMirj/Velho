import { formatEur } from "./business-case.ts";
import type { BusinessCase, DemoType, DemoTypeId, ExampleCompany, ProofPlan, Signal } from "./types.ts";

export const DEMO_TYPES: DemoType[] = [
  {
    id: "report-consolidation",
    name: "Automated report consolidation",
    runnable: true,
    dataNeeded: [
      "2–4 recent example reports per site or team (anonymised or sample format is enough)",
      "The target leadership report or KPI pack layout",
      "A list of metric names and owners",
    ],
    steps: [
      "Parse each report regardless of layout differences",
      "Normalise metric names and units",
      "Merge into one KPI table with totals or averages",
      "Flag outliers and missing values for human review",
    ],
    runApproach: "Run on copies of last month's reports and compare against the manually built pack.",
    successMeasure: "Consolidated table matches the manual pack, produced in minutes instead of hours.",
    limitations: [
      "Does not connect to live ERP systems in the first proof",
      "New report layouts may need a mapping update",
      "A person still reviews flagged values and writes commentary",
    ],
  },
  {
    id: "document-extraction",
    name: "Document data extraction",
    runnable: false,
    dataNeeded: [
      "20–50 example documents (PDF, scans or forms), anonymised",
      "The target fields to capture and where they go today",
    ],
    steps: [
      "Extract text and key fields from each document",
      "Validate fields against simple rules (dates, IDs, totals)",
      "Export to a structured sheet ready for the existing system",
    ],
    runApproach: "Process a batch of historical documents and measure accuracy field by field.",
    successMeasure: "≥90% of target fields captured correctly; exceptions routed for review.",
    limitations: [
      "Handwriting and poor scans reduce accuracy",
      "Prototype does not write into production systems",
    ],
  },
  {
    id: "request-triage",
    name: "Request triage and routing",
    runnable: false,
    dataNeeded: [
      "100–200 anonymised historical requests with their final category",
      "The routing rules or team list",
    ],
    steps: [
      "Classify each request by type and urgency",
      "Suggest the right team or location",
      "Draft a first acknowledgement for human approval",
    ],
    runApproach: "Replay historical requests and compare suggested routing with actual routing.",
    successMeasure: "Correct routing for ≥85% of requests; time-to-first-response reduced.",
    limitations: [
      "Sensitive personal data must be excluded or anonymised",
      "Humans approve every outgoing response",
    ],
  },
];

export function findDemoType(id: DemoTypeId): DemoType {
  return DEMO_TYPES.find((d) => d.id === id) ?? DEMO_TYPES[0];
}

export function buildProofPlan(
  company: ExampleCompany,
  signal: Signal,
  demoId: DemoTypeId,
  bc: BusinessCase
): ProofPlan {
  const d = findDemoType(demoId);
  return {
    companyName: company.name,
    signalTitle: signal.title,
    demoId: d.id,
    demoName: d.name,
    runnable: d.runnable,
    intro: `A small, time-boxed ${d.name.toLowerCase()} prototype for ${company.name}, designed to test the hypothesis: “${signal.hypothesis}”`,
    dataNeeded: d.dataNeeded,
    steps: d.steps,
    runApproach: d.runApproach,
    successMeasure: d.successMeasure,
    limitations: d.limitations,
    valueLine: `If validated at ${bc.clamped.hoursPerWeek} h/week and ${bc.clamped.automationPct}% automation, this would release about ${bc.hoursPerYear} hours per year (≈${formatEur(bc.annual)} capacity value).`,
  };
}
