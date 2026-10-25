"use client";

import {
  ASSUMPTIONS_NOTE,
  DEFAULT_ASSUMPTIONS,
  estimateAnnualEur,
} from "@/lib/business-case";
import type { BusinessCaseAssumptions } from "@/types/proofpulse";

interface Props {
  assumptions: BusinessCaseAssumptions;
  onChange: (next: BusinessCaseAssumptions) => void;
}

export function BusinessCasePanel({ assumptions, onChange }: Props) {
  const annual = estimateAnnualEur(assumptions);
  return (
    <section className="drafts">
      <h2>Estimate Possible Value</h2>
      <p className="muted">{ASSUMPTIONS_NOTE}</p>
      <p className="hint">
        Use your best guess for time, how much could be automated, and hourly
        cost. Change any number to see the estimate update.
      </p>
      <label className="label">
        Hours spent on this task per week
        <input
          type="number"
          value={assumptions.hoursPerWeek}
          onChange={(e) =>
            onChange({
              ...assumptions,
              hoursPerWeek: Number(e.target.value),
            })
          }
        />
      </label>
      <label className="label">
        Estimated automation (%)
        <input
          type="number"
          step="5"
          min={0}
          max={100}
          value={assumptions.automationShare * 100}
          onChange={(e) =>
            onChange({
              ...assumptions,
              automationShare: Number(e.target.value) / 100,
            })
          }
        />
      </label>
      <label className="label">
        Cost of one hour of work (€)
        <input
          type="number"
          value={assumptions.laborCostEurPerHour}
          onChange={(e) =>
            onChange({
              ...assumptions,
              laborCostEurPerHour: Number(e.target.value),
            })
          }
        />
      </label>
      <p className="try-first">
        Illustrative annual value:{" "}
        <strong>€{annual.toLocaleString("en-FI")}</strong>
      </p>
      <button
        type="button"
        className="quiet-action"
        onClick={() => onChange(DEFAULT_ASSUMPTIONS)}
      >
        Restore example numbers
      </button>
    </section>
  );
}
