---
description: "Task list for Proof Before Pitch implementation"
---

# Tasks: Proof Before Pitch

**Input**: Design documents from `/specs/001-proof-before-pitch/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested in the feature specification — no automated test tasks. Validate via `quickstart.md` rehearsal.

**Organization**: Tasks grouped by user story for independent implementation and demo checkpoints.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete work)
- **[Story]**: US1–US4 map to spec user stories
- Exact file paths included in every task

## Path Conventions

Next.js App Router at repository root (`app/`, `components/`, `lib/`, `types/`) per plan.md.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Next.js project and shared config

- [x] T001 Create directories `app/`, `app/api/packs/`, `components/`, `lib/`, `types/` per plan.md structure
- [x] T002 Initialize Next.js 15 + TypeScript + React app with `package.json`, `tsconfig.json`, `next.config.ts` at repository root
- [x] T003 [P] Add dependencies `zod` and OpenAI-compatible client for OpenRouter in `package.json`
- [x] T004 [P] Create `.env.example` with `OPENROUTER_API_KEY=` and `OPENROUTER_MODEL=` and ensure `.gitignore` ignores `.env`
- [x] T005 [P] Write root `README.md` with setup, `npm run dev`, and link to `specs/001-proof-before-pitch/quickstart.md`
- [x] T006 [P] Add base `app/layout.tsx` and `app/globals.css` shell for the operator UI

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types, schemas, URL/fetch/LLM utilities, and API stub — MUST complete before user stories

**⚠️ CRITICAL**: No user story UI/generation work until this phase completes

- [x] T007 Define shared types `TargetCompany`, `PublicSignal`, `OpportunityHypothesis`, `OutreachDraft`, `ProofPack` in `types/pack.ts` matching `specs/001-proof-before-pitch/data-model.md` (valueScore/effortScore 1–5; confidence `high`|`medium`|`low`; status `complete`|`partial`|`error`; opportunities max 5)
- [x] T008 [P] Implement Zod schemas for `GeneratePackRequest` and `ProofPack` in `lib/schemas.ts` aligned with `specs/001-proof-before-pitch/contracts/openapi.yaml`
- [x] T009 [P] Implement domain/URL normalisation (strip path/query to hostname; accept name or URL) in `lib/normalize-url.ts`
- [x] T010 [P] Implement public HTML fetch + text extraction for homepage and optional `/about`, `/careers`, `/jobs` in `lib/fetch-public.ts` (public only; timeout; no auth)
- [x] T011 [P] Implement OpenRouter chat client reading `OPENROUTER_API_KEY` / `OPENROUTER_MODEL` in `lib/openrouter.ts`
- [x] T012 Create stub `POST` handler in `app/api/packs/route.ts` that validates body with Zod and returns 400 `ErrorBody` on invalid `input`
- [x] T013 Create empty client shell `app/page.tsx` that will hold session `ProofPack` state (no durable storage, no shareable pack URLs)

**Checkpoint**: Foundation ready — user story implementation can begin

---

## Phase 3: User Story 1 — Generate a company proof pack (Priority: P1) 🎯 MVP

**Goal**: Operator submits company domain/name and receives a company-specific proof pack (snapshot, cited signals, 3–5 ranked opportunities) from `POST /api/packs`

**Independent Test**: Enter three unfamiliar established domains (prefer Nordic/Finnish); each returns a non-empty pack with company name and ≥1 opportunity tied to a cited signal (or honest partial)

### Implementation for User Story 1

- [x] T014 [US1] Implement pack orchestration (normalize → fetch public text → LLM JSON → Zod validate → retry once on schema fail) in `lib/generate-pack.ts` producing 3–5 opportunities when signals allow (fewer if thin; do not invent to pad)
- [x] T015 [US1] Wire `lib/generate-pack.ts` into `app/api/packs/route.ts` returning `ProofPack` with `status`, `company`, `signals`, `opportunities`, `drafts` (may be empty array for now), `gaps`, `generatedAt`, `warnings`
- [x] T016 [P] [US1] Build `components/CompanyInput.tsx` (domain/name field + submit; disable while generating)
- [x] T017 [P] [US1] Build `components/PackStatus.tsx` showing generating / complete / partial / error and `gaps` messages
- [x] T018 [US1] Integrate input + status + session pack state in `app/page.tsx` calling `POST /api/packs` and storing the response in React state only
- [x] T019 [US1] Ensure opportunity hypotheses set `confidence` to `low` when `signalIds` empty and otherwise require ≥1 cited `PublicSignal.id` per FR-011 in `lib/generate-pack.ts`

**Checkpoint**: US1 MVP — live pack generation works without map polish or outreach UI

---

## Phase 4: User Story 2 — Interactive opportunity proof (Priority: P1)

**Goal**: Ranked opportunity map with value-vs-effort ordering and drill-down (rationale, linked signals, “what we’d try first”)

**Independent Test**: Open pack for Company A; ranked list + selecting a row shows company-specific drill-down, not name-swap template

### Implementation for User Story 2

- [x] T020 [P] [US2] Implement `components/OpportunityMap.tsx` listing opportunities sorted by `rank` with valueScore and effortScore visible
- [x] T021 [P] [US2] Implement `components/OpportunityDetail.tsx` for selected opportunity: rationale, linked signal excerpts via `signalIds`, and `tryFirst`
- [x] T022 [US2] Wire map + detail selection state into `app/page.tsx` so operator can walk 3–5 items in-session without regenerating
- [x] T023 [US2] Prompt/LLM instructions in `lib/generate-pack.ts` require plain-language value-vs-effort rationale and concrete `tryFirst` for each opportunity

**Checkpoint**: US1 + US2 — judging walkthrough of opportunity map works live

---

## Phase 5: User Story 3 — COO/ops outreach drafts (Priority: P2)

**Goal**: Email + LinkedIn-style drafts addressed to COO / Head of Operations, labelled as drafts, copyable, never sent

**Independent Test**: Pack shows ≥1 email and ≥1 linkedin draft with draft label, company-specific finding, and no send control

### Implementation for User Story 3

- [x] T024 [US3] Extend `lib/generate-pack.ts` to always produce `OutreachDraft` entries with `channel` `email` and `linkedin`, `addresseeRole` `"COO / Head of Operations"`, and `draftLabel` containing internal draft / do-not-send wording
- [x] T025 [P] [US3] Implement `components/OutreachDrafts.tsx` displaying drafts with visible draft badges and copy-to-clipboard (no Send/Contact buttons)
- [x] T026 [US3] Integrate `OutreachDrafts` into `app/page.tsx` for the current session pack alongside the opportunity map
- [x] T027 [US3] Verify `app/api/packs/route.ts` and UI expose no send/contact endpoints or actions (ground rules / FR-006)

**Checkpoint**: Full get-into-the-room loop: pack → map → copyable drafts

---

## Phase 6: User Story 4 — Graceful partial results (Priority: P2)

**Goal**: Fetch/LLM failures and thin public text yield partial/error packs with clear gaps — no invented executives or private facts

**Independent Test**: Nonsense/unreachable domain shows explicit error/partial with `gaps`; thin-site pack marks low-confidence and does not fabricate private data

### Implementation for User Story 4

- [x] T028 [US4] Harden `lib/fetch-public.ts` to collect per-URL failures into structured gap messages without throwing away successful pages
- [x] T029 [US4] Map total vs partial failures to `ProofPack.status` `error`|`partial` in `lib/generate-pack.ts` with non-empty `gaps` and `warnings` (e.g. language limitation)
- [x] T030 [US4] Update `components/PackStatus.tsx` and `app/page.tsx` so failed runs never show a blank screen; prior session pack remains visible until a new successful/partial replace
- [x] T031 [US4] Add LLM system rules in `lib/generate-pack.ts` forbidding invented executive names, emails, and non-public facts; mark thin-signal opportunities `confidence: low`

**Checkpoint**: Demo-safe under network/LLM failure

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Demo readiness and submission hygiene

- [x] T032 [P] Polish operator UX copy in `app/page.tsx` / components: internal tool framing, draft-only disclaimer, Velho ICP (established ops / manual work)
- [x] T033 [P] Tune `lib/generate-pack.ts` prompts for Nordic/Finnish public sites while keeping worldwide domains usable
- [x] T034 Ensure generation path targets &lt;90s typical latency (timeouts, text truncation budget) in `lib/fetch-public.ts` and `lib/openrouter.ts`
- [x] T035 Run full `specs/001-proof-before-pitch/quickstart.md` scenarios A–D and record rehearsal notes for SC-002/SC-003
- [x] T036 [P] Prepare deploy notes in `README.md` (env vars, public demo URL) for hackathon hub submission

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Start immediately
- **Foundational (Phase 2)**: Depends on Setup — **BLOCKS** all user stories
- **US1 (Phase 3)**: Depends on Foundational — **MVP**
- **US2 (Phase 4)**: Depends on US1 pack shape in session (needs opportunities from US1)
- **US3 (Phase 5)**: Depends on US1 pack in session; can start after US1 even if US2 incomplete
- **US4 (Phase 6)**: Hardens US1 generation/UI; best after US1, ideally after US2/US3 UI exists
- **Polish (Phase 7)**: After desired stories complete

### User Story Dependencies

- **US1 (P1)**: After Foundational — no story dependencies
- **US2 (P1)**: After US1 (needs `opportunities` + `signals` in session pack)
- **US3 (P2)**: After US1 (needs pack); independent of US2 map UI
- **US4 (P2)**: After US1; improves failure paths used by all stories

### Parallel Opportunities

- T003–T006 after T002
- T008–T011 after T007
- T016–T017 after API returns packs
- T020–T021 in parallel
- T025 parallel with T024
- T032–T033, T036 in polish

---

## Parallel Example: User Story 1

```bash
# After T015 returns packs:
Task: "Build components/CompanyInput.tsx"
Task: "Build components/PackStatus.tsx"
# Then T018 integrates both in app/page.tsx
```

## Parallel Example: User Story 2

```bash
Task: "Implement components/OpportunityMap.tsx"
Task: "Implement components/OpportunityDetail.tsx"
# Then T022 wires selection in app/page.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 Setup  
2. Phase 2 Foundational  
3. Phase 3 US1  
4. **STOP** — validate live pack on 1–2 Nordic domains  
5. Continue US2 (required for judging “proof”) before polish

### Suggested demo-ready path (solo)

1. Setup + Foundational  
2. US1 → US2 (P1 core demo)  
3. US3 (meeting ask)  
4. US4 (failure safety)  
5. Polish + quickstart rehearsal  

### Incremental Delivery

1. US1 alone = pack API + basic UI (weak demo)  
2. US1+US2 = opportunity map walkthrough (strong judging core)  
3. +US3 = copyable outreach  
4. +US4 = resilient live demo  

---

## Notes

- No automated test tasks (not requested); use `quickstart.md`
- Never commit `OPENROUTER_API_KEY`
- No send/contact features — constitution IV
- Session-only packs — no shareable URLs
- Commit after each task or logical group when using git
