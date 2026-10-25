# Quickstart: Aggressive Auditor

## Prerequisites

- Node 20+
- `GROQ_API_KEY` in `.env` (optional `GROQ_MODEL=openai/gpt-oss-120b`)
- Network access to public company sites + Groq

## Setup

```bash
cp .env.example .env   # set GROQ_API_KEY
npm install
npm run dev -- -p 3002
```

Open [http://localhost:3002](http://localhost:3002).

## Validation scenarios

### 1. Happy path (Kone or Nokia)

1. Enter `kone.com` or `Nokia`.
2. Click **Run aggressive audit** (or equivalent).
3. Expect within ~90s:
   - Status `complete` or `partial`
   - ≥1 leak with `signalIds` and `conceptualFix`
   - Staging preview for top leak labelled concept/draft
   - Email + LinkedIn drafts with never-send label
4. Confirm UI does **not** claim security penetration testing or live deploy on the prospect.

### 2. Thin / failure path

1. Enter `this-domain-definitely-does-not-exist-xyz.invalid`.
2. Expect `error` or `partial` with explicit gaps; no invented CVE list.

### 3. API smoke

```bash
curl -sS -X POST http://localhost:3002/api/audits \
  -H 'Content-Type: application/json' \
  -d '{"input":"kone.com"}' | jq '{status, mode, leaks: (.leaks|length), drafts: (.drafts|length), gaps}'
```

Expect `mode: "aggressive-auditor"` and `leaks >= 1` when fetch succeeds.

## Contract reference

See [contracts/openapi.yaml](./contracts/openapi.yaml) and [data-model.md](./data-model.md).

## Out of scope checks

- No Puppeteer required for pass
- No CRM / dead-deal flows
- No CEO voice clone
