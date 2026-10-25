---
description: "Task list for Aggressive Auditor implementation"
---

# Tasks: Aggressive Auditor

**Input**: Design documents from `/specs/002-aggressive-auditor/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested — validate via `quickstart.md`.

**Organization**: Tasks grouped by user story (US1–US4).

## Format: `[ID] [P?] [Story] Description`

## Path Conventions

Next.js App Router at repository root (`app/`, `components/`, `lib/`, `types/`) per plan.md.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align env/docs with Groq + Aggressive Auditor (app already exists)

- [x] T001 [P] Update `.env.example` with `GROQ_API_KEY=` and `GROQ_MODEL=openai/gpt-oss-120b` in repository root
- [x] T002 [P] Update root `README.md` to describe Aggressive Auditor mode, Groq env, and link to `specs/002-aggressive-auditor/quickstart.md`
- [x] T003 [P] Verify `.gitignore` includes `.env` (append if missing)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Audit types, schemas, heuristics, generator, API route — MUST complete before UI stories

- [x] T004 Define `TargetCompany`, `PublicSignal`, `Leak`, `OutreachDraft`, `AuditPack` in `types/audit.ts` matching `specs/002-aggressive-auditor/data-model.md` (impactScore/effortScore 1–5; confidence `high`|`medium`|`low`; status `complete`|`partial`|`error`; leaks max 5; mode `aggressive-auditor`)
- [x] T005 [P] Implement Zod schemas `GenerateAuditRequestSchema` and `AuditPackSchema` in `lib/schemas.ts` aligned with `specs/002-aggressive-auditor/contracts/openapi.yaml`
- [x] T006 [P] Implement deterministic public HTML leak heuristics (thin pages, missing key paths, oversized HTML, weak CTA keywords) in `lib/audit-heuristics.ts` — UX/ops only; no security exploit checks
- [x] T007 Implement `generateAuditPack` orchestration (normalize → fetch → heuristics → Groq JSON → Zod validate → normalize confidence) in `lib/generate-audit.ts` using `lib/openrouter.ts` chatJson and `lib/fetch-public.ts`
- [x] T008 Add `POST` handler for `app/api/audits/route.ts` per OpenAPI (`maxDuration` 120; map `GROQ_API_KEY` missing to 502 AuditPack)

**Checkpoint**: `curl POST /api/audits` returns JSON with `mode: aggressive-auditor`

---

## Phase 3: User Story 1 - Run a public aggressive audit (Priority: P1) 🎯 MVP

**Goal**: Operator submits domain/name and receives an Audit Pack with ranked leaks

**Independent Test**: Submit `kone.com`; get ≥1 leak with cited signal or honest partial

- [x] T009 [US1] Wire `components/CompanyForm.tsx` (or new `components/AuditForm.tsx`) to `POST /api/audits` with loading/error states
- [x] T010 [US1] Update `app/page.tsx` hero copy to Aggressive Auditor framing (public UX/ops leaks; never security pen-test; drafts never sent)
- [x] T011 [US1] Display company snapshot, status badge, gaps/warnings from AuditPack in `app/page.tsx` or `components/AuditSummary.tsx`

**Checkpoint**: End-to-end audit generation visible in UI

---

## Phase 4: User Story 2 - Audit dashboard + conceptual fix (Priority: P1)

**Goal**: Ranked leak map with drill-down, conceptual fix, staging preview

**Independent Test**: Select top leak; see evidence + staging preview labelled concept

- [x] T012 [US2] Build `components/AuditDashboard.tsx` listing leaks ranked by `rank` with impact vs effort
- [x] T013 [US2] Add leak drill-down (rationale, signals, tryFirst, conceptualFix) in `components/AuditDashboard.tsx` or `components/LeakDetail.tsx`
- [x] T014 [US2] Implement `components/StagingPreview.tsx` rendering `stagingPreviewHtml` in a sandboxed iframe with “Concept / draft fix — not deployed on prospect systems” banner
- [x] T015 [US2] Ensure Groq prompt in `lib/generate-audit.ts` always emits conceptualFix + safe stagingPreviewHtml for top leaks and forbids security-exploit language

**Checkpoint**: Dashboard + staging preview demoable in &lt;5 minutes

---

## Phase 5: User Story 3 - Aggressive outreach drafts (Priority: P2)

**Goal**: Email + LinkedIn drafts for COO/ops citing leaks; never-send

**Independent Test**: Drafts mention a leak; draftLabel present; no send button

- [x] T016 [US3] Adapt `components/OutreachDrafts.tsx` to AuditPack drafts (`relatedLeakIds`) with copy-to-clipboard
- [x] T017 [US3] Enforce draftLabel exact string and no send/contact controls in UI components under `components/`

**Checkpoint**: Drafts section complete

---

## Phase 6: User Story 4 - Graceful partial audits (Priority: P2)

**Goal**: Clear partial/error when fetch/LLM fails; no invented vulns

**Independent Test**: Bad domain shows gaps; no fake CVE list

- [x] T018 [US4] Harden `lib/generate-audit.ts` error/partial paths to set status `error`|`partial` with explicit gaps and empty/low-confidence leaks only when justified
- [x] T019 [US4] Surface gaps/warnings prominently in `components/AuditSummary.tsx` or `app/page.tsx` for error/partial states

**Checkpoint**: Failure demo ready for judges

---

## Phase 7: Polish & Cross-Cutting

- [x] T020 [P] Update `scripts/smoke.ts` to call `generateAuditPack` (or document `curl` against `/api/audits`)
- [x] T021 [P] Refresh `README.md` demo notes for Aggressive Auditor
- [x] T022 Run `specs/002-aggressive-auditor/quickstart.md` validation on one live domain

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → US1 → US2 → US3 → US4 → Polish
- US1 is MVP; US2 is required for “Trojan Horse” demo quality
- [P] tasks within a phase may run in parallel when files differ

## Parallel Example: Foundational

```text
T005 schemas.ts
T006 audit-heuristics.ts
(after T004 types)
```

## Implementation Strategy

1. Foundation (types → heuristics → generate → API)
2. US1 form + summary (MVP API demo)
3. US2 dashboard + staging (full Trojan Horse)
4. US3 drafts + US4 partial polish
5. Quickstart rehearsal

## MVP Scope

T001–T015 (Setup + Foundational + US1 + US2) is the live-demo vertical slice.
