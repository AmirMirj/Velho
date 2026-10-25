# Feature Specification: ProofPulse

**Feature Branch**: `003-proofpulse`

**Created**: 2026-10-25

**Status**: Clarified

**Input**: User description: "Velho Hackathon — ProofPulse: an AI Opportunity Detective. Don't pitch a company; show it what it could fix. Signal-driven system discovers when a company may need automation, proves the opportunity with public data and a working mini-demonstration, builds a transparent business case, and drafts a personalized reason for a decision-maker to meet Velho. Reverse the sales sequence (evidence → investigate → demonstrate → identify buyer → offer meeting). Not another lead-gen/email scraper. Finland-first public signals. Fact vs hypothesis. CEO Attention Test quality gate. Human review only — never auto-send. Hackathon vertical slice: discovery + evidence + one excellent demo workflow + business case + outreach draft."

## Clarifications

### Session 2026-10-25 (from product brief)

- Q: Product identity vs prior slices? → A: **ProofPulse** supersedes Aggressive Auditor / generic pack framing as the intended demo narrative (proof-before-pitch engine, not CRM lead gen).
- Q: Primary “One-Hour Proof” workflow for the hackathon? → A: **Document / report consolidation** — extract structured content from sample public or synthetic documents and show inputs → processing → outputs → limitations.
- Q: Geography? → A: **Finland-first** public evidence (company registry, procurement notices, job ads, company websites); other countries only if public web evidence is available.
- Q: Contacting prospects? → A: **Never auto-send**; drafts + approve/reject/investigate only.

### Session 2026-10-25

- Q: For the hackathon vertical slice, how should ProofPulse primarily fill the opportunity feed? → A: **Curated seed catalog (10–20) plus live on-demand investigation for any company name/domain**
- Q: Should opportunity investigations and review decisions (approve / reject / investigate) persist after a browser refresh during the demo? → A: **Session only — refresh may clear selections, proofs, and review decisions**
- Q: When an opportunity fails the CEO Attention Test, what should ProofPulse do? → A: **Soft gate — show fail reasons; allow draft with “investigate / low confidence” labelling**
- Q: For the One-Hour Proof demo, where should the sample documents come from by default? → A: **Prefer company public documents; fall back to synthetic pack with clear labelling**
- Q: Who should the default outreach draft address? → A: **COO / Head of Operations**

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Opportunity feed from public signals (Priority: P1)

A Velho operator opens ProofPulse and sees a ranked **opportunity feed** backed by a **curated seed catalog of 10–20 Finnish companies** (preloaded public signals/hypotheses for demo resilience). The operator can also **investigate any company on demand** via name or domain (including a judge-picked firm). Each row shows detected public signals, a potential operational opportunity stated as a hypothesis, evidence strength, estimated potential value (when available), and a recommended next action. The operator immediately understands *why* each company appears.

**Why this priority**: Without live discovery, the product collapses into a slideware pitch.

**Independent Test**: Load the feed; for ≥3 companies, each row shows at least one public signal, a hypothesis labeled as such, and a confidence or evidence-strength indicator.

**Acceptance Scenarios**:

1. **Given** ProofPulse is open with the seed catalog loaded, **When** the operator views the opportunity feed, **Then** each seed entry shows company identity, signals, opportunity hypothesis, evidence strength, and recommended action.
2. **Given** a company with only weak or single signals, **When** it appears in the feed, **Then** confidence is visibly lower than for multi-signal cases and is not presented as confirmed buying intent.
3. **Given** judges name a company mid-demo, **When** the operator investigates that company, **Then** the system can produce a usable investigation path from public identifiers (name/domain) without requiring a pre-baked slide deck as the only path.

---

### User Story 2 - Company investigation with facts vs hypotheses (Priority: P1)

The operator opens a company and sees an investigation workspace: **What we know** (verified public facts with sources), **What we suspect** (hypotheses needing validation), **Why now** (timely signals), **What we can demonstrate**, and **Potential value** with explicit assumptions. Observed facts are never conflated with unproven internal-process claims (e.g. hiring ≠ proven manual-work problem).

**Why this priority**: Credibility and originality rest on honest evidence handling.

**Independent Test**: Open one company; confirm every material claim under “What we know” has a source link or citation; hypotheses appear under a distinct “suspect” section.

**Acceptance Scenarios**:

1. **Given** a company with multiple public sources, **When** the investigation view opens, **Then** facts and hypotheses are visually and textually separated.
2. **Given** combined signals (e.g. ops hiring + reporting language + growth language), **When** an opportunity hypothesis is shown, **Then** the system lists the contributing signals and states that the combination is an initial hypothesis, not validated buying intent.
3. **Given** missing or failed sources, **When** investigation runs, **Then** gaps are listed and the view does not invent private operational details.

---

### User Story 3 - One-Hour Proof demonstration (Priority: P1)

For a promising opportunity, the operator runs a **small working automation demonstration** (document/report consolidation): original inputs, actual processing, resulting output, remaining manual work/limitations, and optional estimated savings under stated assumptions. Inputs **prefer company-specific public documents** when available; otherwise the system uses a **labelled synthetic sample pack**. Never use a prospect’s private systems.

**Why this priority**: The personalized working proof is the product differentiator versus AI email tools.

**Independent Test**: Run the demo on sample inputs; observe non-empty structured output plus a limitations statement in under a few minutes.

**Acceptance Scenarios**:

1. **Given** a selected opportunity with a suitable demo type, **When** the operator runs the proof, **Then** they see inputs, processing result, and explicit limitations.
2. **Given** company public documents are unavailable, **When** the proof runs, **Then** a synthetic sample pack is used and clearly labelled as synthetic fallback; no login to the prospect’s systems is required.
3. **Given** the proof fails or inputs are unsuitable, **When** the run completes, **Then** the operator sees a clear failure/partial explanation rather than a fake success.

---

### User Story 4 - Transparent business case + CEO Attention Test (Priority: P2)

The system builds a short business case with editable assumptions (hours/week, automation share, labor cost) and a transparent estimate. Before treating an opportunity as “ready to pursue,” it applies a **CEO Attention Test** quality gate: relevant problem evidence, importance, working demonstration, defensible benefits, specific messaging. Failures are a **soft gate**: the UI shows which criteria failed and marks the opportunity as not ready to pursue / investigate, but the operator may still generate a draft explicitly labelled low-confidence — never presented as a strong pitch.

**Why this priority**: Restraint and transparency are the competitive advantage and match Velho’s executive bar.

**Independent Test**: Adjust an assumption and see the estimate update; force a weak-evidence case and confirm gate fails or recommends reject/investigate.

**Acceptance Scenarios**:

1. **Given** a completed proof, **When** the business case opens, **Then** assumptions and the resulting estimate are visible and editable.
2. **Given** weak evidence or a failed demonstration, **When** the quality gate runs, **Then** the opportunity is not marked “strong enough to pursue,” failed criteria are listed, and any draft remains allowed only with investigate/low-confidence labelling.
3. **Given** a strong gated opportunity, **When** recommended action is shown, **Then** it references the specific demonstration and evidence, not a generic AI pitch.

---

### User Story 5 - Meeting opportunity drafts with human review (Priority: P2)

From an approved-quality opportunity, the operator gets a concise personalized outreach draft (meeting request) addressed by default to **COO / Head of Operations**, plus controls to edit, copy, approve, reject, or mark for further investigation. The product never sends messages or publishes as Velho.

**Why this priority**: Converts proof into “get into the room” while respecting challenge rules.

**Independent Test**: Generate a draft; copy it; confirm draft labelling and absence of any send action.

**Acceptance Scenarios**:

1. **Given** a gated opportunity (or a soft-gated one), **When** the meeting opportunity view opens, **Then** a draft references the company-specific proof and is labelled for internal use only; soft-gated drafts also show investigate/low-confidence labelling.
2. **Given** draft controls, **When** the operator chooses approve / reject / investigate, **Then** the opportunity’s recommended status updates for the current browser session (refresh may clear it).
3. **Given** any draft, **When** the UI is inspected, **Then** there is no send/contact-prospect action.

---

### Edge Cases

- Public source unavailable or rate-limited during judging → use backup/sample dataset and show which evidence is live vs cached.
- Browser refresh mid-demo → session state (selections, proofs, approve/reject) may reset; seed catalog remains available.
- Company name ambiguous / wrong domain guess → prompt for domain or show partial with warning.
- Only one weak signal → low confidence; may fail CEO Attention Test.
- Non-Finnish company selected by judges → fall back to public website evidence; mark Finland-specific sources as unavailable.
- Demo inputs empty / no company public docs → labelled synthetic sample pack; non-document opportunity → explain demo N/A with honest gap.
- Estimate assumptions extreme → show sensitivity note; never present estimate as guaranteed savings.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present an opportunity feed with company identity, public signals, opportunity hypothesis, evidence strength/confidence, and recommended next action, populated primarily from a curated seed catalog of 10–20 companies for the hackathon slice.
- **FR-001a**: System MUST allow on-demand investigation of any company identified by name or domain (including firms outside the seed catalog) and MUST be able to surface that investigation in the feed or investigation workspace without requiring continuous multi-source crawling.
- **FR-002**: System MUST ingest or reference Finland-first public evidence categories where available: company registry-style identity/change signals, public procurement notices, public job advertisements, and company website/published materials (live fetch preferred; seed/backup allowed when labelled).
- **FR-003**: System MUST separate verified public facts (with sources) from hypotheses in the investigation workspace.
- **FR-004**: System MUST support detecting and displaying **combinations** of signals that strengthen a hypothesis beyond any single event, while labelling the combination as a hypothesis.
- **FR-005**: System MUST compute and display a transparent opportunity score (0–100) from explicit weighted factors, and MUST display **confidence separately** from commercial attractiveness/score.
- **FR-006**: Default scoring weights MUST start as: relevance to Velho ICP 25%, strength of evidence for a plausible operational problem 30%, evidence the problem is timely 20%, feasibility of demonstrating a solution 15%, potential business value 10% — adjustable as assumptions, not validated science.
- **FR-007**: System MUST provide at least one working **One-Hour Proof** demonstration type (document/report consolidation) showing inputs, processing, outputs, and limitations. System MUST prefer company-specific public documents when available and MUST fall back to a labelled synthetic sample pack when not.
- **FR-007a**: When synthetic fallback is used, the UI MUST state that inputs are synthetic/demo data, not the prospect’s private files.
- **FR-008**: System MUST generate a business case with user-adjustable assumptions and clearly labelled illustrative estimates (not guaranteed savings).
- **FR-009**: System MUST apply a CEO Attention Test quality gate before recommending pursue; weak cases MUST show failed criteria and MUST be marked not-ready / investigate (soft gate). System MUST NOT hard-block draft generation, but MUST label such drafts as low-confidence / investigate-only.
- **FR-010**: System MUST generate personalized meeting-request drafts for human review addressed by default to **COO / Head of Operations**, with edit/copy/approve/reject/investigate actions, and MUST NOT send outreach or harvest personal emails for cold blast.
- **FR-010a**: Opportunity investigations, demonstration results, business-case edits, and review decisions MUST be session-scoped for the hackathon slice (no requirement to survive browser refresh or multi-device sync). Seed catalog content MAY be shipped as static/demo data.
- **FR-011**: System MUST support live investigation of a judge-selected company via name or domain with graceful degradation and optional backup evidence for demo resilience.
- **FR-012**: System MUST map observed evidence patterns to possible automation opportunities and suggested demonstration types (e.g. repetitive forms → form-to-report; job ads mentioning reporting → reporting pipeline; structured public docs → extraction; similar procurement docs → classification/drafting) as **hypotheses to investigate**, not conclusions about internal processes.
- **FR-013**: All material factual claims in operator-facing outputs MUST be traceable to a cited public source or explicitly marked as assumption/hypothesis.

### Key Entities

- **Company**: Public identity (name, industry hints, domain/identifier)
- **Signal**: Discrete public event/pattern (source, date if known, summary, link)
- **Evidence Item**: Cited fact excerpt with source URL and fact-vs-hypothesis label
- **Opportunity**: Hypothesis linking signals to a plausible ops/automation problem; score; confidence; status (investigate / pursue / reject); session-scoped unless part of the static seed catalog
- **Demonstration (Proof)**: Demo type, inputs, outputs, limitations, run status
- **Business Case**: Assumptions, estimate, sensitivity notes, gate result
- **Outreach Draft**: Channel/body/subject, draft label, review decision; default addressee role COO / Head of Operations
- **Opportunity Feed Entry**: Ranked summary for the main screen

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a live rehearsal, an operator can walk Discover → Investigate → Demonstrate → Quantify → Convert for one company in ≤5 minutes.
- **SC-002**: For ≥10 seeded or discovered Finnish (or demo) companies, the feed shows a non-empty hypothesis and at least one cited public signal per company (or an explicit “insufficient public signal” gap).
- **SC-003**: Running the One-Hour Proof on the sample pack produces a visible structured output and a limitations statement in ≤3 minutes without prospect-system login.
- **SC-004**: 100% of “What we know” claims in a sampled investigation view either cite a source or are removed/moved to hypotheses.
- **SC-005**: Adjusting a business-case assumption visibly changes the displayed estimate before outreach is copied.
- **SC-006**: In a forced weak-evidence scenario, the quality gate withholds “pursue,” lists failed criteria, and any generated draft carries investigate/low-confidence labelling.
- **SC-007**: No send/contact action exists in the product; every outreach artifact shows internal-draft labelling.
- **SC-008**: When a primary public source fails, the demo still completes using labelled backup/sample evidence without a blank screen.

## Assumptions

- Primary users are Velho operators (or hackathon judges acting as them), not end-customer employees.
- Hackathon scope prioritizes one excellent end-to-end path over nationwide continuous monitoring; the feed is **seed + on-demand**, not a live continuous discovery network.
- Document/report consolidation is the flagship demonstration; other opportunity-map demo types may be described as “could demonstrate” without full implementations. Proof inputs prefer public company docs, with synthetic fallback always available for judging reliability.
- Finland-first sources may be partially mocked or cached for judging reliability when live APIs are unavailable.
- Prior Proof-before-pitch / Aggressive Auditor work may be reused or replaced in planning; this spec defines the intended product narrative.
- Scoring weights are starting assumptions for transparency, not scientifically validated predictors of meetings booked.
- Legal/compliance: public availability ≠ permission to market to every contact; product stays on drafts + human approval.
- Session-only runtime state: operators expect to re-run investigation after refresh; seed catalog is the durable demo baseline.

## Out of Scope

- Autonomously emailing or calling real companies
- Scraping behind logins or harvesting personal emails at scale
- Full European multi-country monitoring network
- Microservices / complex multi-agent orchestration as a deliverable goal
- Claiming guaranteed ROI or confirmed internal process problems from public signals alone
- Competing feature parity with commercial lead-gen platforms (Clay-style) as the success bar
