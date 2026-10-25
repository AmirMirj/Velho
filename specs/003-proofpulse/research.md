# Research: ProofPulse

## 1. Stack: Next.js-only vs FastAPI + SQLite

**Decision**: Stay on Next.js + Groq; no Python FastAPI or SQLite for the hackathon slice.

**Rationale**: Existing app already fetches public pages and calls Groq. Spec requires session-only state. Dual-stack violates Ship the Sharp Idea and increases live-demo risk.

**Alternatives considered**: FastAPI + SQLite (brief recommendation) — deferred post-hackathon; pure client-side LLM — rejected (secrets + server fetch).

## 2. Seed vs live Finland APIs (PRH / Hilma / Job Market)

**Decision**: Ship curated seed JSON with realistic Finland-style signals (jobs, procurement, website excerpts). On-demand path uses company website fetch + Groq. Optional live Finland API hooks are out of MVP unless trivially available.

**Rationale**: Clarification chose seed + on-demand. Live PRH/Hilma APIs add auth, rate limits, and judging fragility. Seed labelled as curated public-evidence snapshots.

**Alternatives considered**: Full live PRH/Hilma/jobs ingestion — deferred; website-only with no seed — rejected (weaker Discover minute).

## 3. Scoring model

**Decision**: Deterministic weighted score 0–100 using FR-006 weights; confidence separate enum `high|medium|low` from signal count/quality heuristics + LLM suggestion clamped by rules.

**Rationale**: Spec demands transparency over opaque LLM scores.

**Alternatives considered**: LLM-only score — rejected; ML model — out of scope.

## 4. One-Hour Proof implementation

**Decision**: Server-side consolidation: parse uploaded/sample text files (and optional fetched public page excerpts) into structured table-like JSON + markdown summary. Prefer any public PDF/text URLs found during investigate; else use `data/synthetic-proof/*`.

**Rationale**: Clarification C. PDF binary parsing can be lightweight (text extraction best-effort) or use pre-extracted `.txt` samples for reliability.

**Alternatives considered**: Browser-only PDF.js — possible later; full OCR — rejected.

## 5. Soft CEO Attention Test

**Decision**: Boolean checks: (≥1 cited fact, hypothesis labelled, proof runnable/ran, assumptions present, draft specificity). Failures listed; `recommendedAction` = `investigate` when soft-fail; drafts allowed with `lowConfidence: true`.

**Rationale**: Clarification B.

## 6. UI information architecture

**Decision**: Single-page workspace: left feed, right investigation tabs (Know / Suspect / Why now / Proof / Value / Meeting).

**Rationale**: Spec screens 1–4 without multi-route complexity.
