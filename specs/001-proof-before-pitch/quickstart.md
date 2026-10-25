# Quickstart: Proof Before Pitch

Validate the feature end-to-end against [spec.md](./spec.md) success criteria. See [data-model.md](./data-model.md) and [contracts/openapi.yaml](./contracts/openapi.yaml) for shapes.

## Prerequisites

- Node.js 20+
- `OPENROUTER_API_KEY` in `.env` (never commit)
- Network access to public company sites + OpenRouter

## Setup

```bash
cd "/home/amir/Downloads/Operations Hackathon/secondTask"
cp .env.example .env   # after scaffold exists
# put OPENROUTER_API_KEY=... in .env
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scenario A — Happy path (Nordic/Finnish preferred)

1. Enter a public domain of an established Nordic/Finnish company (e.g. a well-known industrial or services firm with `/about` or careers content).
2. Submit and wait (target &lt; 90s — SC-001).
3. Expect `status: complete` or rich `partial`:
   - Company snapshot names the firm
   - ≥2 public signals with source URLs
   - 3–5 ranked opportunities (or fewer if thin) with drill-down
4. Select an opportunity — see rationale, linked signals, “what we’d try first”.
5. Open outreach drafts — email + LinkedIn-style, COO/ops addressee, **DRAFT** label, **no Send**.
6. Copy a draft body — clipboard or selectable text works.

**Pass if**: Steps 3–6 succeed without leaving the app (SC-004 slice).

## Scenario B — Rehearsal set (SC-002)

Repeat Scenario A for **three** unfamiliar established domains (prefer Nordic/Finnish). Record results in demo notes.

**Pass if**: 3/3 produce packs where at least two opportunities each cite a distinct signal.

## Scenario C — Fetch failure (SC-006)

1. Enter a nonsense domain (e.g. `https://this-domain-should-not-resolve-velho-demo.invalid`).
2. Submit.

**Pass if**: Explicit error or partial with non-empty `gaps` / UI explanation; no invented company story; no blank silent failure.

## Scenario D — Ground rules (SC-005)

Inspect UI and network: no “send”, “email company”, or contact endpoints. Draft labels visible.

**Pass if**: 100% drafts labelled; zero send actions.

## Optional API smoke check

```bash
curl -s -X POST http://localhost:3000/api/packs \
  -H 'content-type: application/json' \
  -d '{"input":"https://example.com"}' | head -c 2000
```

Response SHOULD match `ProofPack` in the OpenAPI contract (`status`, `signals`, `opportunities`, `drafts`, `gaps`, `generatedAt`, `warnings`).

## Judging rehearsal (8 minutes)

1. Cold start app.
2. Judge names a company → operator enters it.
3. Walk opportunity map (top 2–3 items).
4. Show one outreach draft.
5. State aloud: drafts only; not sent; public data only.

**Pass if**: Completes without slides or pre-baked pack (constitution II–III).
