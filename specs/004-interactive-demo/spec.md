# Feature Specification: ProofPulse Interactive Presentation Demo

**Feature Branch**: `004-interactive-demo`

**Created**: 2026-10-25

**Status**: Clarified

**Input**: User description: "Interactive ProofPulse demo: select a hypothetical Finnish company, inspect its business signals, adjust automation assumptions, generate a sample business case, and prepare a meeting request. Data is illustrative; the demo does not contact companies or access live business records. Presentation flow: (1) select company + signal, (2) investigate the hypothesis — observed evidence vs unverified assumption, (3) adjust weekly hours / automation % / labor cost, (4) generate the proof plan, (5) prepare the meeting request. Next step: replace fictional signals with real cited public data for one live-demo company and implement one genuinely working automation prototype."

## Clarifications

### Session 2026-10-25

- Q: Where should the interactive demo live relative to the existing ProofPulse workspace? → A: Separate page (`/demo`) linked from the main workspace header (Recommended)
- Q: Which demonstration type should be the genuinely working sample prototype? → A: Automated report consolidation, merging bundled sample reports into one KPI table with per-unit values, totals/averages and anomalies (Recommended)
- Q: Should the presenter be able to paste their own report text into the sample prototype? → A: Yes — optional "paste your own data" box for consolidation, labelled as user-supplied, processed locally only (Recommended)
- Q: What visual style should the demo use for projector presentation? → A: ~~Dark scoped theme~~ superseded in revision 2 — same theme as the main workspace
- Q: How should the presenter guide be shown? → A: Collapsible "How to present this demo" panel at the top, collapsed by default, with the 5 steps and the next development step (Recommended)

### Session 2026-10-25 (revision 2 — compact timeline)

- Q: How should the demo reduce on-screen text? → A: Vertical timeline of 5 steps; only the current step is expanded; completed steps collapse to a one-line summary and can be reopened; secondary detail (questions, limitations, inputs, paste box) sits behind disclosures.
- Q: Should the demo keep its own dark theme? → A: No — the demo uses the same theme as the main ProofPulse workspace (shared colours, fonts, cards, buttons).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Choose a prospect and signal (Priority: P1)

A presenter picks one of several fictional Finnish example companies (labelled with industry) and one of that company's illustrative public signals. A prospect card shows a short description, an **investigation priority** (0–100, with bar), an **evidence confidence** level (Low / Medium / High, shown separately from priority), and a caution about what the signal does and does not prove. A step indicator (Detect signals → Investigate → Prove value → Prepare meeting) shows progress.

**Why this priority**: Opening of the presentation — explains how opportunities are detected.

**Independent Test**: Switch between ≥3 companies and ≥2 signals each; the card, priority, confidence and caution update every time and carry a "Fictional company" badge.

**Acceptance Scenarios**:

1. **Given** the demo is open, **When** a company is selected, **Then** only that company's signals are listed and the first is pre-selected.
2. **Given** a company and signal, **When** the card renders, **Then** it shows name, "Fictional company" badge, description, priority with bar, confidence, and caution.
3. **Given** a weak signal, **When** selected, **Then** confidence is Low and priority is visibly lower than for a strong signal.

---

### User Story 2 - Investigate the hypothesis (Priority: P1)

"Investigate opportunity" reveals a view separating **Observed evidence** (what the illustrative signal says, each with a source type: job ad, procurement notice, registry change, website) from **Unverified assumptions** (what must be true internally) and **Questions to validate** in a first conversation, linked by a one-sentence hypothesis.

**Why this priority**: Separating evidence from assumption is the core credibility argument.

**Independent Test**: Investigate any signal; the three lists are visually distinct, every evidence item has a source type, no assumption appears as evidence.

**Acceptance Scenarios**:

1. **Given** a selected signal, **When** "Investigate opportunity" is clicked, **Then** the investigation appears and the step indicator advances to "Investigate".
2. **Given** the view, **When** displayed, **Then** evidence and assumptions are in separate, clearly titled groups with different visual treatment.
3. **Given** company or signal changes after investigating, **When** the selection changes, **Then** investigation, proof and meeting request reset (no stale content).

---

### User Story 3 - Adjust the business case (Priority: P1)

The presenter edits **hours per week**, **share automated (%)** and **loaded labor cost (€/hour)**; the demo instantly recalculates **hours released / year**, **potential annual capacity value** and **potential monthly value**, shows the formula with current numbers, and notes that capacity value is not guaranteed cash savings and excludes implementation/maintenance costs. Each signal supplies default assumptions.

**Why this priority**: Shows value as a transparent, adjustable estimate.

**Independent Test**: 12 h/week, 50%, 40 €/h → 312 h/year, €12,480/year, €1,040/month; any change updates all outputs.

**Acceptance Scenarios**:

1. **Given** the business case, **When** any assumption changes, **Then** all results and the formula line update immediately.
2. **Given** an empty or out-of-range input, **When** entered, **Then** the calculation uses the value clamped to its allowed range and never shows negative or non-numeric results.
3. **Given** a new signal, **When** selected, **Then** that signal's default assumptions load.

---

### User Story 4 - Generate the proof plan and run a sample prototype (Priority: P2)

The presenter chooses a **demonstration to propose** (report consolidation, document data extraction, request triage), defaulting to the signal's recommendation, and clicks "Generate personalized proof". A proof plan appears: data needed, what the prototype does, how it runs, success measure, limitations. "Run sample prototype" then processes bundled illustrative inputs and shows inputs, actual output, and remaining manual work.

**Why this priority**: Explains proof-before-pitch and shows a working automation, not slideware.

**Independent Test**: Generate a proof for each demonstration type; run the prototype and see non-empty output computed from the displayed inputs plus limitations.

**Acceptance Scenarios**:

1. **Given** a demonstration, **When** "Generate personalized proof" is clicked, **Then** the plan references company, signal and current business-case numbers and the step indicator advances to "Prove value".
2. **Given** a proof plan, **When** "Run sample prototype" is clicked, **Then** inputs, computed output and an "illustrative sample data, not the company's files" label are shown.
3. **Given** the demonstration changes after generating, **When** changed, **Then** proof and meeting request clear until regenerated.

---

### User Story 5 - Prepare the meeting request (Priority: P2)

"Prepare meeting request" writes a short, specific request addressed to the **COO / Head of Operations** that cites the observed signal, states the hypothesis as a hypothesis, references the proof and the value estimate with its assumptions, and asks for a short conversation. The draft is editable, copyable and labelled as an internal draft that is never sent.

**Why this priority**: Turns the business case into a relevant conversation starter rather than a generic AI pitch.

**Independent Test**: Prepare a request; it contains company name, signal, demonstration and current annual estimate; copy works; no send action exists.

**Acceptance Scenarios**:

1. **Given** a generated proof, **When** the meeting request is prepared, **Then** it includes company, signal, hypothesis wording, demonstration and current estimate, and the step indicator advances to "Prepare meeting".
2. **Given** a draft, **When** the presenter edits or copies it, **Then** the edit persists in view and copy places the text on the clipboard with confirmation.
3. **Given** any state, **When** the UI is inspected, **Then** there is no send/contact action and an "Internal draft — never sent" label is visible.

---

### Edge Cases

- Assumption field cleared or non-numeric → treated as 0 or clamped; results show €0 rather than errors.
- Extreme assumptions (e.g. 100% automated, 80 h/week) → allowed within range, with the "not guaranteed savings" note always visible.
- Presenter skips ahead (e.g. tries to prepare the meeting before a proof exists) → later actions are disabled with a hint explaining the required previous step.
- Pasted report text contains no valid metric rows → message "no metric rows found" and the sample reports are used instead.
- Clipboard unavailable → show the text selected/ready for manual copy with a message.
- Page refresh → demo returns to the first company and signal; no state is required to persist.
- Narrow screen / projector → layout stacks into a single column and remains readable.
- Presenter reopens a completed step (e.g. business case) → it expands in place; editing it does not erase later steps unless company, signal or demonstration changes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Demo MUST provide at least 4 fictional Finnish companies, each with industry label, description and at least 2 illustrative signals.
- **FR-002**: Every company and signal MUST be visibly labelled fictional/illustrative; a global notice MUST state that the demo does not contact companies or access live business records.
- **FR-003**: Each signal MUST carry a source type, observed evidence items, unverified assumptions, validation questions, hypothesis, priority (0–100), confidence (Low/Medium/High), caution note, default assumptions and recommended demonstration.
- **FR-004**: Demo MUST present the flow as a vertical timeline of 5 steps (Prospect, Investigate, Business case, Proof, Meeting) whose nodes show done / current / locked state; only the current step is expanded by default, completed steps show a one-line summary and can be reopened by clicking, and locked steps show only their title.
- **FR-005**: Investigation view MUST separate observed evidence from unverified assumptions with distinct headings and styling.
- **FR-006**: Business case MUST compute hours/year = hours/week × share × 52; annual value = hours/year × cost; monthly = annual / 12; values rounded to whole units and formatted as euros.
- **FR-007**: Inputs MUST be bounded: hours/week 0–80, share 0–100%, cost 0–300 €/h.
- **FR-008**: Demo MUST offer at least 3 demonstration types, each producing a proof plan (data needed, prototype steps, run approach, success measure, limitations).
- **FR-009**: The "Automated report consolidation" demonstration MUST execute a working sample prototype on bundled illustrative reports, producing a consolidated KPI table (value per unit, total or average, and flagged differences) computed from the displayed inputs.
- **FR-009a**: The consolidation prototype MUST accept optional presenter-pasted report text (`metric, value, unit` lines), labelled "user-supplied", processed locally and never transmitted; invalid input MUST show a clear "no metric rows found" message and fall back to the sample reports.
- **FR-010**: Meeting request MUST be generated from the current company, signal, hypothesis, demonstration and business-case values, addressed to COO / Head of Operations, editable, copyable, and never sent.
- **FR-011**: Changing company, signal or demonstration MUST reset downstream steps.
- **FR-012**: Demo MUST include a collapsible "How to present this demo" panel (collapsed by default) listing the 5 presentation steps and the recommended next development step (real cited data for one company + one working prototype).
- **FR-014**: Demo MUST be reachable on its own page and linked from the main ProofPulse workspace; the existing workspace behaviour MUST remain unchanged.
- **FR-015**: Demo MUST use the same visual theme as the main ProofPulse workspace (shared colour tokens, fonts, cards and buttons); there MUST be no separate demo-only theme.
- **FR-016**: Secondary detail (validation questions, proof limitations, prototype inputs, paste box) MUST be behind collapsed disclosures; each step’s visible copy MUST be at most ~2 short lines of explanatory text.
- **FR-013**: Demo MUST work without network access or API keys.

### Key Entities

- **Example Company**: fictional name, industry, description, list of signals.
- **Signal**: title, source type, evidence, assumptions, questions, hypothesis, priority, confidence, caution, default assumptions, recommended demonstration.
- **Business Case Assumptions**: hours/week, share automated, labor cost; derived hours/year, annual and monthly value.
- **Demonstration Type**: name, proof-plan template, optional runnable sample prototype.
- **Proof Plan**: generated plan for a company + signal + demonstration + assumptions; optional sample run result.
- **Meeting Request Draft**: addressee role, subject, body, internal-draft label.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A presenter completes all 5 steps for one company in under 3 minutes.
- **SC-002**: Every assumption change updates results with no perceptible delay (under 100 ms perceived) and no extra click.
- **SC-003**: For the reference input (12 h, 50%, 40 €/h) results are exactly 312 h, €12,480, €1,040.
- **SC-004**: 100% of evidence items show a source type, and 0 assumptions appear under the evidence heading.
- **SC-005**: 100% of generated meeting requests contain the company name, signal and current annual estimate.
- **SC-006**: Demo completes end-to-end with networking disabled.
- **SC-007**: No send/contact action exists anywhere in the demo.
- **SC-008**: On a 1280×800 screen the initial view (header + full timeline with step 1 expanded) fits without scrolling.
- **SC-009**: The demo and the main workspace share one set of theme colours (visual check: same background, card and button styles).

## Assumptions

- Audience: hackathon judges watching a presenter; presenter is a Velho operator persona.
- Demo lives on its own page linked from the existing ProofPulse workspace header; the live workspace is untouched.
- Content is in English; amounts in euros.
- No persistence; session-only state is fine.
- Real cited public data for one live company and a production-grade prototype are the documented next step, not part of this feature (beyond the one working sample prototype).

## Out of Scope

- Live data fetching, LLM calls, or contacting any company.
- Persisting drafts or review decisions.
- Replacing fictional signals with real data (next development step).
