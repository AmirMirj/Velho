# UI Contract: `/demo`

No HTTP APIs. The page exposes this UI contract (used by quickstart and smoke checks).

| Section | Element | Behaviour |
|---|---|---|
| Header | "Interactive prototype" badge, link back to `/` | always |
| Notice | "Illustrative data — no companies contacted, no live records accessed" | always |
| Guide | `<details>` "How to present this demo" | collapsed by default; 5 steps + next dev step |
| Timeline | 5 nodes: Prospect, Investigate, Business case, Proof, Meeting | done (✓ + one-line summary, clickable) / current (expanded) / locked (muted title) |
| 1. Choose a prospect | company `<select>`, signal `<select>`, prospect card, "Investigate opportunity →" | |
| 2. Investigate | Observed evidence / Unverified assumptions / Questions to validate | shown after investigate |
| 3. Build the business case | 3 number inputs, 3 result tiles, formula line, note, demonstration `<select>`, "Generate personalized proof →" | shown after investigate |
| 4. Proof plan | plan lists, "Run sample prototype" (consolidation only), optional paste box, results table | shown after generate |
| 5. Meeting request | editable textarea, Copy button, "Internal draft — never sent" | shown after prepare |

Forbidden: any button/link labelled Send, Email, Contact, or any network request.

## Pure function contracts (`lib/demo`)
- `computeBusinessCase(a: Assumptions) → {hoursPerYear, annual, monthly, clamped: Assumptions}`
- `clampAssumptions(partial) → Assumptions`
- `buildProofPlan(company, signal, demo, case) → ProofPlan`
- `consolidateReports(inputs) → ConsolidationResult`
- `parseReport(text) → {metric, value, unit}[]`
- `buildMeetingDraft(company, signal, demo, case) → MeetingDraft`

## Revision 2 rules
- Only one step expanded at a time; clicking a done step's header expands it.
- Secondary detail in `<details>`: validation questions, proof data/limitations, prototype inputs, paste box.
- Theme: inherits `globals.css` tokens/background; `demo.css` is layout-only; no dark theme.
