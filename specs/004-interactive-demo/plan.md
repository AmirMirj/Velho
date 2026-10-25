# Implementation Plan: ProofPulse Interactive Presentation Demo

**Branch**: `004-interactive-demo` | **Date**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-interactive-demo/spec.md`

## Summary

**Revision 2 (2026-10-25)**: Replace the stacked cards + step pills with a compact vertical timeline (one expanded step, one-line summaries for done steps, details behind `<details>`), and drop the scoped dark theme so `/demo` uses the main workspace theme.

Add a fully client-side `/demo` page to the existing Next.js ProofPulse app: a guided 5-step presentation (choose prospect & signal → investigate → business case → proof plan + working report-consolidation prototype → meeting request). All data is fictional and bundled; no network, no LLM, no API keys. Pure logic lives in `lib/demo/*` so it can be smoke-tested with Node.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 15 App Router, React 19

**Primary Dependencies**: existing `next`, `react` only — no new dependencies

**Storage**: N/A (React state only; bundled TS data module)

**Testing**: `scripts/smoke-demo.ts` run via `node --experimental-strip-types` for pure logic (business case math, consolidation, drafts) + manual quickstart

**Target Platform**: Browser (desktop + projector, responsive to narrow screens)

**Project Type**: Single Next.js web application (new route)

**Performance Goals**: Instant recalculation (<100 ms) — trivial in-memory math

**Constraints**: Offline-capable (FR-013); shared app theme from `app/globals.css` — no demo-only theme (FR-015); compact timeline layout, details behind disclosures (FR-004, FR-016); never send (FR-010)

**Scale/Scope**: 4 companies × 2–3 signals, 3 demonstration types, 1 runnable prototype

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. CEO-Grade Output | PASS | Drafts cite signal, hypothesis, proof and estimate — no generic pitch |
| II. Live on Any Company | PASS (justified) | This page is a presentation aid; the live any-company path remains in the main workspace and is linked |
| III. Working Proof Over Slideware | PASS | Consolidation prototype genuinely processes displayed/pasted inputs |
| IV. Outreach Without Contact | PASS | No send action; "Internal draft — never sent" label |
| V. Ship the Sharp Idea | PASS | One page, no dependencies, reuses stack |

**Post-design re-check**: PASS — all logic local; no new services.

## Project Structure

### Documentation

```text
specs/004-interactive-demo/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/ui-contract.md
└── tasks.md
```

### Source Code

```text
app/demo/page.tsx              # Demo route (client component orchestrating steps)
app/demo/demo.css              # Layout-only timeline styles using globals.css tokens (no own palette)
components/demo/
├── PresenterGuide.tsx
├── Timeline.tsx               # Vertical timeline: TimelineStep (done/current/locked, summary, reopen)
├── ProspectStep.tsx
├── InvestigationStep.tsx
├── BusinessCaseStep.tsx
├── ProofStep.tsx
└── MeetingStep.tsx
lib/demo/
├── types.ts
├── companies.ts               # Fictional companies + signals
├── demonstrations.ts          # Demo types + proof plan builder
├── business-case.ts           # Calc + clamping + formatting
├── consolidate.ts             # Working report consolidation prototype
├── sample-reports.ts          # Bundled illustrative reports
└── meeting.ts                 # Meeting request draft builder
scripts/smoke-demo.ts          # Logic smoke test
app/page.tsx                   # + header link to /demo
```

**Structure Decision**: New route and namespaced `components/demo` + `lib/demo` to avoid touching existing workspace code.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Fictional-only data (Principle II tension) | Presentation must be reliable and narratable | Live path already exists at `/`; linked from demo |
