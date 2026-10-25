# Feature Specification: Understandable Workspace Workflow

**Feature Branch**: `006-understandable-workspace`

**Created**: 2026-10-25

**Status**: Draft

**Input**: User description: "Go through http://127.0.0.1:3002/ and evaluate the workflow from being understandable for humans."

## Evaluation summary (walkthrough of the workspace, 2026-10-25)

A first-time user walked through the workspace (`/`) on desktop (1280×800) and phone (390×844). The steps were: read the landing area, open the top opportunity, run the proof, approve a draft, investigate an unknown name, and repeat on a phone.

Method: a cognitive walkthrough asked four questions at each step. Will the user know what to do? Will they see the control? Will they understand its label? Will they know it worked? Findings were also checked against Nielsen's usability heuristics.

| # | Step | Finding | Heuristic | Severity |
|---|------|---------|-----------|----------|
| F1 | Landing | Six concepts appear at once ("seed", "on-demand", "proof", "CEO gate", "COO", "never send"), with no numbered path and nothing saying what to do first. | Recognition over recall | High |
| F2 | Landing | Terms appear without explanation: "Seed catalog", "Soft CEO gate", "One-Hour Proof", "pursue / investigate", "relevance · evidence · timely · demo · value". | Match with real world | High |
| F3 | Feed | Rows read "high · pursue · 2 signals". *High* isn't labelled as confidence, and *pursue* reads like a button. | Match with real world | Medium |
| F4 | Select row | The detail opens below the fold (desktop about 440px down; phone about 1,500px down). There is no scroll and no focus move, so it looks like nothing happened. | Visibility of status | High |
| F5 | Detail | Facts, hypotheses, score, proof, business case, gate, three buttons and two drafts all appear at once, with no order and no "you are here". | Minimalist design | High |
| F6 | Score | The breakdown is five unlabelled numbers with no link to the total. | Recognition over recall | Medium |
| F7 | Gate | "Soft fail — Working demonstration not completed" has no fix action nearby. | Error recovery | High |
| F8 | Gate state | After the proof passes, the gate says Pass but the drafts still say "low confidence / investigate". | Consistency | High |
| F9 | Review | "Approve / Investigate / Reject" is unclear: *Investigate* repeats the search button, and the only feedback is the small word "approved". | Consistency; Status | Medium |
| F10 | Proof | The output is raw JSON, which a COO can't scan. | Match with real world | Medium |
| F11 | Investigate | An unknown name shows "Failed homepage: fetch failed" (technical, with no next step) after about 7s. | Error messages | High |
| F12 | Investigate | There is no progress text during the roughly 7s wait. | Visibility of status | Medium |
| F13 | Business case | "Automation share (0–1)" expects a ratio, while users think in percentages. | Match with real world | Low |
| F14 | Safety | "Never send" appears five or more times in different wordings, which adds noise. | Minimalist design | Low |

**What already works**: the feed is ranked; facts and hypotheses are clearly separated; drafts are labelled as internal-only; and the theme and alignment match `/demo`.

**Overall**: an expert can use the workspace. A first-time human needs about 2–3 minutes plus outside explanation to work out the order: pick → check → prove → decide → copy. The `/demo` page already shows the patterns that fix this, and the workspace has not adopted them yet.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Clear path from opportunity to draft (Priority: P1)

A first-time user sees a numbered path: **1 Pick → 2 Check evidence → 3 Run proof → 4 Decide → 5 Copy draft**. The current step is highlighted and there is one obvious next action.

**Why this priority**: This fixes F1, F5 and F7, the main sources of confusion.

**Independent Test**: A new user with no explanation reaches a copied draft for one company without asking what to do next.

**Acceptance Scenarios**:

1. **Given** nothing is selected, **When** the page loads, **Then** the 5-step path shows step 1 as current, with the instruction "Pick a company from the list".
2. **Given** a company is selected, **When** the detail opens, **Then** finished steps are marked done and exactly one primary next action is shown.
3. **Given** the proof has not been run, **When** the gate shows "not yet", **Then** a "Run the proof" action sits right next to it.

---

### User Story 2 - Selecting a company visibly does something (Priority: P1)

Picking a company brings its detail into view and keeps the row highlighted. On narrow screens a "Back to list" control appears.

**Why this priority**: This fixes F4. On a phone, users currently think the click failed.

**Independent Test**: At desktop and phone widths, the detail heading is on screen within 1 second of clicking a row.

**Acceptance Scenarios**:

1. **Given** a phone-width screen, **When** a row is tapped, **Then** the detail heading is visible and "Back to list" returns to that row.
2. **Given** a desktop screen, **When** a row is clicked, **Then** the detail heading is visible without manual scrolling and keyboard focus moves to it.

---

### User Story 3 - Plain-language labels and explained scores (Priority: P1)

Every value is labelled in plain words, every specialist term has a one-sentence explanation, the score shows named parts, and proof results appear as a table.

**Why this priority**: This fixes F2, F3, F6, F10 and F13.

**Independent Test**: A non-expert correctly explains the row label, the score and the gate using only text on the page.

**Acceptance Scenarios**:

1. **Given** a feed row, **When** it is read, **Then** each value is labelled (e.g. "Confidence high · Recommend: pursue · 2 signals").
2. **Given** the score breakdown, **When** it is shown, **Then** each part has a name, a value and its maximum, and the relation to the total is shown.
3. **Given** the proof output, **When** it appears, **Then** it is a table (Metric, Values, Sources), with the raw view optional.
4. **Given** the business-case inputs, **When** they are edited, **Then** automation share is entered as a percentage from 0 to 100.

---

### User Story 4 - Consistent status and meaningful decisions (Priority: P2)

The gate, the confidence label and the draft label always agree. The decisions have distinct names ("Ready to send", "Needs more evidence", "Not a fit"), and the chosen one shows as a status badge.

**Why this priority**: This fixes F8 and F9. Contradictions undermine trust in the draft.

**Independent Test**: Run the proof and try each decision. No label ever contradicts another.

**Acceptance Scenarios**:

1. **Given** the proof has passed, **When** the drafts show, **Then** no "soft gate failed" text remains.
2. **Given** a decision is chosen, **When** it is applied, **Then** a badge with the decision name appears at the top of the meeting section and the chosen button shows as selected.

---

### User Story 5 - Helpful waiting and error messages (Priority: P2)

During a live investigation the user sees progress text. If it fails, a plain message offers next steps: "Check the spelling, try the website (e.g. kone.com), or pick a company from the list."

**Why this priority**: This fixes F11 and F12.

**Independent Test**: Investigate a nonsense name. The user sees progress, then a plain message with at least one next step.

**Acceptance Scenarios**:

1. **Given** an investigation is running, **When** more than 1 second has passed, **Then** progress text is visible and the button shows a busy state.
2. **Given** the lookup fails, **When** the message appears, **Then** it contains no technical terms ("fetch", "homepage") and offers at least one next step.

### Edge Cases

- If the user switches company mid-flow, the path restarts at step 2 for the new company, and the previous company's decision is kept.
- An empty search shows an inline hint instead of silently doing nothing.
- The whole flow can be completed with the keyboard only (Tab and Enter).
- With reduced motion enabled, scrolling into view is instant.
- Long names and hypotheses wrap without breaking the layout.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The workspace MUST show a 5-step path (Pick, Evidence, Proof, Decide, Copy), with each step marked done, current or upcoming.
- **FR-002**: The workspace MUST show exactly one primary next action for the current step.
- **FR-003**: Selecting a company MUST bring its detail heading into view and move keyboard focus to it. Narrow screens MUST show "Back to list".
- **FR-004**: Feed rows MUST label every value (confidence, recommendation, signal count).
- **FR-005**: Every specialist term (gate, proof, score parts, recommendation) MUST have a plain explanation of at most one sentence, available on the page.
- **FR-006**: The score breakdown MUST show named parts with values and maxima, and their relation to the total.
- **FR-007**: A failed gate MUST show its fix action right next to it.
- **FR-008**: The gate, confidence and draft labels MUST come from the same current state and never contradict.
- **FR-009**: The decision options MUST have distinct names that don't clash with other buttons. The chosen decision MUST show as a status badge.
- **FR-010**: Proof results MUST appear as a readable table by default.
- **FR-011**: Live investigation MUST show progress text while running and a plain-language error with at least one next step on failure.
- **FR-012**: Automation share MUST be entered as a percentage (0–100).
- **FR-013**: The "never send" safety message MUST appear once, prominently near the drafts.

### Key Entities

- **Workflow step**: one of Pick, Evidence, Proof, Decide or Copy, with a state of done, current or upcoming, and one next action.
- **Opportunity status**: confidence, recommendation, gate result and decision, all derived from one current state.
- **Term explanation**: a term plus one plain sentence, shown on demand.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a 5-person hallway test, at least 4 of 5 first-time users reach a copied draft unaided within 3 minutes (currently about 2–3 minutes and they need help).
- **SC-002**: After clicking a company, the detail heading is visible on screen within 1 second at both desktop and phone widths, in 100% of tries.
- **SC-003**: At least 4 of 5 testers correctly explain the row label, the score and the gate in their own words.
- **SC-004**: There are 0 contradictory status labels across all combinations of proof state and decision.
- **SC-005**: 0 user-facing messages contain technical error wording; every failure offers at least one next step.
- **SC-006**: Each workflow state shows exactly 1 primary action.
- **SC-007**: The average System Usability Scale score from testers is 75 or higher (above the "good" benchmark of 68).

## Assumptions

- Scope is the workspace page (`/`) only. The `/demo` page (feature 005) already meets these goals and is the reference pattern.
- Fixes reuse existing patterns from `/demo` (step strip, single action bar, labelled breakdown), so the two pages stay consistent.
- The data, scoring and gate logic stay unchanged. Only how they are presented and labelled changes.
- Drafts continue to be copy-only and never sent (constitution principle IV).
- Hallway tests use 5 participants, the common small-sample usability practice.
