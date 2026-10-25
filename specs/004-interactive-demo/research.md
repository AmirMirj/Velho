# Research: ProofPulse Interactive Presentation Demo

## R1 — Client-only vs server routes
- **Decision**: Fully client-side page; data bundled as TS module.
- **Rationale**: FR-013 offline; zero demo-day failure points; instant recalculation.
- **Alternatives**: API routes reusing `/api/proofs/run` (rejected: needs server FS + adds latency for no gain).

## R2 — Working prototype
- **Decision**: Report consolidation parsing `metric, value, unit` lines from multiple reports into one KPI table with per-unit values, total (for count/hours) or average (ratios), and spread flag when units differ > 20% from mean.
- **Rationale**: Clarification Q2; matches existing ProofPulse flagship; deterministic and explainable.
- **Alternatives**: LLM extraction (rejected: needs key/network).

## R3 — Theme (revised)
- **Decision**: Rewrite `app/demo/demo.css` as layout-only rules under `.demo` that consume `globals.css` tokens (`--paper`, `--card`, `--accent`, `--line`, DM Sans / IBM Plex Mono); no own colours or background.
- **Rationale**: FR-015 — one consistent product look; a separate dark theme confused the story ("is this a different product?").
- **Alternatives**: Dark theme for whole app (rejected: bigger change to the working workspace, no user value).

## R6 — Compact timeline
- **Decision**: Vertical timeline with numbered nodes on a rail. State per step: `done` (✓, one-line summary, click to reopen), `current` (expanded), `locked` (title only, muted). An `openStep` state lets the presenter reopen any done step; actions advance `openStep` to the next step.
- **Rationale**: Cuts visible text ~70% while keeping the story order; mirrors the 5 presentation steps.
- **Alternatives**: Horizontal stepper with one panel (rejected: loses the "story so far" summaries); tabs (rejected: hides progress).

## R4 — Logic testing
- **Decision**: `scripts/smoke-demo.ts` executed with Node 24 native type stripping; enable `allowImportingTsExtensions` (compatible with `noEmit`) so `lib/demo` uses explicit `.ts` relative imports that work in both Next and Node.
- **Alternatives**: Add vitest (rejected: new dependency, Principle V).

## R5 — Clipboard
- **Decision**: `navigator.clipboard.writeText` with fallback: select textarea content + message "Press Ctrl+C to copy".
