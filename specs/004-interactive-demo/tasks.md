---
description: "Task list for ProofPulse Interactive Presentation Demo"
---

# Tasks: ProofPulse Interactive Presentation Demo

**Input**: Design documents from `/specs/004-interactive-demo/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md

**Tests**: Not requested as TDD; a logic smoke script validates SC-003/SC-005 (Polish phase).

## Phase 1: Setup

- [X] T001 Add `"allowImportingTsExtensions": true` to `tsconfig.json` (research R4)
- [X] T002 [P] Create scoped dark theme `app/demo/demo.css` (all selectors under `.demo-root`, single-column below 720px)

## Phase 2: Foundational

- [X] T003 Define types in `lib/demo/types.ts` per data-model.md (confidence "Low" | "Medium" | "High"; sourceType "Job ad" | "Procurement notice" | "Registry change" | "Company website")
- [X] T004 [P] Implement `lib/demo/business-case.ts` (`clampAssumptions` hours 0–80, pct 0–100, cost 0–300; `computeBusinessCase`; `formatEur`)
- [X] T005 Create demo page shell `app/demo/page.tsx` with header, illustrative-data notice, and step state machine (reset rules from data-model.md)
- [X] T006 [P] Implement `components/demo/StepIndicator.tsx` (4 steps, active/complete)
- [X] T007 [P] Implement `components/demo/PresenterGuide.tsx` (collapsed `<details>`, 5 steps + next dev step)

## Phase 3: US1 Choose a prospect (P1)

- [X] T008 [US1] Author ≥4 fictional companies with ≥2 signals each in `lib/demo/companies.ts` (include Nordic Components Oy reporting signal: priority 82, Medium, defaults 12/50/40)
- [X] T009 [US1] Implement `components/demo/ProspectStep.tsx` (company + signal selects, prospect card, "Fictional company" badge, priority bar, confidence, caution, Investigate button)

## Phase 4: US2 Investigate (P1)

- [X] T010 [US2] Implement `components/demo/InvestigationStep.tsx` (hypothesis, Observed evidence with source type tags, Unverified assumptions, Questions to validate)

## Phase 5: US3 Business case (P1)

- [X] T011 [US3] Implement `components/demo/BusinessCaseStep.tsx` (3 inputs with range hints, 3 result tiles, formula line, not-guaranteed note, demonstration select, Generate button)

## Phase 6: US4 Proof plan + prototype (P2)

- [X] T012 [P] [US4] Add illustrative sample reports in `lib/demo/sample-reports.ts` (3 units, `metric, value, unit` lines)
- [X] T013 [P] [US4] Implement `lib/demo/consolidate.ts` (`parseReport`, `consolidateReports`: Total for hours/count, Average for ratio/%, flag >20% spread; "no metric rows found" fallback)
- [X] T014 [US4] Implement `lib/demo/demonstrations.ts` (3 demo types; `buildProofPlan`)
- [X] T015 [US4] Implement `components/demo/ProofStep.tsx` (plan, Run sample prototype, paste box labelled user-supplied, inputs + result table, manual work, Prepare meeting button)

## Phase 7: US5 Meeting request (P2)

- [X] T016 [US5] Implement `lib/demo/meeting.ts` (`buildMeetingDraft` addressed to COO / Head of Operations, cites signal, hypothesis, demo, estimate)
- [X] T017 [US5] Implement `components/demo/MeetingStep.tsx` (editable textarea, Copy with fallback, "Internal draft — never sent", no send action)

## Phase 8: Polish

- [X] T018 Add header link to `/demo` in `app/page.tsx` (FR-014)
- [X] T019 [P] Add `scripts/smoke-demo.ts` logic smoke test (312 / 12480 / 1040; clamping; consolidation rows; draft contents)
- [X] T020 [P] Update `README.md` with demo route + presentation steps
- [X] T021 Run smoke script and type-check (`tsc --noEmit`; `next build` skipped because the dev server owns `.next`); fix errors

## Phase 9: Revision 2 — compact timeline + shared theme (FR-004, FR-015, FR-016)

- [X] T022 Rewrite `app/demo/demo.css` as layout-only styles under `.demo` using `globals.css` tokens (`--card`, `--line`, `--accent`, `--ink-soft`, `--radius`, `--mono`); remove the dark palette and `.demo-root` background
- [X] T023 Create `components/demo/Timeline.tsx` (`Timeline` rail + `TimelineStep` with status `done | current | locked`, numbered node / ✓, one-line `summary`, click-to-reopen header for done steps); delete `components/demo/StepIndicator.tsx`
- [X] T024 [US1] Compact `components/demo/ProspectStep.tsx` (two selects in one row, inline priority meter + confidence chip, one-line caution, no section heading/subtitle)
- [X] T025 [US2] Compact `components/demo/InvestigationStep.tsx` (one-line hypothesis, evidence vs assumptions two-column lists, questions inside `<details>`, "Build business case →" button)
- [X] T026 [US3] Compact `components/demo/BusinessCaseStep.tsx` (3 inputs in one row, 3 inline KPIs, formula as one mono line, demo select + generate button in one row)
- [X] T027 [US4] Compact `components/demo/ProofStep.tsx` (value line + numbered horizontal mini-timeline of prototype steps; data/run/limitations and paste box in `<details>`; result table kept; inputs in `<details>`; manual work as one line)
- [X] T028 [US5] Compact `components/demo/MeetingStep.tsx` (To/Subject line, label chip, textarea, copy button + status in one row, one-line never-sent note)
- [X] T029 Trim `components/demo/PresenterGuide.tsx` to a collapsed 5-item one-line guide + one-line next step
- [X] T030 Rewire `app/demo/page.tsx` into a 5-step timeline (`reached` derived from state, `open` step state, summaries per step, reset rules unchanged, compact header + one-line notice)
- [X] T031 Run `scripts/smoke-demo.ts` + `tsc --noEmit`; verify `/demo` in browser (theme matches `/`, timeline flow end-to-end, reopen done step)

## Dependencies

Setup → Foundational → US1 → US2 → US3 → US4 → US5 → Polish. US stories are sequential on `app/demo/page.tsx` wiring; lib files (T004, T012, T013) are parallelizable.

## Parallel Examples

- T002, T004, T006, T007 together after T003.
- T012 + T013 together; T019 + T020 together.

## Implementation Strategy

MVP = Phases 1–5 (choose, investigate, business case). Then add proof prototype (US4) and meeting draft (US5).
