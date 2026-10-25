# Implementation Plan: ProofPulse

**Branch**: `003-proofpulse` | **Date**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-proofpulse/spec.md`

## Summary

Build **ProofPulse** as a proof-before-pitch opportunity workspace on the existing Next.js app: seed feed (10–20 Finnish companies) + on-demand investigation, fact-vs-hypothesis investigation view, document-consolidation One-Hour Proof (public docs with synthetic fallback), transparent score + soft CEO Attention Test, COO outreach drafts (never send), session-only state. LLM via Groq. No FastAPI/SQLite for hackathon — single Next.js process (Ship the Sharp Idea).

## Technical Context

**Language/Version**: TypeScript 5.x, Node 20+, Next.js 15 App Router, React 19

**Primary Dependencies**: `next`, `react`, `zod`, `openai` (Groq-compatible), existing `lib/fetch-public.ts`, `lib/normalize-url.ts`, `lib/openrouter.ts`

**Storage**: Session-only client state; static seed JSON under `data/`; no database

**Testing**: Manual via `quickstart.md` (no automated suite required)

**Target Platform**: Local/deployable web app (`npm run dev -- -p 3002`)

**Project Type**: Single Next.js web application

**Performance Goals**: On-demand investigate &lt;90s; proof run &lt;3 minutes; feed instant from seed

**Constraints**: Public data only; never send; soft CEO gate; Finland-first seed; Groq key in `.env`; constitution I–V

**Scale/Scope**: Hackathon demo — ~12–20 seed companies, one proof workflow, full Discover→Convert walkthrough

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. CEO-Grade Output | PASS | Evidence-backed hypotheses; soft gate blocks fake strength |
| II. Live on Any Company | PASS | On-demand name/domain + seed backup |
| III. Working Proof Over Slideware | PASS | Document consolidation demo is the differentiator |
| IV. Outreach Without Contact | PASS | Drafts only; no send; public sources |
| V. Ship the Sharp Idea | PASS | Reuse Next.js; skip dual FastAPI/SQLite stack |

**Post-design re-check**: PASS — contracts stay session-only; synthetic proof labelled; no CRM/send.

## Project Structure

### Documentation

```text
specs/003-proofpulse/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/openapi.yaml
└── tasks.md
```

### Source Code

```text
data/
├── seed-companies.json      # 10–20 Finnish seed opportunities
└── synthetic-proof/         # Sample docs for fallback proof
app/
├── page.tsx                 # ProofPulse workspace UI
└── api/
    ├── opportunities/route.ts          # GET seed feed
    ├── opportunities/investigate/route.ts  # POST on-demand
    └── proofs/run/route.ts             # POST consolidation proof
components/
├── OpportunityFeed.tsx
├── InvestigationPanel.tsx
├── ProofRunner.tsx
├── BusinessCasePanel.tsx
├── CeoGateBadge.tsx
└── OutreachReview.tsx
lib/
├── seed.ts
├── scoring.ts
├── ceo-gate.ts
├── investigate-company.ts
├── proof-consolidate.ts
├── business-case.ts
└── (reuse fetch-public, normalize-url, openrouter)
types/
└── proofpulse.ts
```

**Structure Decision**: Single Next.js app; evolve UI from Aggressive Auditor to ProofPulse opportunity workspace.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None (rejected FastAPI+SQLite from brief) | Hackathon time + existing Next stack | Dual-stack increases demo failure risk |
