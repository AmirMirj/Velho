# Implementation Plan: Guided Demo Desk

**Branch**: `005-guided-demo-desk` | **Date**: 2026-10-25 | **Spec**: [spec.md](./spec.md)

## Summary

Adopt Mergero's stronger design (dark slate desk theme, emerald accent) and UX patterns (guided "Next: do it" tour, funnel strip, single next action, score breakdown, one-click examples, recap) in the ProofPulse `/demo`, keeping all feature-004 logic. Theme moves into shared tokens in `app/globals.css` so `/` matches.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 15 App Router, React 19
**Primary Dependencies**: none new
**Storage**: N/A (React state)
**Testing**: `scripts/smoke-demo.ts` (pure logic incl. priority breakdown + tour script) + `scripts/e2e-demo.mjs` Playwright run with the locally cached Chromium (no new package dependency; resolved from the npx cache) + Playwright MCP manual pass
**Target Platform**: Desktop browser / projector, responsive
**Project Type**: Single Next.js web app
**Performance Goals**: instant recalculation
**Constraints**: offline-capable (system-font fallback), never send, layout-only demo CSS
**Scale/Scope**: 4 companies, 7 tour steps, 5 funnel stages

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. CEO-Grade Output | PASS | Drafts unchanged; recap is specific |
| II. Live on Any Company | PASS (justified) | Presentation aid; live path stays in `/` |
| III. Working Proof | PASS | Tour actually runs the consolidation prototype |
| IV. Outreach Without Contact | PASS | No send; "never sent" in recap |
| V. Ship the Sharp Idea | PASS | No deps; reuses components |

Post-design re-check: PASS.

## Project Structure

```text
app/globals.css              # shared dark desk tokens (rewritten palette)
app/demo/page.tsx            # state machine + tour + keyboard
app/demo/demo.css            # layout only (cards, funnel, coach, sticky bar, recap)
components/demo/
  CompanyPicker.tsx          # NEW cards + signal chips (replaces dropdowns in ProspectStep)
  PriorityBreakdown.tsx      # NEW stacked bar
  FunnelStrip.tsx            # NEW
  ActionBar.tsx              # NEW sticky next action
  CoachCard.tsx              # NEW guided tour card
  Recap.tsx                  # NEW
  ProspectStep.tsx / ProofStep.tsx  # adapted (lifted consolidation result, no inner next buttons)
lib/demo/priority.ts         # NEW breakdown()
lib/demo/tour.ts             # NEW tour step definitions
scripts/e2e-demo.mjs         # NEW Playwright smoke
```

**Structure Decision**: Extend existing `/demo`; inner "next" buttons move to the sticky ActionBar so there is exactly one primary action (SC-005).

## Complexity Tracking

None.
