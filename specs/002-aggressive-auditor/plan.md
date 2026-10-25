# Implementation Plan: Aggressive Auditor

**Branch**: `002-aggressive-auditor` | **Date**: 2026-10-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-aggressive-auditor/spec.md`

## Summary

Evolve the existing Velho Next.js “Proof before pitch” app into the **Aggressive Auditor**: paste a company domain → fetch public pages → detect UX/ops conversion **leaks** (not security vulns) → show an **Audit Dashboard** with ranked leaks, conceptual coded fixes, and an in-app **staging preview** → COO/ops outreach drafts (never sent). LLM via **Groq**. Puppeteer deferred; static fetch + heuristics + Groq is the MVP.

## Technical Context

**Language/Version**: TypeScript 5.x, Node 20+, Next.js 15 (App Router), React 19

**Primary Dependencies**: `next`, `react`, `zod`, `openai` (OpenAI-compatible client pointed at Groq), existing `lib/fetch-public.ts` / `lib/normalize-url.ts`

**Storage**: N/A (session-only client state; no DB)

**Testing**: Manual rehearsal via `quickstart.md` (no automated test suite required for hackathon)

**Target Platform**: Deployable web app (`npm run dev` / Vercel); local demo on port 3002

**Project Type**: Single Next.js web application (API routes + UI)

**Performance Goals**: End-to-end audit &lt;90s typical; fetch timeout ~12s/page; Groq JSON completion

**Constraints**: Public data only; no send/contact; no security exploit tooling; no deploy onto prospect infra; secrets in `.env` only (`GROQ_API_KEY`); constitution principles I–V

**Scale/Scope**: Solo hackathon demo; 1 input screen + audit dashboard + drafts; Nordic/established companies preferred

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. CEO-Grade Output | PASS | Leaks + drafts grounded in cited public signals; company-specific |
| II. Live on Any Company | PASS | Domain/name → live fetch + generate; partial/error defined |
| III. Working Proof Over Slideware | PASS | In-app staging preview is the working proof |
| IV. Outreach Without Contact | PASS | Drafts labelled; no send; public only; no security exploits |
| V. Ship the Sharp Idea | PASS | Extend existing app; no Puppeteer/CRM/embeddings in v1 |

**Post-design re-check**: PASS — contracts stay session-only; staging preview is concept HTML; FR-003 bans vuln tooling.

## Project Structure

### Documentation (this feature)

```text
specs/002-aggressive-auditor/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── layout.tsx
├── page.tsx                 # Operator UI → Audit Dashboard
├── globals.css
└── api/
    ├── packs/route.ts       # Keep or alias; primary POST /api/audits
    └── audits/route.ts      # New: generate AuditPack
components/
├── CompanyForm.tsx
├── AuditDashboard.tsx       # Ranked leaks + drill-down
├── StagingPreview.tsx       # Concept fix iframe/panel
├── OpportunityMap.tsx       # Reuse/adapt → leaks
└── OutreachDrafts.tsx
lib/
├── fetch-public.ts          # Extend paths/heuristics
├── audit-heuristics.ts      # NEW: HTML leak detectors
├── generate-audit.ts        # NEW: orchestrate fetch → heuristics → Groq
├── openrouter.ts            # Groq client (existing)
├── normalize-url.ts
└── schemas.ts               # AuditPack Zod schemas
types/
└── audit.ts                 # AuditPack, Leak, …
```

**Structure Decision**: Single Next.js app at repo root; extend rather than fork. Prefer new `/api/audits` + audit types while reusing fetch/LLM utilities.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | — | — |
