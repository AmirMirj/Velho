# Data Model: ProofPulse Interactive Presentation Demo

All entities are in-memory TypeScript objects (`lib/demo/types.ts`).

## ExampleCompany
| Field | Type | Rules |
|---|---|---|
| id | string | unique slug |
| name | string | fictional, Finnish-style (e.g. "Nordic Components Oy") |
| industry | string | e.g. "Manufacturing" |
| description | string | 1 sentence, illustrative |
| signals | Signal[] | ≥ 2 |

## Signal
| Field | Type | Rules |
|---|---|---|
| id | string | unique |
| title | string | shown in signal dropdown |
| sourceType | "Job ad" \| "Procurement notice" \| "Registry change" \| "Company website" | required |
| evidence | {text, sourceType}[] | ≥ 1, observed only |
| assumptions | string[] | ≥ 1, unverified |
| questions | string[] | ≥ 1 |
| hypothesis | string | phrased "may", never as fact |
| priority | number | 0–100 |
| confidence | "Low" \| "Medium" \| "High" | independent of priority |
| caution | string | what signal does not prove |
| defaults | Assumptions | within FR-007 ranges |
| recommendedDemo | DemoTypeId | |

## Assumptions (business case)
| Field | Range |
|---|---|
| hoursPerWeek | 0–80 |
| automationPct | 0–100 |
| costPerHour | 0–300 |

Derived: `hoursPerYear = round(h × pct/100 × 52)`, `annual = round(h × pct/100 × 52 × cost)`, `monthly = round(annual/12)`.

## DemoType
`id: "report-consolidation" | "document-extraction" | "request-triage"`, `name`, `runnable: boolean` (only consolidation true).

## ProofPlan
`companyName, signalTitle, demoName, dataNeeded[], steps[], runApproach, successMeasure, limitations[], valueLine`.

## ConsolidationResult
`inputs: {name, text, origin: "sample" | "user-supplied"}[]`, `rows: {metric, unit, perUnit: Record<string, number>, aggregate, aggregateLabel: "Total" | "Average", flagged: boolean}[]`, `manualWork[]`, `warning?: string`.

## MeetingDraft
`addressee: "COO / Head of Operations"`, `subject`, `body`, `label: "Internal draft — never sent"`.

## Timeline view state (revision 2)
`reached: 1–5` (furthest unlocked step), `open: 1–5` (expanded step). Step status = `done` if n < reached, `current` if n == open, `locked` if n > reached. Actions set `reached = open = n+1`.

## State transitions (page)
`step: 1 Detect → 2 Investigate → 3 Prove value → 4 Prepare meeting`. Changing company/signal → step 1 (clear investigation, proof, run, draft). Changing demo type → clear proof, run, draft (step ≤ 2). Business case is visible and editable once investigation is shown.
