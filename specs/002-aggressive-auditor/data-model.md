# Data Model: Aggressive Auditor

## Entities

### TargetCompany

| Field | Type | Rules |
|-------|------|--------|
| name | string | Required; from LLM or domain stem |
| domain | string | Required; hostname without path |
| inputRaw | string | Required; operator input |
| snapshot | string | 1–3 sentences from public text |
| industryHint | string \| null | Optional |
| sizeHint | string \| null | Optional |

### PublicSignal

| Field | Type | Rules |
|-------|------|--------|
| id | string | Required unique within pack |
| sourceLabel | string | e.g. homepage, /en/careers |
| sourceUrl | string | Absolute URL fetched |
| excerpt | string | Short quote from public text |
| whyItMatters | string | Plain language |

### Leak

| Field | Type | Rules |
|-------|------|--------|
| id | string | Required unique |
| title | string | Specific, non-generic |
| impactScore | number | Integer 1–5 (business impact) |
| effortScore | number | Integer 1–5 (fix effort) |
| rank | number | 1 = highest priority; unique order |
| rationale | string | Grounded in signals |
| tryFirst | string | Smallest useful conceptual fix |
| confidence | enum | `high` \| `medium` \| `low` only |
| signalIds | string[] | Must reference existing signal ids when evidence exists; empty ⇒ confidence `low` |
| conceptualFix | string | What we “already coded” as a concept |
| stagingPreviewHtml | string \| null | Safe HTML for in-app preview; concept labelled |

### OutreachDraft

| Field | Type | Rules |
|-------|------|--------|
| channel | enum | `email` \| `linkedin` |
| addresseeRole | string | Default `COO / Head of Operations` |
| subject | string \| null | Required for email |
| body | string | References ≥1 leak when available |
| draftLabel | string | Exact: `DRAFT — internal use only — do not send from this tool` |
| relatedLeakIds | string[] | Optional links to leak ids |

### AuditPack

| Field | Type | Rules |
|-------|------|--------|
| status | enum | `complete` \| `partial` \| `error` |
| company | TargetCompany \| null | null only on hard error before resolve |
| signals | PublicSignal[] | May be empty on error |
| leaks | Leak[] | Max 5; fewer OK if thin |
| drafts | OutreachDraft[] | Exactly email + linkedin when status ≠ error |
| gaps | string[] | Fetch/LLM/honest missing pieces |
| warnings | string[] | e.g. guessed domain |
| generatedAt | string | ISO-8601 |
| mode | string | Constant `aggressive-auditor` for UI |

## Relationships

```text
AuditPack 1──* PublicSignal
AuditPack 1──* Leak
AuditPack 1──* OutreachDraft
Leak *──* PublicSignal (via signalIds)
OutreachDraft *──* Leak (via relatedLeakIds)
```

## State transitions

```text
idle → generating → complete
                 ↘ partial (thin signals / some fetch gaps / schema soft-fail)
                 ↘ error (no usable text / hard failure)
```

## Validation rules

- Never invent executive names, emails, phones, or security CVEs.
- Never claim staging preview was deployed on the prospect’s production site.
- `confidence` must be normalized (`moderate` → `medium`).
- Leaks without valid `signalIds` must be `confidence: low`.
