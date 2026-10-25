# Feature Specification: Guided Demo Desk (Mergero-inspired redesign)

**Feature Branch**: `005-guided-demo-desk`

**Created**: 2026-10-25

**Status**: Clarified

**Input**: User description: "Check my previous project https://mergero.vercel.app/, investigate it all, compare it with the current one and pick the best design. Extract and adapt novel ideas and the chosen theme. Refine functionality, make it easy to use and user-friendly, and finally make an interactive demo."

## Investigation summary

| Aspect | Mergero (previous) | ProofPulse `/demo` (current) | Pick |
|--------|--------------------|------------------------------|------|
| Theme | Dark slate desk, emerald accent, amber/sky chips, sticky blurred header | Warm paper, teal accent | **Mergero** — higher projector contrast, "desk" feel |
| Orientation | Funnel KPI strip with live counts | Vertical 5-step timeline | **Both** — keep timeline, add funnel strip |
| Onboarding | Guided coach card "1 of 12", Back / "Next: do it" performs the action | Collapsed text guide | **Mergero** |
| Next action | "Today" list: one next thing, one button | Buttons inside steps | **Mergero** — one sticky primary action |
| Explainability | Score as stacked weighted bar | Single priority bar | **Mergero** — breakdown bar |
| Quick start | "Try: Visma / Efecte" one-click examples | Dropdown | **Mergero** — company cards |
| Ending | "From data to mandate" recap + Run again | Ends at draft | **Mergero** — recap card |
| Honesty | "Sending is simulated" | "Internal draft — never sent" | Keep current |

No Figma file exists for either project; the comparison used live screenshots and computed styles.

## Clarifications

### Session 2026-10-25

- Q: Should the dark theme apply only to the demo or the whole app? → A: Whole app via shared theme tokens (Recommended)
- Q: How should the guided tour behave? → A: Optional coach card started with "Play guided demo"; "Next: do it" performs the step's action in the real UI; Back/Exit always available; Escape exits (Recommended)
- Q: How is priority explained? → A: Stacked bar of Evidence strength (max 40), Workload size (max 35), Velho fit (max 25), summing exactly to the priority (Recommended)
- Q: How does the presenter choose a company? → A: One-click company cards replace the dropdown; signals become chips (Recommended)
- Q: What happens at the end? → A: Recap card "From signal to meeting" with "Run again" and "Try another company" (Recommended)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Guided demo that drives itself (Priority: P1)

Presenter presses **Play guided demo**. A coach card ("Guided demo · 1 of 7") explains the current step in one sentence; **Next: do it** performs it (choose company, investigate, build case, generate proof, run prototype, prepare meeting, recap). **Back** goes one tour step back; **Exit** closes the tour keeping state.

**Why this priority**: Biggest ease-of-use gain observed in Mergero — a first-time presenter runs the whole story with one button.

**Independent Test**: Press Play, then only "Next: do it" until Finish; recap shows all values.

**Acceptance Scenarios**:

1. **Given** the demo, **When** Play is pressed, **Then** coach card "1 of 7" appears and the flow resets to step 1.
2. **Given** tour step N, **When** "Next: do it" is pressed, **Then** step N's action runs in the UI and the card shows N+1.
3. **Given** any tour step, **When** Exit or Escape, **Then** the card closes and state is kept.
4. **Given** the last tour step, **When** Finish, **Then** the recap is visible and the tour closes.

---

### User Story 2 - One-click prospect with explained priority (Priority: P1)

Company cards (name, industry, best priority, "fictional" tag) replace the dropdown; signals are chips. The prospect panel shows a priority breakdown bar whose three labelled parts sum to the priority, plus confidence and caution.

**Why this priority**: Makes "why this company" visible at a glance; no hidden choices.

**Independent Test**: Click every card and chip; parts always sum to the priority.

**Acceptance Scenarios**:

1. **Given** the demo, **When** a card is clicked, **Then** it is highlighted, its first signal selected and later steps reset.
2. **Given** a signal, **When** rendered, **Then** three segments are shown whose values sum to the priority.

---

### User Story 3 - Funnel strip and one primary "Next" action (Priority: P1)

A funnel strip shows Signal → Evidence → Value → Proof → Meeting with live values (priority, facts/assumptions, €/yr, KPIs merged, draft status). Done stages emerald, current highlighted, later dimmed; clicking a reached stage opens that step. A sticky bottom bar always shows the single next primary action and the "→" keyboard hint.

**Why this priority**: The presenter never searches for the next button; judges always see progress and value.

**Independent Test**: Complete the flow using only the sticky button (or →); funnel values update each step.

**Acceptance Scenarios**:

1. **Given** any state, **Then** exactly one primary next action is in the sticky bar.
2. **Given** an assumption change, **Then** the funnel Value stage updates immediately.
3. **Given** focus is not in a text field, **When** → is pressed, **Then** the next action runs.

---

### User Story 4 - Recap and replay (Priority: P2)

After the draft is prepared, a recap card "From signal to meeting" summarises company, signal, annual value + formula, prototype result (rows merged, flagged) and draft status ("ready — never sent"), with **Run again** and **Try another company**.

**Why this priority**: A clean closing slide inside the product.

**Independent Test**: Finish the flow; recap values match the steps; both buttons reset correctly.

**Acceptance Scenarios**:

1. **Given** a prepared draft, **Then** recap shows company, signal, annual value and draft status.
2. **Given** recap, **When** "Try another company", **Then** the next company is selected and flow is at step 1.

---

### User Story 5 - Shared dark desk theme (Priority: P2)

Both `/` and `/demo` use the Mergero-style dark desk theme: slate background, emerald accent, amber for assumptions/warnings, sky for info chips, Plus Jakarta Sans, sticky translucent header.

**Why this priority**: Picked as the stronger design; one look across the product.

**Independent Test**: Open `/` and `/demo`; same background, cards, chips and buttons; text readable.

**Acceptance Scenarios**:

1. **Given** either page, **Then** it uses the shared dark tokens and no light-paper background remains.

---

### Edge Cases

- Tour started mid-flow → flow resets to step 1 first so the story is coherent.
- User changes company/signal while the tour is open → tour closes (state is user-driven now).
- → key while typing in an input/textarea → ignored.
- Prototype not runnable for chosen demonstration → tour step "run prototype" switches to the runnable demonstration automatically before generating.
- Narrow screen → company cards wrap, funnel strip scrolls horizontally, coach card becomes full-width at bottom.
- Reduced-motion preference → no animated transitions.
- Existing edge cases from feature 004 (clamping, empty paste, clipboard failure, refresh resets) still apply.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Demo MUST offer a "Play guided demo" control that opens a coach card with 7 tour steps, each with title, one-sentence explanation, Back, Exit and "Next: do it" (last: "Finish").
- **FR-002**: "Next: do it" MUST perform the tour step's action through the same state transitions as manual use.
- **FR-003**: Escape MUST close the tour; manual company/signal change MUST close it.
- **FR-004**: Company selection MUST be one-click cards showing name, industry, best priority and a "fictional" tag; signals MUST be selectable chips.
- **FR-005**: Each signal MUST carry a priority breakdown (evidence ≤40, workload ≤35, fit ≤25) whose sum equals its priority; it MUST be rendered as a labelled stacked bar.
- **FR-006**: A funnel strip MUST show 5 stages with live values and done/current/locked state; reached stages MUST be clickable.
- **FR-007**: A sticky action bar MUST always show exactly one primary next action; → (outside text fields) MUST trigger it.
- **FR-008**: After the draft, a recap card MUST show company, signal, annual value with formula, prototype result and draft status, with "Run again" and "Try another company".
- **FR-009**: The whole app MUST use one shared dark desk theme (tokens in the global stylesheet); demo CSS MUST contain layout only.
- **FR-010**: All feature-004 behaviour MUST remain: fictional-data notice, evidence vs assumption, bounded business case (SC-003 reference), working consolidation prototype with optional paste, COO draft that is never sent, offline operation.
- **FR-011**: Interactive elements MUST be keyboard-reachable with visible focus and accessible names; motion MUST respect reduced-motion.

### Key Entities

- **Priority Breakdown**: evidence, workload, fit (numbers) — per Signal.
- **Tour Step**: id, title, text, action label, action.
- **Funnel Stage**: label, value text, state (done/current/locked).
- **Recap**: derived view of company, signal, business case, consolidation result, draft.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time presenter completes the full story via the guided tour in under 90 seconds using only "Next: do it".
- **SC-002**: Manual flow from step 1 to recap needs at most 7 primary clicks (one per stage) — no hunting for buttons.
- **SC-003**: For 12 h / 50% / 40 €/h results remain exactly 312 h, €12,480, €1,040.
- **SC-004**: For 100% of signals the breakdown parts sum to the priority.
- **SC-005**: Exactly one primary action visible in the sticky bar in every state.
- **SC-006**: Both pages share one theme (visual check) and body text contrast ≥ 4.5:1.
- **SC-007**: No send/contact action anywhere; demo works with network disabled.

## Assumptions

- Figma is not used (no design file exists); the "design-to-code" comparison is performed from live sites.
- Plus Jakarta Sans loaded from Google Fonts with system-font fallback, so offline still renders.
- Content stays English, amounts in euros, fictional data only.
- No persistence; session state only.

## Out of Scope

- Live data, LLM calls, sending anything.
- Mergero's M&A buyer-matching domain logic (only its UX patterns are adopted).
- Rewriting the live workspace flow beyond the theme.
