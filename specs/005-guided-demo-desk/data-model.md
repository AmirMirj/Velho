# Data Model: Guided Demo Desk

Extends `specs/004-interactive-demo/data-model.md`.

## PriorityBreakdown (derived)
| Field | Type | Rule |
|-------|------|------|
| evidence | int | 0–40 |
| workload | int | 0–35 |
| fit | int | 0–25 |
Invariant: `evidence + workload + fit === signal.priority`.

## TourStep
| Field | Type | Rule |
|-------|------|------|
| id | string | unique |
| title | string | ≤ 40 chars |
| text | string | one sentence |
| actionLabel | string | "Next: do it" / "Finish" |
| target | 1–6 | step/funnel stage highlighted (6 = recap) |

7 steps: choose → investigate → case → proof → run → meeting → recap.

## FunnelStage (derived)
`{ n: 1..5, label, value: string, state: "done" | "current" | "locked" }`

## Demo state transitions
`reached`: 1 Prospect → 2 Investigate → 3 Case → 4 Proof → 5 Meeting → 6 Recap.
- Company/signal change → reset to 1, close tour.
- Demonstration change → reset to 3.
- Consolidation result lives in page state (needed by funnel + recap); cleared on plan regenerate.
