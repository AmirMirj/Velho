import type { ExampleCompany } from "./types.ts";

// All companies and signals below are FICTIONAL and illustrative.
export const COMPANIES: ExampleCompany[] = [
  {
    id: "nordic-components",
    name: "Nordic Components Oy",
    industry: "Manufacturing",
    description: "Illustrative manufacturer with recurring reporting workflows.",
    signals: [
      {
        id: "nc-reporting-roles",
        title: "Several roles mention reporting and data consolidation",
        sourceType: "Job ad",
        evidence: [
          { text: "Three open roles (controller, production planner, operations analyst) list “weekly reporting” as a core duty.", sourceType: "Job ad" },
          { text: "Two of the ads mention “combining data from several Excel files and ERP exports”.", sourceType: "Job ad" },
          { text: "Company website describes four production sites across Finland.", sourceType: "Company website" },
        ],
        assumptions: [
          "Site reports are consolidated manually each week.",
          "The same metrics are copied between spreadsheets by several people.",
          "Leadership wants faster, more consistent KPI reporting.",
        ],
        questions: [
          "How many hours per week go into preparing the leadership KPI pack?",
          "Which systems do the site reports come from?",
          "What happens when sites report figures in different formats?",
        ],
        hypothesis:
          "Nordic Components may spend significant recurring time consolidating site reports by hand — a candidate for automated report consolidation.",
        priority: 82,
        confidence: "Medium",
        caution: "Hiring language may indicate a workflow worth investigating; it does not prove inefficiency.",
        defaults: { hoursPerWeek: 12, automationPct: 50, costPerHour: 40 },
        recommendedDemo: "report-consolidation",
      },
      {
        id: "nc-new-site",
        title: "Registry shows a new subsidiary for a fifth production site",
        sourceType: "Registry change",
        evidence: [
          { text: "A new subsidiary was registered with a manufacturing line of business.", sourceType: "Registry change" },
          { text: "A website news item mentions “expanding capacity in 2027”.", sourceType: "Company website" },
        ],
        assumptions: [
          "The new site will add another reporting stream to consolidate.",
          "Existing processes will be copied rather than redesigned.",
        ],
        questions: [
          "Will the new site use the same ERP and reporting templates?",
          "Who owns onboarding the new site into group reporting?",
        ],
        hypothesis:
          "Expansion may increase reporting workload before processes are standardised.",
        priority: 64,
        confidence: "Low",
        caution: "A registry change shows a legal event, not an operational problem.",
        defaults: { hoursPerWeek: 6, automationPct: 40, costPerHour: 42 },
        recommendedDemo: "report-consolidation",
      },
    ],
  },
  {
    id: "saimaa-logistics",
    name: "Saimaa Logistics Oy",
    industry: "Logistics",
    description: "Illustrative freight and warehousing operator with high document volume.",
    signals: [
      {
        id: "sl-procurement",
        title: "Public tender asks for digital processing of delivery documents",
        sourceType: "Procurement notice",
        evidence: [
          { text: "A municipal tender awarded to the company requires electronic proof of delivery within 24 hours.", sourceType: "Procurement notice" },
          { text: "Website lists “paper and PDF waybills accepted” for customers.", sourceType: "Company website" },
        ],
        assumptions: [
          "Waybills and delivery notes are keyed in manually.",
          "The 24-hour requirement creates time pressure on office staff.",
        ],
        questions: [
          "How many delivery documents are processed per week?",
          "What share arrives as PDF or scanned paper?",
        ],
        hypothesis:
          "Saimaa Logistics may need faster extraction of data from delivery documents to meet tender obligations.",
        priority: 88,
        confidence: "High",
        caution: "The tender shows a requirement; it does not show how the company currently meets it.",
        defaults: { hoursPerWeek: 20, automationPct: 60, costPerHour: 35 },
        recommendedDemo: "document-extraction",
      },
      {
        id: "sl-customer-service",
        title: "Job ad for customer service coordinator handling email requests",
        sourceType: "Job ad",
        evidence: [
          { text: "Ad describes “sorting and routing incoming customer emails to the right depot”.", sourceType: "Job ad" },
        ],
        assumptions: [
          "Incoming requests are triaged by hand.",
          "Misrouted requests delay responses.",
        ],
        questions: [
          "How many customer requests arrive per day?",
          "How are requests categorised today?",
        ],
        hypothesis: "Request triage may be a repetitive manual task suitable for automation.",
        priority: 58,
        confidence: "Low",
        caution: "One job ad is a weak, single signal.",
        defaults: { hoursPerWeek: 10, automationPct: 40, costPerHour: 32 },
        recommendedDemo: "request-triage",
      },
    ],
  },
  {
    id: "lakeland-health",
    name: "Lakeland Care Services Oy",
    industry: "Healthcare services",
    description: "Illustrative private care provider operating several clinics.",
    signals: [
      {
        id: "lh-referrals",
        title: "Website introduces a new online referral form",
        sourceType: "Company website",
        evidence: [
          { text: "A new web form invites partners to send referrals online.", sourceType: "Company website" },
          { text: "A job ad seeks an “intake coordinator” to process referrals.", sourceType: "Job ad" },
        ],
        assumptions: [
          "Referrals are read and routed manually to clinics.",
          "Volume has grown since the form launched.",
        ],
        questions: [
          "How many referrals arrive per week, and through which channels?",
          "What rules decide which clinic handles a referral?",
        ],
        hypothesis:
          "Lakeland Care may benefit from automated triage of incoming referrals (without processing patient data in the demo).",
        priority: 74,
        confidence: "Medium",
        caution: "Health data is sensitive; any real prototype must use anonymised or synthetic data.",
        defaults: { hoursPerWeek: 15, automationPct: 45, costPerHour: 38 },
        recommendedDemo: "request-triage",
      },
      {
        id: "lh-monthly-reports",
        title: "Annual report mentions monthly quality reporting to municipalities",
        sourceType: "Company website",
        evidence: [
          { text: "Published annual review states that clinics report quality indicators monthly to municipal clients.", sourceType: "Company website" },
        ],
        assumptions: ["Each clinic prepares its report separately and they are merged centrally."],
        questions: ["How are clinic quality figures collected and merged today?"],
        hypothesis: "Monthly quality reporting may involve manual consolidation across clinics.",
        priority: 61,
        confidence: "Low",
        caution: "A reporting obligation does not mean the reporting is manual.",
        defaults: { hoursPerWeek: 5, automationPct: 50, costPerHour: 40 },
        recommendedDemo: "report-consolidation",
      },
    ],
  },
  {
    id: "botnia-energy",
    name: "Botnia Energy Services Oy",
    industry: "Energy & utilities",
    description: "Illustrative regional energy services company with field maintenance teams.",
    signals: [
      {
        id: "be-maintenance-reports",
        title: "Several field technician ads mention daily inspection reports",
        sourceType: "Job ad",
        evidence: [
          { text: "Four technician ads require “filling in daily inspection and maintenance reports”.", sourceType: "Job ad" },
          { text: "A procurement notice for grid maintenance requires monthly condition summaries.", sourceType: "Procurement notice" },
        ],
        assumptions: [
          "Inspection reports are collected as PDFs or forms and summarised by hand.",
          "Monthly condition summaries take office time to compile.",
        ],
        questions: [
          "In which format do technicians submit inspection reports?",
          "Who compiles the monthly condition summary, and how long does it take?",
        ],
        hypothesis:
          "Botnia Energy may spend recurring time turning field reports into monthly summaries.",
        priority: 79,
        confidence: "Medium",
        caution: "The signals combine two sources but still describe duties, not measured effort.",
        defaults: { hoursPerWeek: 14, automationPct: 55, costPerHour: 45 },
        recommendedDemo: "document-extraction",
      },
      {
        id: "be-growth",
        title: "News release announces growth target in service contracts",
        sourceType: "Company website",
        evidence: [
          { text: "Press release targets 30% more service contracts within three years.", sourceType: "Company website" },
        ],
        assumptions: ["Growth will increase administrative load faster than headcount."],
        questions: ["Which back-office tasks grow with each new service contract?"],
        hypothesis: "Planned growth may make manual reporting a bottleneck.",
        priority: 52,
        confidence: "Low",
        caution: "Growth ambitions are not evidence of a specific manual process.",
        defaults: { hoursPerWeek: 8, automationPct: 40, costPerHour: 45 },
        recommendedDemo: "report-consolidation",
      },
    ],
  },
];

export function findCompany(id: string): ExampleCompany {
  return COMPANIES.find((c) => c.id === id) ?? COMPANIES[0];
}
