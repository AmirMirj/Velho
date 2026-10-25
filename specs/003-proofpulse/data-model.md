# Data Model: ProofPulse

## Entities

### Company
| Field | Type | Rules |
|-------|------|--------|
| id | string | Unique |
| name | string | Required |
| domain | string \| null | Hostname when known |
| industryHint | string \| null | Optional |
| country | string | Default `FI` for seed |

### Signal
| Field | Type | Rules |
|-------|------|--------|
| id | string | Unique within company |
| sourceType | enum | `website` \| `jobs` \| `procurement` \| `registry` \| `other` |
| sourceLabel | string | Required |
| sourceUrl | string \| null | Prefer absolute URL |
| publishedAt | string \| null | ISO date if known |
| summary | string | Observed public fact summary |

### EvidenceItem
| Field | Type | Rules |
|-------|------|--------|
| id | string | Unique |
| kind | enum | `fact` \| `hypothesis` |
| text | string | Required |
| sourceUrl | string \| null | Required when kind=`fact` |
| signalIds | string[] | Optional links |

### Opportunity
| Field | Type | Rules |
|-------|------|--------|
| id | string | Unique |
| companyId | string | Required |
| hypothesis | string | Ops/automation problem hypothesis |
| score | number | 0–100 transparent weighted |
| confidence | enum | `high` \| `medium` \| `low` |
| evidenceStrength | enum | `strong` \| `moderate` \| `weak` |
| estimatedAnnualValueEur | number \| null | Illustrative only |
| recommendedAction | enum | `pursue` \| `investigate` \| `reject` |
| signalIds | string[] | Contributing signals |
| whyNow | string | Timeliness narrative |
| scoreBreakdown | object | Factor → 0–100 contribution before weight |

### ScoreBreakdown factors
- relevance (weight 0.25)
- evidenceStrength (0.30)
- timeliness (0.20)
- demoFeasibility (0.15)
- businessValue (0.10)

### Demonstration
| Field | Type | Rules |
|-------|------|--------|
| id | string | Unique |
| opportunityId | string | Required |
| type | enum | `document-consolidation` |
| inputSource | enum | `company-public` \| `synthetic-fallback` |
| inputs | { name, excerpt }[] | Shown to operator |
| output | object | Structured consolidation result |
| limitations | string[] | Required non-empty |
| status | enum | `idle` \| `running` \| `complete` \| `error` |

### BusinessCase
| Field | Type | Rules |
|-------|------|--------|
| hoursPerWeek | number | Editable assumption |
| automationShare | number | 0–1 |
| laborCostEurPerHour | number | Default 40 |
| estimatedAnnualEur | number | hours×share×cost×52 |
| assumptionsNote | string | Must state illustrative, not guaranteed |
| gate | CeoGateResult | Soft gate result |

### CeoGateResult
| Field | Type | Rules |
|-------|------|--------|
| passed | boolean | True only if all criteria pass |
| failedCriteria | string[] | Empty if passed |
| allowDraft | boolean | Always true (soft gate) |
| draftLabelExtra | string \| null | e.g. investigate/low-confidence |

### OutreachDraft
| Field | Type | Rules |
|-------|------|--------|
| channel | enum | `email` \| `linkedin` |
| addresseeRole | string | Default `COO / Head of Operations` |
| subject | string \| null | |
| body | string | Company-specific |
| draftLabel | string | Never-send label |
| reviewStatus | enum | `pending` \| `approved` \| `rejected` \| `investigate` |
| lowConfidence | boolean | True when soft-gated |

### FeedEntry
Summary projection: company + opportunity score/confidence + top signals + recommendedAction.

## Relationships

```text
Company 1──* Signal
Company 1──* Opportunity
Opportunity *──* Signal
Opportunity 1──* EvidenceItem
Opportunity 0..1── Demonstration
Opportunity 0..1── BusinessCase
Opportunity 0..*── OutreachDraft
```

## State (session)

```text
feed loaded → select company → investigate (optional refresh)
  → run proof → edit business case → gate → draft → approve|reject|investigate
refresh → session cleared; seed reloads
```
