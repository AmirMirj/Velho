# Data Model: Proof Before Pitch

**Feature**: `001-proof-before-pitch`  
**Date**: 2026-10-24

Session-scoped only — no durable storage. Entities are assembled in one `ProofPack` response and held in the browser until refresh.

## Entities

### TargetCompany

| Field | Type | Rules |
|-------|------|--------|
| name | string | Required; from input or extracted title |
| domain | string | Required once resolved; hostname without scheme |
| inputRaw | string | Original operator input |
| snapshot | string | Short public summary (1–3 sentences) |
| industryHint | string \| null | Optional; only if supported by signals |
| sizeHint | string \| null | Optional; only if supported by signals |

### PublicSignal

| Field | Type | Rules |
|-------|------|--------|
| id | string | Stable within pack (e.g. `sig-1`) |
| sourceLabel | string | e.g. homepage, /careers, /about |
| sourceUrl | string | Absolute URL fetched |
| excerpt | string | Short quote/summary from public text |
| whyItMatters | string | Ops/growth relevance in plain language |

### OpportunityHypothesis

| Field | Type | Rules |
|-------|------|--------|
| id | string | Stable within pack (e.g. `opp-1`) |
| title | string | Short name |
| valueScore | number | 1–5 (higher = more business value) |
| effortScore | number | 1–5 (higher = more effort) |
| rank | number | 1-based display order (value/effort prioritisation) |
| rationale | string | Why this matters for this company |
| tryFirst | string | Concrete “what we’d try first” |
| confidence | `high` \| `medium` \| `low` | `low` if no linked signals |
| signalIds | string[] | Must reference PublicSignal.id; empty only if confidence is `low` |

**Validation**: Prefer 3–5 opportunities; allow fewer when signals are thin; do not invent to pad.

### OutreachDraft

| Field | Type | Rules |
|-------|------|--------|
| channel | `email` \| `linkedin` | Required |
| addresseeRole | string | Default `"COO / Head of Operations"` |
| subject | string \| null | Required for email; null for linkedin |
| body | string | Draft text referencing ≥1 finding when pack has signals |
| draftLabel | string | Must indicate internal draft (e.g. “DRAFT — internal use only — do not send from this tool”) |
| relatedOpportunityIds | string[] | Optional links to opportunities |

### ProofPack

| Field | Type | Rules |
|-------|------|--------|
| status | `complete` \| `partial` \| `error` | |
| company | TargetCompany \| null | null only on hard error before resolve |
| signals | PublicSignal[] | May be empty on partial/error |
| opportunities | OpportunityHypothesis[] | 0–5 |
| drafts | OutreachDraft[] | Expect email + linkedin when status is complete/partial with enough signal |
| gaps | string[] | Human-readable missing pieces / fetch failures |
| generatedAt | string | ISO-8601 timestamp |
| warnings | string[] | e.g. language limitation, low confidence |

## Relationships

```text
ProofPack 1──* PublicSignal
ProofPack 1──* OpportunityHypothesis
ProofPack 1──* OutreachDraft
OpportunityHypothesis *──* PublicSignal (via signalIds)
OutreachDraft *──* OpportunityHypothesis (via relatedOpportunityIds)
ProofPack 1──1 TargetCompany (when resolvable)
```

## State transitions

```text
idle → generating → complete
                 ↘ partial (some fetches/LLM gaps; usable map/drafts may still show)
                 ↘ error (no usable company identity / total failure)
complete|partial|error → idle (new submit) or regenerating (same input resubmit)
```

No shareable pack ID; leaving the session ends the lifecycle.
