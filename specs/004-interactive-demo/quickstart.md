# Quickstart: ProofPulse Interactive Demo

## Prerequisites
Node 20+ (24 for smoke script), `npm install` done. No API key needed.

## Run
```bash
npm run dev -- -H 127.0.0.1 -p 3002
# open http://127.0.0.1:3002/demo
```

## Logic smoke test
```bash
node --experimental-strip-types scripts/smoke-demo.ts
```
Expected: `OK` lines for business case (312 / 12480 / 1040), consolidation rows > 0, draft contains company + estimate, clamping.

## Manual validation (≈3 min)
1. Pick "Nordic Components Oy" + reporting signal → card shows 82/100, Medium, caution. (US1)
2. Click **Investigate opportunity** → evidence vs assumptions separated; steps show "Investigate". (US2)
3. Set 12 / 50 / 40 → 312, €12,480, €1,040; formula line matches. Type 500 hours → clamped to 80. (US3)
4. Choose **Automated report consolidation** → **Generate personalized proof** → **Run sample prototype** → KPI table with totals/averages and flags. Paste `Manual report hours, 20, hours/week` → user-supplied row appears. (US4)
5. **Prepare meeting request** → draft cites company, signal, estimate; edit; Copy. No send button. (US5)
6. Change company → downstream sections reset.
7. Initial view at 1280×800 shows header + full 5-step timeline without scrolling; done steps show one-line summaries and reopen on click. Theme matches `/` (same paper background, teal accent).
8. Disable network (DevTools offline) and repeat → works. Main workspace `/` unchanged.
