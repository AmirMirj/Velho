# Feature Specification: Proof Before Pitch

**Feature Branch**: `001-proof-before-pitch`

**Created**: 2026-10-24

**Status**: Clarified

**Input**: User description: "Velho challenge — build an internal B2B tool that gets meetings. Product direction: Proof before pitch. Velho operator pastes a company name or domain; the tool gathers public company signals, surfaces automation / ops-bottleneck opportunities specific to that company, presents an interactive proof the buyer can react to, and drafts CEO-grade outreach (never sent). Must work live when judges pick any company. Constitution: CEO-grade output, live on any company, working proof over slideware, outreach without contact, ship the sharp idea. Deadline Sunday 15:00. Solo builder."

## Clarifications

### Session 2026-10-24

- Q: What should the live interactive proof look like for the operator and judges? → A: Ranked opportunity map with drill-down (value vs effort list; select one for rationale + “what we’d try first”)
- Q: After a proof pack is generated, should judges (or Velho) be able to open it again later via a shareable link, or only within the same browser session? → A: Session only; refresh may require regenerating (no shareable pack URLs)
- Q: Who should outreach drafts primarily address by default? → A: COO / head of operations as default addressee (no multi-persona picker in v1)
- Q: How many opportunity hypotheses should the ranked map show per company by default? → A: 3–5 ranked items (fewer allowed when public signals are thin)
- Q: Which companies should the tool be optimised to research well for the live demo? → A: Nordic / Finnish established companies preferred; others still work if the site is public

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate a company proof pack (Priority: P1)

A Velho operator (or hackathon judge acting as one) enters a company name or website domain. Within a short wait, they receive a company-specific proof pack: who the company appears to be, where manual work or growth friction shows up in public signals, a short list of prioritised opportunity hypotheses, and an interactive proof view they can walk through live—not a generic AI sales letter.

**Why this priority**: This is the judging demo. Without a live pack for an arbitrary company, the entry fails “working, not slideware.”

**Independent Test**: Enter three unfamiliar established-company domains; each run produces a non-empty, company-specific pack with at least one opportunity tied to a cited public signal.

**Acceptance Scenarios**:

1. **Given** the tool is open and ready, **When** the operator submits a valid company domain, **Then** the system returns a proof pack that names the company correctly and lists opportunities grounded in public signals for that company.
2. **Given** a company name without a domain, **When** the operator submits it, **Then** the system resolves or prompts for a usable public identifier and still produces a usable pack or a clear partial result.
3. **Given** judges pick a company mid-demo, **When** the operator runs that company, **Then** no pre-baked slide deck is required—the live result is the demo.

---

### User Story 2 - Interactive opportunity proof (Priority: P1)

From a generated pack, the operator opens a **ranked opportunity map**: a list of company-specific automation / ops-friction hypotheses ordered by likely business value vs effort. Selecting an opportunity reveals drill-down detail—plain-language rationale tied to public signals and a concrete “what we’d try first” suggestion—so a buyer could recognise their own situation. The operator can talk through the map in under five minutes.

**Why this priority**: Differentiates from outbound spam; matches Velho’s “proof before pitch” prompt and the CEO-attention bar.

**Independent Test**: Open a pack’s opportunity map for Company A; verify ranked items and drill-down claims reference Company A’s public context, not a template with only the name swapped.

**Acceptance Scenarios**:

1. **Given** a completed proof pack with adequate public signals, **When** the operator opens the interactive proof, **Then** they see a ranked opportunity map of 3–5 company-specific items with value-vs-effort prioritisation and plain-language rationale (fewer than 3 only when signals are thin).
2. **Given** the opportunity map is open, **When** the operator selects one opportunity, **Then** they see drill-down detail (why it matters, linked signals, “what we’d try first”) enough to explain live.

---

### User Story 3 - CEO-grade outreach drafts (Priority: P2)

From the same pack, the operator copies draft outreach (short email and/or LinkedIn-style note) aimed primarily at a **COO / head of operations**, referencing specific findings and inviting a meeting. Drafts are clearly labelled as drafts and are never sent by the tool.

**Why this priority**: Directly supports “get into the room” while respecting challenge ground rules.

**Independent Test**: Generate drafts for a pack; confirm they mention at least one company-specific finding and include an explicit draft label; confirm no send action exists.

**Acceptance Scenarios**:

1. **Given** a completed proof pack, **When** the operator opens outreach drafts, **Then** they see at least one email draft and one short LinkedIn-style draft tailored to that company and addressed for a COO / head of operations.
2. **Given** outreach drafts are visible, **When** the operator reviews them, **Then** each draft is labelled as a draft for internal use and there is no “send” or “contact company” action.

---

### User Story 4 - Graceful partial results (Priority: P2)

When public signals are thin or fetching fails, the operator still gets a partial pack: what was found, what was missing, and honest opportunity language—never empty marketing filler pretending certainty.

**Why this priority**: Live demos fail unpredictably; constitution requires graceful degradation.

**Independent Test**: Run a nonsense or unreachable domain; observe a clear failure/partial state with next steps, not a fabricated company story.

**Acceptance Scenarios**:

1. **Given** a domain that cannot be fetched, **When** generation runs, **Then** the operator sees a clear error or partial pack stating what failed and what they can retry or enter manually.
2. **Given** a company with very little public text, **When** generation completes, **Then** opportunities are marked as low-confidence hypotheses and the UI does not invent executive names or private facts.

---

### Edge Cases

- Company name matches many organisations — system asks for domain or disambiguation rather than guessing silently.
- Non-English public site — system still produces a usable English pack for Velho operators when possible, or states language limitation.
- Rate limits / slow network during judging — operator can retry; prior successful pack remains viewable if one exists in the session (no shareable link fallback).
- Browser refresh or new tab — session pack may be lost; operator regenerates by resubmitting the same company.
- Operator pastes a URL with path/query — system normalises to the company site identity for research.
- Output that would require private data (email harvest, behind-login systems) — system refuses and stays on public signals only.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept a company domain and/or company name as the primary input to start a proof-pack run.
- **FR-002**: System MUST gather only publicly accessible company signals (e.g. website copy, public careers/about pages when available) and MUST NOT require logging into third-party accounts or harvesting personal emails.
- **FR-003**: System MUST produce a company-specific proof pack including: company snapshot, cited public signals, and a prioritised list of 3–5 automation / ops-friction opportunity hypotheses (fewer allowed when signals are thin) relevant to Velho’s ICP (established operators, growth blocked by manual work).
- **FR-004**: System MUST present the interactive proof as a ranked opportunity map (value vs effort) with per-item drill-down (rationale, linked signals, “what we’d try first”) that a Velho operator can demonstrate live in a 5–10 minute judging conversation.
- **FR-005**: System MUST generate executive-grade outreach drafts (at least email + short social/LinkedIn-style note) defaulting to a COO / head of operations as the addressee, that reference pack findings and invite a meeting.
- **FR-006**: System MUST label all outreach as drafts for internal use and MUST NOT send messages or contact companies.
- **FR-007**: System MUST NOT publish or brand outputs as official Velho communications without a clear internal/draft framing consistent with challenge ground rules.
- **FR-008**: When signal gathering fails or is incomplete, System MUST return a partial or error state that explains gaps instead of inventing private or unverifiable facts.
- **FR-009**: System MUST keep a generated pack available in the current browser session so the operator can switch between opportunity map and outreach drafts without re-entering the company; System MUST NOT require shareable pack URLs or durable multi-device reopen for v1. After session loss, the operator regenerates by resubmitting the company.
- **FR-010**: System MUST allow the operator to copy outreach draft text for manual use outside the tool.
- **FR-011**: Opportunity hypotheses MUST be grounded in at least one cited public signal when such a signal exists; otherwise they MUST be marked as low-confidence.
- **FR-012**: System MUST be usable by a single unauthenticated operator for the hackathon demo (no multi-tenant accounts required for v1).

### Key Entities

- **Target Company**: Name, domain/URL, short public snapshot, optional industry/size clues from public text.
- **Public Signal**: A discrete public observation (source label, excerpt or summary, why it matters).
- **Opportunity Hypothesis**: Suspected manual-work or growth bottleneck; priority rationale; confidence; linked signals.
- **Proof Pack**: Bundle of company + signals + opportunities + interactive proof presentation for one run.
- **Outreach Draft**: Channel (email / LinkedIn-style), default addressee role (COO / head of operations), subject/body, draft label, linked pack findings.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An operator can produce a complete proof pack for a new company in under 90 seconds of wait time on a typical connection (excluding extreme network failure).
- **SC-002**: In a live rehearsal, 3 of 3 unfamiliar established-company domains (prefer Nordic/Finnish) yield a pack with 3–5 ranked opportunities (or fewer only if signals are thin) where at least two opportunities each cite a distinct public signal.
- **SC-003**: A Velho-style reviewer (or teammate) reading COO/ops-targeted outreach drafts for one pack rates them as “would a busy head of operations possibly reply?” pass on at least 2 of 3 sample companies (subjective but recorded in demo notes).
- **SC-004**: During a timed 8-minute mock judging session, the operator can enter a judge-picked company, open the interactive proof, and show outreach drafts without leaving the tool.
- **SC-005**: 100% of outreach surfaces in the product are labelled as drafts; zero send/contact actions exist in the UI.
- **SC-006**: On forced fetch failure, the operator always receives an explicit partial/error explanation within the same run (no silent blank screen).

## Assumptions

- Primary user is a Velho operator (or judge role-playing as one), not the prospect company.
- Default outreach addressee is COO / head of operations; no in-product persona switcher in v1.
- Opportunity map targets 3–5 items per run; thin-signal packs may show fewer without padding inventively.
- Product direction for this feature is **Proof before pitch** (not signal radar, buyer simulator, or one-of-one media as the primary product)—those remain out of scope for v1.
- Target companies for demo are established firms with some public web presence; **Nordic / Finnish companies are the preferred rehearsal set**, while any public website must still produce a usable pack or honest partial. Early-stage startups with empty sites are secondary.
- English output is sufficient for Velho operators and Finnish/EU judging context.
- Public website content is enough for a credible v1; paid data vendors, CRM import, and email-finding enrichment are out of scope.
- No login/auth for v1; packs are browser-session only (no shareable URLs, no durable reopen across devices).
- “Interactive proof” means a ranked opportunity map with drill-down, not a calculator, narrative-only one-pager, before/after storyboard, or a deployed integration inside the prospect’s systems.
- Copy-to-clipboard or selectable text satisfies “operator can use the draft”; no email client integration.
- Challenge ground rules apply: no contacting real companies from the product; no claiming official Velho publication without approval.
- Solo-builder scope: one vertical slice good enough that Velho would want to try it on Monday.
