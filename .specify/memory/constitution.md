<!--
Sync Impact Report
- Version change: (none) → 1.0.0
- Modified principles: N/A (initial ratification from template placeholders)
  - [PRINCIPLE_1_NAME] → I. CEO-Grade Output
  - [PRINCIPLE_2_NAME] → II. Live on Any Company
  - [PRINCIPLE_3_NAME] → III. Working Proof Over Slideware
  - [PRINCIPLE_4_NAME] → IV. Outreach Without Contact
  - [PRINCIPLE_5_NAME] → V. Ship the Sharp Idea
- Added sections: Challenge Constraints; Hackathon Workflow
- Removed sections: none
- Follow-up TODOs: none in constitution; product direction still open for /speckit-specify
-->

# Velho Meeting Tool Constitution

## Core Principles

### I. CEO-Grade Output
Every buyer-facing artifact (brief, page, message, media) MUST clear the bar:
would a busy CEO, CFO, COO, or head of operations stop, read, share, or reply?
Generic AI pitch copy is forbidden. Output MUST be specific to the target company,
grounded in observable public facts, and written for established operators—not
startup founders. Rationale: Velho judges Output quality as a primary criterion;
polished emptiness loses to rough specificity.

### II. Live on Any Company
The product MUST run live during judging on a company the judges pick. Input MUST
be a company name, domain, or equivalent public identifier. The happy path MUST
complete without hand-edited demos, hard-coded case studies as the only path, or
pre-baked slide decks. Failures MUST degrade gracefully (partial brief + clear
gaps) rather than crash or show empty marketing copy. Rationale: “Working, not
slideware” is non-negotiable in the Velho brief.

### III. Working Proof Over Slideware
Prefer a rough tool that proves a sharp idea over a smooth tool that proves
nothing. Originality (unexpected angle, input, or channel) MUST beat a polished
clone of obvious outbound spam. Features that only exist for the pitch deck and
cannot be demoed live MUST NOT ship. Rationale: Velho values innovative solutions
they would start using on Monday.

### IV. Outreach Without Contact
The tool MAY draft emails, LinkedIn notes, one-pagers, or media for Velho’s
internal use. It MUST NOT contact real companies, send messages, or publish
anything in Velho’s name without explicit Velho approval. Use public data only;
do not scrape behind logins or harvest personal emails for cold blast. Label
generated outreach as drafts. Rationale: Challenge ground rules and buyer trust.

### V. Ship the Sharp Idea
Build the smallest useful vertical slice that gets Velho closer to the right
buyers (seen, top of mind, or into the room). Scope MUST fit a solo builder and
the Sunday 15:00 submission deadline. New dependencies, channels, or polish MUST
justify themselves against demo risk. YAGNI applies: cut anything that does not
improve live demo quality or CEO-grade output. Rationale: Velho’s own model—
find, prioritise, ship the smallest useful build, adopt.

## Challenge Constraints

- **Sponsor / ICP**: Velho — strategic AI growth partner for established companies
  with real operations, processes, and budget.
- **Buyers**: CEOs, CFOs, COOs, heads of operations; care about growth and manual
  work that blocks it.
- **Directions in scope**: Get seen, stay top of mind, get into the room, or a
  surprising mix—as long as it moves Velho closer to real B2B buyers.
- **Judging** (5–10 min live conversation): Originality; real-world usefulness;
  working demo; output quality.
- **Submission**: Hub write-up with code/prototype link, short description, optional
  ≤2 min video; deadline Sunday 15:00 (strict).
- **Stack defaults**: Prefer a deployable web app; LLM calls via OpenRouter
  (`OPENROUTER_API_KEY`); never commit API keys or secrets.
- **Secrets & compliance**: `.env` only; no contacting prospects from the product;
  no false claims of Velho endorsement in public artifacts.

## Hackathon Workflow

1. **Specify** the chosen product direction and acceptance scenarios (including
   “judges pick Company X”) before large implementation.
2. **Plan** a single vertical slice: ingest public company signal → generate
   proof/output → present CEO-grade artifact.
3. **Implement** only what the live demo needs; keep a fallback path if a fetch
   fails (cached sample + live retry).
4. **Demo rehearsal**: run end-to-end on 2–3 unfamiliar company domains before
   submission.
5. **Submit**: update hub write-up (problem, what we built, how AI works, what’s
   next) and mark submitted to Velho before the deadline.
6. Compliance reviews for Spec Kit `/speckit-*` work MUST check this constitution;
   complexity requires an explicit demo or output-quality justification.

## Governance

This constitution supersedes informal habit and prior chat assumptions for this
repository. Amendments require: (1) updating `.specify/memory/constitution.md`,
(2) a Sync Impact Report HTML comment for the amendment, (3) semantic version
bump—MAJOR for removed/redefined principles, MINOR for new principles or material
expansion, PATCH for clarifications. Ratification date stays fixed; last-amended
date updates on every change. All specs, plans, and tasks MUST be reviewable
against these principles; non-compliance blocks merge into the demo path unless
explicitly waived in the task with rationale. Runtime guidance lives in Spec Kit
artifacts under `.specify/` once created.

**Version**: 1.0.0 | **Ratified**: 2026-10-24 | **Last Amended**: 2026-10-24
