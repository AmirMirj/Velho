# Feature Specification: Aggressive Auditor

**Feature Branch**: `002-aggressive-auditor`

**Created**: 2026-10-24

**Status**: Draft

**Input**: User description: "Hackathon Execution Matrix — choose Aggressive Auditor (Trojan Horse). Paste company domain; scrape public website for UX/ops conversion leaks (broken flows, thin pages, latency/size cues)—NOT security vulnerability exploits. Deliver Audit Dashboard: 3 leaks costing conversions + conceptual coded fix with in-app staging preview. COO/ops outreach drafts never sent. Groq LLM. Defer AI Executive Clone and Dead Deal Resurrector. Build on existing Proof-before-pitch Next.js app."

## Clarifications

### Session 2026-10-24 (from matrix + constitution)

- Q: Which matrix approach for this slice? → A: **Aggressive Auditor** (medium complexity, high shock, “fix a problem live”)
- Q: Security scanning / exploits? → A: **Out of scope**. Public UX/ops friction only; no vulnerability discovery, auth bypass, or exploit PoCs
- Q: What is the “staging link”? → A: **In-app conceptual fix preview** (generated HTML/mock) — not deployed onto the target company’s infrastructure
- Q: LLM provider? → A: **Groq** (`GROQ_API_KEY`, OpenAI-compatible)
- Q: Deferred approaches? → A: AI Executive Clone and Dead Deal Resurrector — not in this feature

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Run a public aggressive audit (Priority: P1)

A Velho operator pastes a company domain (or name). The tool fetches public pages, detects conversion/ops “leaks” (e.g. broken or missing key journeys, thin about/careers content, oversized pages, weak CTAs), and returns an **Audit Pack** naming the company and listing ranked leaks grounded in observed public evidence.

**Why this priority**: Core demo — “we found the leak before asking for a meeting.”

**Independent Test**: Run three public domains; each returns ≥1 leak with a cited public source URL/excerpt (or honest partial if fetch fails).

**Acceptance Scenarios**:

1. **Given** the app is open, **When** the operator submits `nokia.com` (or similar), **Then** they receive an audit pack with company snapshot and 1–5 ranked leaks tied to public signals.
2. **Given** a company name without a domain, **When** submitted, **Then** the system guesses/resolves a domain or returns a clear partial with guidance.
3. **Given** judges pick an unfamiliar company, **When** the audit runs, **Then** no pre-baked case study is required.

---

### User Story 2 - Audit dashboard + conceptual fix (Priority: P1)

From an audit pack, the operator opens an **Audit Dashboard**: ranked leaks with impact language, evidence, and a **conceptual coded fix** plus an in-app **staging preview** showing what “fixed” could look like. Messaging supports the Trojan Horse pitch: *we found leaks costing conversions; here’s a working concept; let’s talk deploying it* — without claiming Velho already shipped to production for that company.

**Why this priority**: Differentiator vs generic outreach; matches “Proof before pitch” and “fix a problem live.”

**Independent Test**: Select a leak; verify drill-down shows evidence + try-first fix + staging preview that references that company (not a blank template).

**Acceptance Scenarios**:

1. **Given** a completed audit with ≥1 leak, **When** the operator opens the dashboard, **Then** they see ranked leaks with plain-language cost/impact hypotheses.
2. **Given** a selected leak, **When** they open the fix, **Then** they see a concrete try-first suggestion and an in-app staging preview (session-only).
3. **Given** the staging preview, **When** reviewed, **Then** UI labels it as a **concept / draft fix** (not a live deploy on the prospect’s systems).

---

### User Story 3 - Aggressive outreach drafts (Priority: P2)

From the same pack, the operator copies email + LinkedIn drafts for **COO / Head of Operations** that reference specific leaks and invite a short meeting. Drafts are labelled internal-only and never sent.

**Why this priority**: Gets Velho into the room while respecting “outreach without contact.”

**Independent Test**: Generate drafts; confirm company-specific leak references and draft labels; confirm no send action.

**Acceptance Scenarios**:

1. **Given** a completed audit, **When** drafts open, **Then** email + LinkedIn drafts exist for COO/ops and cite at least one leak.
2. **Given** drafts are visible, **When** reviewed, **Then** each is labelled draft/internal and there is no send/contact action.

---

### User Story 4 - Graceful partial audits (Priority: P2)

When fetches fail or evidence is thin, the operator still gets a partial audit: what failed, what was found, low-confidence leaks — never invented security findings or executive PII.

**Why this priority**: Live demo resilience.

**Independent Test**: Unreachable domain → clear error/partial; no fabricated vulnerability claims.

**Acceptance Scenarios**:

1. **Given** a domain that cannot be fetched, **When** audit runs, **Then** gaps explain failures and no fake leak list is invented.
2. **Given** thin public text, **When** audit completes, **Then** remaining leaks are `low` confidence and UI does not invent private facts.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept company domain or name and resolve a public homepage URL.
- **FR-002**: System MUST gather only publicly accessible website text/HTML signals; MUST NOT require logins, CRM access, or personal email harvest.
- **FR-003**: System MUST NOT perform security vulnerability scanning, exploit generation, credential testing, or unauthorized access against target systems.
- **FR-004**: System MUST produce an Audit Pack: company snapshot, public signals, 1–5 ranked **leaks** (conversion/ops friction), conceptual fixes, and optional staging preview payload.
- **FR-005**: System MUST present an interactive Audit Dashboard with leak drill-down and staging preview labelled as concept/draft.
- **FR-006**: System MUST produce COO/ops email + LinkedIn drafts labelled never-send; MUST NOT send or publish as Velho.
- **FR-007**: On fetch/LLM failure, System MUST return partial/error with explicit gaps.
- **FR-008**: Leak hypotheses MUST cite at least one public signal when available; otherwise confidence MUST be `low`.
- **FR-009**: Session-only packs (no shareable pack URLs in v1).
- **FR-010**: LLM calls MUST use Groq (`GROQ_API_KEY`) via OpenAI-compatible API.

### Key Entities

- **Target Company**: name, domain, snapshot, industry/size hints from public text
- **Public Signal**: source URL, label, excerpt, why it matters
- **Leak**: title, impactScore, effortScore, rank, rationale, tryFirst, confidence, signalIds, conceptualFix, stagingPreviewHtml (optional)
- **Outreach Draft**: channel, addresseeRole, subject/body, draftLabel
- **Audit Pack**: status, company, signals, leaks, drafts, gaps, warnings, generatedAt

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a working public domain, audit returns within ~90s with ≥1 leak citing a public signal.
- **SC-002**: Demo rehearsal: 2 of 3 Nordic/established domains yield ≥2 leaks with distinct signals and a staging preview for the top leak.
- **SC-003**: Operator can walk dashboard + top leak in &lt;5 minutes.
- **SC-004**: Drafts always show never-send labelling; no send control in UI/API.
- **SC-005**: Forced fetch failure always yields explicit gaps (no silent blank screen).
- **SC-006**: Product copy never claims security penetration testing or that fixes were deployed on the prospect’s live systems.

## Assumptions

- Extends the existing Next.js “Proof before pitch” app rather than a greenfield repo.
- “Aggressive” tone is rhetorical for outreach drafts; technical analysis stays factual and non-exploitative.
- Puppeteer full browser automation is optional enhancement; static fetch + HTML heuristics + Groq analysis is the MVP path (Ship the Sharp Idea).
- AI Executive Clone and Dead Deal Resurrector remain backlog only.

## Out of Scope

- Security CVE/WAF/exploit tooling
- Deploying code to customer infrastructure
- CRM / dead-deal resurrection
- CEO voice cloning / podcast embeddings
- Sending outreach or harvesting emails
