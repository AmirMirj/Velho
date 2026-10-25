---
description: "Task list for Guided Demo Desk"
---

# Tasks: Guided Demo Desk

**Input**: `/specs/005-guided-demo-desk/` (plan, spec, research, data-model, contracts)
**Tests**: logic smoke + Playwright e2e (Polish phase).

## Phase 1: Setup

- [X] T001 Rewrite theme tokens in `app/globals.css` to the dark desk palette (slate bg, emerald accent, amber warn, sky info, Plus Jakarta Sans with system fallback), replacing hard-coded light colours

## Phase 2: Foundational

- [X] T002 [P] Implement `lib/demo/priority.ts` `breakdown(signal)` with caps evidence ≤40, workload ≤35, fit ≤25 and exact sum = priority
- [X] T003 [P] Implement `lib/demo/tour.ts` with 7 TourSteps (title ≤40 chars, one sentence text, target 1–6)
- [X] T004 Lift consolidation result state from `components/demo/ProofStep.tsx` into `app/demo/page.tsx`; add `reached = 6` recap stage and a single `nextAction()`

## Phase 3: US1 Guided tour (P1)

- [X] T005 [US1] Create `components/demo/CoachCard.tsx` ("Guided demo · N of 7", Back, Exit, Next: do it / Finish; testids per contract)
- [X] T006 [US1] Wire tour in `app/demo/page.tsx`: Play resets flow, each step runs real action, Escape exits, manual company/signal change closes tour

## Phase 4: US2 Prospect cards + breakdown (P1)

- [X] T007 [P] [US2] Create `components/demo/CompanyPicker.tsx` (cards with name, industry, best priority, fictional tag; signal chips; aria-pressed)
- [X] T008 [P] [US2] Create `components/demo/PriorityBreakdown.tsx` (labelled stacked bar, `data-sum`)
- [X] T009 [US2] Update `components/demo/ProspectStep.tsx` to use picker + breakdown, remove inner next button

## Phase 5: US3 Funnel + sticky action (P1)

- [X] T010 [P] [US3] Create `components/demo/FunnelStrip.tsx` (5 stages, live values, clickable reached stages)
- [X] T011 [P] [US3] Create `components/demo/ActionBar.tsx` (sticky, one primary action, → hint)
- [X] T012 [US3] Remove inner next buttons from Investigation/BusinessCase/Proof steps; add ArrowRight shortcut in `app/demo/page.tsx`

## Phase 6: US4 Recap (P2)

- [X] T013 [US4] Create `components/demo/Recap.tsx` (company, signal, annual + formula, prototype result, draft status; Run again / Try another company)

## Phase 7: US5 Theme (P2)

- [X] T014 [US5] Rewrite `app/demo/demo.css` layout-only for dark tokens (cards, chips, funnel, coach, sticky bar, recap, reduced-motion, narrow screens)
- [X] T015 [US5] Add sticky translucent header to `app/page.tsx` workspace via shared `.topbar` class in `app/globals.css`

## Phase 8: Polish

- [X] T016 [P] Extend `scripts/smoke-demo.ts` with SC-004 breakdown invariant and tour length checks
- [X] T017 [P] Create `scripts/e2e-demo.mjs` (Playwright: tour-only run to recap, manual → run, one primary action per state, Escape)
- [X] T018 Refine via Playwright MCP pass at 1280×800 and 390px; fix issues found
- [X] T019 Update `README.md` demo section
- [X] T020 Fix workspace feed row misalignment in `app/globals.css` `.opp-row` (fixed score column, all text in column 2) and add alignment check to `scripts/e2e-demo.mjs`

## Dependencies

T001 → T014/T015; T002–T004 → US phases; US1 depends on T004 + US3 (next action). US2/US3/US4 parallel after Phase 2.

## Parallel examples

- T002 ∥ T003; T007 ∥ T008 ∥ T010 ∥ T011; T016 ∥ T017.

## Implementation strategy

MVP = Phase 1–5 (theme, cards, funnel, sticky next, tour). Then recap, polish, tests.
