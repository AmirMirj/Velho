# ProofPulse

**Don't pitch a company. Show it what it could fix.**

Velho hackathon tool: seed Finnish opportunities → investigate any company live → One-Hour Proof (document consolidation) → transparent business case → soft CEO Attention Test → COO drafts (**never sent**).

Spec / plan / tasks: [`specs/003-proofpulse/`](specs/003-proofpulse/)  
Quickstart: [`specs/003-proofpulse/quickstart.md`](specs/003-proofpulse/quickstart.md)

## Setup

```bash
cp .env.example .env
# GROQ_API_KEY=...
npm install
npm run dev -- -H 127.0.0.1 -p 3002
```

Open [http://localhost:3002](http://localhost:3002).

## Interactive presentation demo (`/demo`)

Offline, fictional-data walkthrough for the hackathon pitch: [http://localhost:3002/demo](http://localhost:3002/demo)

1. Select a company and signal — how an opportunity is detected
2. Investigate — observed evidence vs unverified assumptions
3. Adjust the business case — hours/week × automation % × €/h × 52
4. Generate the proof plan — then run the working report-consolidation prototype (optionally paste your own `Metric, Value, Unit` lines)
5. Prepare the meeting request — COO-addressed internal draft, never sent

**Easiest way to present:** click **▶ Play guided demo**. A coach card explains each step in one sentence, and **Next: do it** performs it for you. After 7 steps you land on a recap that shows the company, signal, annual value and formula, prototype result and draft status.

- **One button at a time.** The sticky bar at the bottom always shows the single next action. Press `→` to trigger it and `Esc` to leave the tour.
- **Funnel strip.** Signal → Evidence → Value → Proof → Meeting, with live numbers. Click any stage you've already reached to jump back to it.
- **Why this prospect.** Each priority score is split into Evidence strength (≤40), Workload size (≤35) and Velho fit (≤25), and the parts add up exactly to the total.
- Theme: a dark slate "desk" with an emerald accent, adapted from the earlier Mergero project and shared with the workspace at `/`.

Spec: [`specs/005-guided-demo-desk/`](specs/005-guided-demo-desk/) (earlier: `004-interactive-demo`)

- Logic smoke test: `node --experimental-strip-types scripts/smoke-demo.ts`
- Browser e2e (server must be running): `node scripts/e2e-demo.mjs`. This needs `playwright` installed, or set `PLAYWRIGHT_CORE=<path>`. Optional: `CHROME_PATH`, `DEMO_URL`.

**Next step:** replace fictional signals with real, cited public data for one live-demo company and run the prototype on its data.

## APIs

- `GET /api/opportunities` — seed feed
- `GET /api/opportunities/seed` — full seed records
- `POST /api/opportunities/investigate` — `{ "input": "kone.com" }`
- `POST /api/proofs/run` — document consolidation proof

## Ground rules

- Public evidence only; fact ≠ hypothesis
- Session-only runtime state
- Soft CEO gate; drafts never auto-sent
