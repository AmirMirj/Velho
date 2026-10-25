# Implementation Plan: Proof Before Pitch

**Branch**: `001-proof-before-pitch` | **Date**: 2026-10-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-proof-before-pitch/spec.md`

## Summary

Internal Velho tool: operator enters a company domain/name → server fetches public site signals → LLM builds a proof pack (snapshot, cited signals, 3–5 ranked opportunities) → UI shows a ranked opportunity map with drill-down plus COO/ops-targeted outreach drafts (never sent). Session-only state; Nordic/Finnish companies preferred for rehearsal. Stack: Next.js (App Router) + TypeScript + OpenRouter, no database.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20+

**Primary Dependencies**: Next.js 15 (App Router), React 19, Zod (request/response validation), OpenAI-compatible OpenRouter client

**Storage**: None durable — proof packs held in browser session (React state); server is stateless per request

**Testing**: Manual quickstart rehearsal + lightweight contract checks on API JSON shape (Vitest optional for Zod schemas)

**Target Platform**: Deployable web app (local `next dev` for demo; Vercel or similar for public URL)

**Project Type**: Web application (single Next.js app: UI + API routes)

**Performance Goals**: End-to-end pack generation under 90 seconds (SC-001); interactive UI under 100ms after pack is loaded

**Constraints**: Public data only; no send/contact; no shareable pack URLs; `OPENROUTER_API_KEY` via `.env` only; solo hackathon scope before Sunday 15:00

**Scale/Scope**: Single operator, one active pack per session, ~3 screens (input → map → drafts), rehearsal on 3 Nordic/Finnish domains

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | How plan complies |
|-----------|--------|-------------------|
| I. CEO-Grade Output | PASS | Pack + drafts grounded in cited public signals; COO/ops tone; no generic filler |
| II. Live on Any Company | PASS | Domain/name → live fetch + generate; partial/error states defined in contract |
| III. Working Proof Over Slideware | PASS | Ranked opportunity map is the demo surface; no slide-only path |
| IV. Outreach Without Contact | PASS | Drafts labelled; API/UI omit send; public fetch only |
| V. Ship the Sharp Idea | PASS | One Next.js app, no DB, session-only, YAGNI on share links/auth/CRM |

**Post-Phase 1 re-check**: PASS — contracts and data model stay within session-scoped pack; no contact endpoints; complexity table empty.

## Project Structure

### Documentation (this feature)

```text
specs/001-proof-before-pitch/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md             # /speckit-tasks (not this command)
```

### Source Code (repository root)

```text
app/
├── layout.tsx
├── page.tsx                 # Input + results shell
├── globals.css
└── api/
    └── packs/
        └── route.ts         # POST generate proof pack

components/
├── CompanyInput.tsx
├── PackStatus.tsx
├── OpportunityMap.tsx
├── OpportunityDetail.tsx
└── OutreachDrafts.tsx

lib/
├── normalize-url.ts
├── fetch-public.ts          # Public HTML fetch + extract text
├── openrouter.ts            # LLM client
├── generate-pack.ts         # Orchestrate fetch → LLM → ProofPack
└── schemas.ts               # Zod schemas matching contracts

types/
└── pack.ts                  # Shared ProofPack types

.env.example                 # OPENROUTER_API_KEY=
.gitignore
package.json
README.md
```

**Structure Decision**: Single Next.js App Router project at repo root. UI and `POST /api/packs` live together for fastest solo deploy and demo. No separate backend package or database.

## Complexity Tracking

> No constitution violations requiring justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
