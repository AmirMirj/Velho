# Quickstart: ProofPulse

## Prerequisites

- Node 20+
- `GROQ_API_KEY` in `.env` (optional `GROQ_MODEL=openai/gpt-oss-120b`)
- Network for on-demand website fetch

## Setup

```bash
cp .env.example .env
npm install
npm run dev -- -H 127.0.0.1 -p 3002
```

Open [http://localhost:3002](http://localhost:3002).

## Validation

### 1. Discover (seed feed)

1. Open the app — opportunity feed shows ≥10 seed companies.
2. Each row: hypothesis, score, confidence, ≥1 signal.

### 2. Investigate (on-demand)

1. Enter `kone.com` (or judge company) → Investigate.
2. See facts vs hypotheses separated; gaps if sources thin.

### 3. Demonstrate

1. Run One-Hour Proof.
2. Expect consolidation output + limitations; if synthetic, UI says so.

### 4. Quantify + Convert

1. Edit hours/week assumption → estimate changes.
2. Soft-gated drafts show investigate/low-confidence when criteria fail.
3. Copy draft; no Send button.

### API smoke

```bash
curl -sS http://127.0.0.1:3002/api/opportunities | jq '.entries|length'
curl -sS -X POST http://127.0.0.1:3002/api/opportunities/investigate \
  -H 'Content-Type: application/json' -d '{"input":"kone.com"}' | jq '{company:.company.name, conf:.opportunity.confidence}'
curl -sS -X POST http://127.0.0.1:3002/api/proofs/run \
  -H 'Content-Type: application/json' -d '{"companyName":"Demo","forceSynthetic":true}' | jq '{source:.inputSource, status:.status}'
```

## Contracts

See [contracts/openapi.yaml](./contracts/openapi.yaml) and [data-model.md](./data-model.md).
