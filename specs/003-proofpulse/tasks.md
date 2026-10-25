---
description: "Task list for ProofPulse implementation"
---

# Tasks: ProofPulse

**Input**: Design documents from `/specs/003-proofpulse/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested — validate via quickstart.md

## Phase 1: Setup

- [x] T001 [P] Ensure `.env.example` documents `GROQ_API_KEY` / `GROQ_MODEL` at repository root
- [x] T002 [P] Update root `README.md` for ProofPulse + link to `specs/003-proofpulse/quickstart.md`
- [x] T003 [P] Verify `.gitignore` includes `.env`

## Phase 2: Foundational

- [x] T004 Define ProofPulse types in `types/proofpulse.ts` matching `data-model.md` (score 0–100; confidence high|medium|low; recommendedAction pursue|investigate|reject; draftLabel never-send; soft gate fields)
- [x] T005 [P] Create seed catalog (≥10 Finnish companies) in `data/seed-companies.json`
- [x] T006 [P] Add synthetic proof samples in `data/synthetic-proof/` (at least 2 `.txt` excerpts)
- [x] T007 [P] Implement `lib/seed.ts` loader for seed feed
- [x] T008 [P] Implement transparent scoring in `lib/scoring.ts` with FR-006 weights
- [x] T009 [P] Implement soft CEO gate in `lib/ceo-gate.ts`
- [x] T010 [P] Implement business case calculator in `lib/business-case.ts` (hours×share×cost×52)
- [x] T011 Implement document consolidation proof in `lib/proof-consolidate.ts` (company-public prefer; synthetic fallback labelled)
- [x] T012 Implement on-demand investigate orchestration in `lib/investigate-company.ts` (normalize → fetch → Groq → score → evidence fact/hypothesis)
- [x] T013 Add `GET` `app/api/opportunities/route.ts` returning seed feed
- [x] T014 Add `POST` `app/api/opportunities/investigate/route.ts`
- [x] T015 Add `POST` `app/api/proofs/run/route.ts`

## Phase 3: US1 Opportunity feed (P1)

- [x] T016 [US1] Build `components/OpportunityFeed.tsx` ranked list (score, confidence, signals, action)
- [x] T017 [US1] Wire feed load + on-demand investigate input on `app/page.tsx`

## Phase 4: US2 Investigation (P1)

- [x] T018 [US2] Build `components/InvestigationPanel.tsx` with What we know / What we suspect / Why now separation
- [x] T019 [US2] Show gaps/warnings and combined-signal hypothesis labelling in `components/InvestigationPanel.tsx`

## Phase 5: US3 One-Hour Proof (P1)

- [x] T020 [US3] Build `components/ProofRunner.tsx` showing inputs, output, limitations, synthetic banner when fallback
- [x] T021 [US3] Connect ProofRunner to `POST /api/proofs/run` from `app/page.tsx`

## Phase 6: US4 Business case + CEO gate (P2)

- [x] T022 [US4] Build `components/BusinessCasePanel.tsx` with editable assumptions and live estimate
- [x] T023 [US4] Build `components/CeoGateBadge.tsx` showing pass/fail criteria (soft gate)

## Phase 7: US5 Outreach review (P2)

- [x] T024 [US5] Build `components/OutreachReview.tsx` for COO drafts with copy + approve/reject/investigate (no send); low-confidence label when soft-gated
- [x] T025 [US5] Generate drafts in investigate flow or client helper using Groq optional / template fallback in `lib/investigate-company.ts` or `lib/drafts.ts`

## Phase 8: Polish

- [x] T026 [P] Restyle hero copy for ProofPulse in `app/page.tsx` / `app/globals.css` as needed
- [x] T027 [P] Update `scripts/smoke.ts` for opportunities feed + investigate
- [x] T028 Run quickstart smoke against localhost:3002

## Dependencies

Setup → Foundational → US1 → US2 → US3 → US4 → US5 → Polish

## MVP

T001–T021 (through working proof) is the live Discover→Demonstrate core; US4–US5 complete Convert.

## Independent tests

- US1: feed ≥10 entries with signals
- US2: facts vs hypotheses separated
- US3: proof output + limitations
- US4: assumption edit updates estimate; soft gate lists fails
- US5: copy draft; no send
