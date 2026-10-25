# Research: Proof Before Pitch

**Date**: 2026-10-24  
**Feature**: `001-proof-before-pitch`

## 1. Application framework

**Decision**: Next.js 15 App Router + TypeScript as a single deployable web app.

**Rationale**: Constitution prefers a deployable web app; App Router co-locates UI and API routes; one `npm run dev` for live judging; easy public URL for hub submission.

**Alternatives considered**:
- Python FastAPI + separate React SPA — more moving parts for solo hackathon.
- Streamlit / Gradio — faster prototype but weaker custom opportunity-map UX and “Monday tool” feel.
- Pure client-side LLM calls — exposes API key; rejected.

## 2. LLM provider

**Decision**: OpenRouter (`OPENROUTER_API_KEY`) with an OpenAI-compatible chat completions API; default to a fast mid-tier model (e.g. `openai/gpt-4o-mini` or equivalent available on OpenRouter), overridable via env.

**Rationale**: Team already has approved OpenRouter credit; constitution names OpenRouter; one key works across models if quality needs a bump before demo.

**Alternatives considered**:
- Direct OpenAI/Anthropic keys — extra signup; credit already on OpenRouter.
- Local models — unreliable on demo laptop, slower than 90s budget.

## 3. Public signal gathering

**Decision**: Server-side HTTP fetch of the company homepage plus common public paths (`/about`, `/careers`, `/jobs` when linked or guessed), strip HTML to text, truncate to a token-safe budget, pass to the LLM with strict “cite only provided text” instructions.

**Rationale**: Meets FR-002 (public only); no login scrapers; works for Nordic sites with English/Finnish copy; failures map cleanly to partial packs.

**Alternatives considered**:
- Browser automation (Playwright) — heavier, flaky under time pressure.
- Paid firmographic APIs — out of scope per spec assumptions.
- Search-engine scraping — ToS risk and brittle for a weekend.

## 4. Session / persistence

**Decision**: Stateless API returns full `ProofPack` JSON; client holds it in React state for the session. No database, no shareable pack IDs.

**Rationale**: Clarification Q2 — session only; simplifies architecture and constitution gate V.

**Alternatives considered**:
- Redis/SQLite pack store + share URLs — rejected by clarification.
- `localStorage` persistence — optional later; not required for v1 (refresh → regenerate).

## 5. Opportunity map UX

**Decision**: Single-page results: left/main list ranked by value vs effort scores; selecting a row shows drill-down (rationale, linked signal ids, “what we’d try first”). Separate panel/tab for outreach drafts with copy buttons; no Send.

**Rationale**: Clarification Q1; fits 5–10 minute judging walkthrough.

**Alternatives considered**: Calculator / narrative-only one-pager / before-after storyboard — rejected in clarify.

## 6. Structured LLM output

**Decision**: Ask the model for JSON matching Zod/`ProofPack` schema; validate server-side; on validation failure retry once with repair prompt, then return partial/error with message.

**Rationale**: Keeps UI deterministic; supports FR-011 confidence and signal linkage.

**Alternatives considered**: Free-form markdown only — harder to build interactive map; rejected for P1 UX.

## 7. Testing strategy

**Decision**: Primary validation via `quickstart.md` rehearsal on three Nordic/Finnish domains + one failure domain; optional Vitest on Zod schemas. No full E2E suite required before Sunday.

**Rationale**: Constitution V — demo quality over test theater; SC-001–006 are rehearsal-checkable.

**Alternatives considered**: Playwright CI — valuable later, not blocking for hackathon gate.
