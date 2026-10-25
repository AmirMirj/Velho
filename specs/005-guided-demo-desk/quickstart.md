# Quickstart: Guided Demo Desk

```bash
npm run dev -- -H 127.0.0.1 -p 3002
node --experimental-strip-types scripts/smoke-demo.ts   # logic (SC-003, SC-004)
node scripts/e2e-demo.mjs                                # browser run (SC-001, SC-002, SC-005)
```

1. Open http://127.0.0.1:3002/demo → dark desk theme, company cards, funnel strip, sticky "Investigate →".
2. Press **Play guided demo**, then only **Next: do it** ×6 and **Finish** → recap shows €12,480 / yr for Nordic Components (12/50/40).
3. Manual: click "Saimaa Logistics" card → funnel resets; press → repeatedly → reaches recap.
4. Press Escape during tour → card closes, state kept.
5. Open `/` → same theme.
