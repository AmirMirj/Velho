# Research: Aggressive Auditor

## 1. Matrix approach selection

**Decision**: Build **Aggressive Auditor** for this hackathon slice.

**Rationale**: Medium engineering complexity; high shock/proof value; maps directly to constitution “Proof before pitch” and existing public-fetch + LLM stack. Dead Deal needs CRM (conflicts with public-only unless fake CSV). Executive Clone needs embeddings/audio (high complexity, deadline risk).

**Alternatives considered**:
- AI Executive Clone — deferred (embeddings/podcasts)
- Dead Deal Resurrector — deferred (CRM dependency)
- Stay on generic opportunity map only — weaker “Trojan Horse” demo

## 2. “Vulnerability” framing vs constitution / safety

**Decision**: Interpret “leaks” as **public UX/ops conversion friction**, not security vulnerabilities. Ban exploit tooling, auth bypass, and CVE hunting in product + prompts.

**Rationale**: Constitution IV (public data, no unauthorized access); Cursor safety rules disallow offensive cyber. UX leaks still deliver “we found a problem live” proof.

**Alternatives considered**:
- Full security audit / Puppeteer attack paths — rejected (policy + scope)
- Pure LLM opinion with no fetch — rejected (not live/grounded)

## 3. Staging link / coded fix

**Decision**: Generate an **in-app conceptual staging preview** (sanitized HTML string rendered in a sandboxed iframe or dedicated panel). Label as concept/draft. Do **not** deploy to the prospect’s domain or claim production deploy.

**Rationale**: Delivers “here’s the fix working” demo without unauthorized writes. Session-only per FR-009.

**Alternatives considered**:
- Hosted Vercel preview per company — extra infra for little demo gain
- Link only to their live site with annotations — weaker “coded fix” story

## 4. Fetch strategy (Puppeteer vs static)

**Decision**: MVP = existing `fetch` + browser-like UA + `/en/*` paths + HTML heuristics. Optional Puppeteer later.

**Rationale**: Ship the Sharp Idea; static fetch already works for Nokia/Kone after UA fix; Puppeteer adds install/runtime risk mid-hackathon.

**Alternatives considered**:
- Puppeteer/Playwright for every page — rejected for v1
- Third-party scrape proxies — rejected (secrets, cost, ToS)

## 5. Heuristics before LLM

**Decision**: Deterministic detectors produce seed findings (missing/404 key paths, thin text, large HTML, weak CTA keywords, broken internal link samples). Groq ranks/rewrites into CEO-grade leaks + fixes + staging HTML, citing only provided evidence.

**Rationale**: Faster, more grounded, fewer hallucinations; LLM adds tone and conceptual fix.

**Alternatives considered**:
- LLM-only analysis — weaker evidence trail
- Heavy Lighthouse CI — too slow/fragile for live judges

## 6. LLM provider

**Decision**: Groq OpenAI-compatible API; default model `openai/gpt-oss-120b` (Llama 3.x deprecated on free/dev tier). Env: `GROQ_API_KEY`, `GROQ_MODEL`.

**Rationale**: User-supplied Groq key; already wired in `lib/openrouter.ts`.

**Alternatives considered**: OpenRouter — keep as fallback only if `GROQ_API_KEY` unset.

## 7. API surface

**Decision**: Add `POST /api/audits` returning `AuditPack`. Keep `/api/packs` for backward compatibility or thin-wrap to audits during transition.

**Rationale**: Clear product language; avoids breaking old smoke scripts immediately.

**Alternatives considered**: Only rename packs → audits — more churn for little gain.
