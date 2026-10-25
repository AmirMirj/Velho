// Run: node --experimental-strip-types scripts/smoke-demo.ts
import { computeBusinessCase, clampAssumptions } from "../lib/demo/business-case.ts";
import { COMPANIES } from "../lib/demo/companies.ts";
import { runConsolidation, parseReport } from "../lib/demo/consolidate.ts";
import { SAMPLE_REPORTS } from "../lib/demo/sample-reports.ts";
import { buildProofPlan, DEMO_TYPES } from "../lib/demo/demonstrations.ts";
import { buildMeetingDraft } from "../lib/demo/meeting.ts";
import { breakdown, sumBreakdown, BREAKDOWN_CAPS } from "../lib/demo/priority.ts";
import { TOUR } from "../lib/demo/tour.ts";

let failures = 0;
function check(name: string, cond: boolean, detail = "") {
  console.log(`${cond ? "OK  " : "FAIL"} ${name}${detail ? " — " + detail : ""}`);
  if (!cond) failures++;
}

const bc = computeBusinessCase({ hoursPerWeek: 12, automationPct: 50, costPerHour: 40 });
check("business case reference (SC-003)", bc.hoursPerYear === 312 && bc.annual === 12480 && bc.monthly === 1040, JSON.stringify(bc));

const c = clampAssumptions({ hoursPerWeek: 500, automationPct: -5, costPerHour: "abc" });
check("clamping (FR-007)", c.hoursPerWeek === 80 && c.automationPct === 0 && c.costPerHour === 0, JSON.stringify(c));
check("empty input → €0", computeBusinessCase({ hoursPerWeek: "", automationPct: 50, costPerHour: 40 }).annual === 0);

check("≥4 companies with ≥2 signals (FR-001)", COMPANIES.length >= 4 && COMPANIES.every((x) => x.signals.length >= 2));
check(
  "every evidence item has a source type (SC-004)",
  COMPANIES.every((x) => x.signals.every((s) => s.evidence.length > 0 && s.evidence.every((e) => Boolean(e.sourceType))))
);

const run = runConsolidation(SAMPLE_REPORTS);
check("consolidation rows (FR-009)", run.rows.length === 5 && run.units.length === 3, `${run.rows.length} rows`);
const units = run.rows.find((r) => r.metric === "Units produced");
check("units total", units?.aggregate === 10960 && units.aggregateLabel === "Total");
const scrap = run.rows.find((r) => r.metric === "Scrap rate");
check("scrap average", scrap?.aggregateLabel === "Average" && scrap.aggregate === 2.6);

const user = runConsolidation(SAMPLE_REPORTS, "Units produced, 1000, count");
check("user-supplied input merged (FR-009a)", user.units.length === 4 && user.inputs.some((i) => i.origin === "user-supplied"));
const bad = runConsolidation(SAMPLE_REPORTS, "hello world");
check("invalid paste falls back with warning", Boolean(bad.warning) && bad.units.length === 3);
check("parseReport skips header", parseReport("Metric, Value, Unit\nA, 1, x").length === 1);

const company = COMPANIES[0];
const signal = company.signals[0];
for (const d of DEMO_TYPES) {
  const plan = buildProofPlan(company, signal, d.id, bc);
  check(`proof plan ${d.id}`, plan.intro.includes(company.name) && plan.valueLine.includes("312"));
}
const draft = buildMeetingDraft(company, signal, "report-consolidation", bc);
check(
  "meeting draft contents (SC-005)",
  draft.subject.includes(company.name) && draft.body.includes("€12,480") && draft.addressee.includes("COO") && /never sent/.test(draft.label)
);
check("draft cites signal evidence", draft.body.includes("weekly reporting"));

// Feature 005 — Guided Demo Desk
const allSignals = COMPANIES.flatMap((x) => x.signals);
const bad005 = allSignals.filter((s) => {
  const b = breakdown(s);
  return (
    sumBreakdown(b) !== s.priority ||
    b.evidence < 0 || b.evidence > BREAKDOWN_CAPS.evidence ||
    b.workload < 0 || b.workload > BREAKDOWN_CAPS.workload ||
    b.fit < 0 || b.fit > BREAKDOWN_CAPS.fit
  );
});
check("priority breakdown sums to priority within caps (SC-004)", bad005.length === 0, bad005.map((s) => s.id).join(","));
check("edge priorities 0 and 100 split within caps", [0, 100].every((p) => {
  const b = breakdown({ ...signal, priority: p });
  return sumBreakdown(b) === p && b.workload <= 35 && b.evidence <= 40 && b.fit <= 25;
}));
check("tour has 7 steps ending in recap (FR-001)", TOUR.length === 7 && TOUR[TOUR.length - 1].id === "recap");
check("tour titles ≤ 40 chars", TOUR.every((t) => t.title.length <= 40));

console.log(failures ? `\n${failures} failure(s)` : "\nAll demo smoke checks passed.");
process.exit(failures ? 1 : 0);
