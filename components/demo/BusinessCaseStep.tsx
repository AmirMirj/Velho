import { RANGES, formatEur, formulaLine } from "@/lib/demo/business-case.ts";
import { DEMO_TYPES } from "@/lib/demo/demonstrations.ts";
import type { Assumptions, BusinessCase, DemoTypeId } from "@/lib/demo/types.ts";

export type RawAssumptions = Record<keyof Assumptions, string>;

interface Props {
  raw: RawAssumptions;
  bc: BusinessCase;
  onRaw: (key: keyof Assumptions, value: string) => void;
  demoId: DemoTypeId;
  recommendedDemo: DemoTypeId;
  onDemo: (id: DemoTypeId) => void;
}

const FIELDS: { key: keyof Assumptions; label: string; step: number }[] = [
  { key: "hoursPerWeek", label: "Hours / week", step: 1 },
  { key: "automationPct", label: "Automated %", step: 5 },
  { key: "costPerHour", label: "Labor cost €/h", step: 1 },
];

export function BusinessCaseStep({ raw, bc, onRaw, demoId, recommendedDemo, onDemo }: Props) {
  return (
    <>
      <div className="grid">
        {FIELDS.map((f) => {
          const r = RANGES[f.key];
          const clamped = raw[f.key] !== "" && Number(raw[f.key]) !== bc.clamped[f.key];
          return (
            <label key={f.key}>
              <span className={clamped ? "warn-text" : undefined}>
                {f.label} {clamped ? `→ using ${bc.clamped[f.key]} (${r.min}–${r.max})` : ""}
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={r.min}
                max={r.max}
                step={f.step}
                value={raw[f.key]}
                onChange={(e) => onRaw(f.key, e.target.value)}
              />
            </label>
          );
        })}
      </div>
      <div className="kpis">
        <div className="kpi">
          <span>Hours released / yr</span>
          <strong>{bc.hoursPerYear.toLocaleString("en-US")}</strong>
        </div>
        <div className="kpi main">
          <span>Potential annual value</span>
          <strong>{formatEur(bc.annual)}</strong>
        </div>
        <div className="kpi">
          <span>Monthly</span>
          <strong>{formatEur(bc.monthly)}</strong>
        </div>
        <span className="chip warn">estimate, not measured</span>
      </div>
      <p className="formula">{formulaLine(bc)}</p>
      <div className="actions">
        <label>
          Demonstration
          <select value={demoId} onChange={(e) => onDemo(e.target.value as DemoTypeId)}>
            {DEMO_TYPES.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
                {d.id === recommendedDemo ? " ★ recommended" : ""}
                {d.runnable ? " · runnable" : ""}
              </option>
            ))}
          </select>
        </label>
      </div>
    </>
  );
}
