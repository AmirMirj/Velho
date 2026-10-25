import type { Assumptions, BusinessCase } from "./types.ts";

export const RANGES = {
  hoursPerWeek: { min: 0, max: 80 },
  automationPct: { min: 0, max: 100 },
  costPerHour: { min: 0, max: 300 },
} as const;

function clampNum(v: unknown, min: number, max: number): number {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export function clampAssumptions(a: Partial<Record<keyof Assumptions, unknown>>): Assumptions {
  return {
    hoursPerWeek: clampNum(a.hoursPerWeek, RANGES.hoursPerWeek.min, RANGES.hoursPerWeek.max),
    automationPct: clampNum(a.automationPct, RANGES.automationPct.min, RANGES.automationPct.max),
    costPerHour: clampNum(a.costPerHour, RANGES.costPerHour.min, RANGES.costPerHour.max),
  };
}

export function computeBusinessCase(a: Partial<Record<keyof Assumptions, unknown>>): BusinessCase {
  const clamped = clampAssumptions(a);
  const rawHours = clamped.hoursPerWeek * (clamped.automationPct / 100) * 52;
  const annual = Math.round(rawHours * clamped.costPerHour);
  return {
    clamped,
    hoursPerYear: Math.round(rawHours),
    annual,
    monthly: Math.round(annual / 12),
  };
}

export function formatEur(n: number): string {
  return "€" + Math.round(n).toLocaleString("en-US");
}

export function formulaLine(bc: BusinessCase): string {
  const c = bc.clamped;
  return `${c.hoursPerWeek} hours/week × ${c.automationPct}% × 52 weeks × ${c.costPerHour} €/hour`;
}

export const CASE_NOTE =
  "Capacity value is not guaranteed cash savings; implementation and maintenance costs are excluded.";
