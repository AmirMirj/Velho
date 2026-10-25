# Research: Guided Demo Desk

## R1 Design source
- Decision: Mergero live site as design reference (computed styles: body `slate-950`, cards `slate-900/60`, borders `slate-800`, accent `emerald-500/400`, amber `#fbbf24`, sky `#7dd3fc`, font Plus Jakarta Sans, 8–12px radii, sticky blurred header).
- Rationale: No Figma file exists for either project, so `/figma-design-to-code` had no node to read; live styles are the source of truth.
- Alternatives: Keep paper theme (lower projector contrast); create a Figma file first (time cost before 15:00 deadline).

## R2 Guided tour
- Decision: In-page coach card driven by a `TOUR` array; each step's action calls the same handlers as manual buttons.
- Rationale: Mirrors Mergero's "Next: do it"; zero deps; guarantees tour == real UI.
- Alternatives: Tour library (new dependency); video (not interactive).

## R3 Priority breakdown
- Decision: Derived deterministically from signal data in `lib/demo/priority.ts` (evidence from confidence × evidence count, fit from demonstration match, workload = remainder, with caps 40/35/25 and exact sum).
- Rationale: No hand-maintained numbers that can drift; testable invariant.

## R4 E2E testing
- Decision: Playwright MCP (pointed at cached Chromium via `--executable-path`, since system Chrome needs sudo) for interactive refinement + `scripts/e2e-demo.mjs` importing `playwright-core` from the npx cache.
- Alternatives: Add `@playwright/test` dev dependency (heavier, network install).
