import type { ConsolidatedRow, ConsolidationResult, ReportInput } from "./types.ts";

export interface ParsedRow {
  metric: string;
  value: number;
  unit: string;
}

function normMetric(m: string): string {
  const t = m.trim().toLowerCase().replace(/\s+/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** Parse "metric, value, unit" lines; ignores headers and prose. */
export function parseReport(text: string): ParsedRow[] {
  const rows: ParsedRow[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line.includes(",")) continue;
    const parts = line.split(/[,;\t]/).map((p) => p.trim());
    if (parts.length < 2 || !parts[0]) continue;
    const value = Number(parts[1].replace(/\s/g, "").replace(/%$/, ""));
    if (!Number.isFinite(value)) continue;
    rows.push({ metric: normMetric(parts[0]), value, unit: (parts[2] || "").trim() });
  }
  return rows;
}

function isAverageUnit(unit: string): boolean {
  return /^(%|ratio|percent|pct)$/i.test(unit.trim());
}

export function consolidateReports(inputs: ReportInput[]): ConsolidationResult {
  const units: string[] = [];
  const byMetric = new Map<string, { unit: string; perUnit: Record<string, number> }>();

  for (const input of inputs) {
    const parsed = parseReport(input.text);
    if (parsed.length === 0) continue;
    units.push(input.name);
    for (const r of parsed) {
      const entry = byMetric.get(r.metric) ?? { unit: r.unit, perUnit: {} };
      if (!entry.unit && r.unit) entry.unit = r.unit;
      entry.perUnit[input.name] = r.value;
      byMetric.set(r.metric, entry);
    }
  }

  const rows: ConsolidatedRow[] = [...byMetric.entries()].map(([metric, e]) => {
    const values = Object.values(e.perUnit);
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = values.length ? sum / values.length : 0;
    const avg = isAverageUnit(e.unit);
    const flagged =
      values.length > 1 && mean !== 0 && values.some((v) => Math.abs(v - mean) / Math.abs(mean) > 0.2);
    return {
      metric,
      unit: e.unit,
      perUnit: e.perUnit,
      aggregate: avg ? Math.round(mean * 10) / 10 : Math.round(sum * 10) / 10,
      aggregateLabel: avg ? "Average" : "Total",
      flagged,
    };
  });

  const flaggedCount = rows.filter((r) => r.flagged).length;
  return {
    inputs,
    units,
    rows,
    manualWork: [
      `Review ${flaggedCount} flagged metric${flaggedCount === 1 ? "" : "s"} where a unit differs more than 20% from the average.`,
      "Confirm metric names map correctly when report layouts change.",
      "Add commentary and decisions — the prototype only consolidates numbers.",
    ],
  };
}

/** Run with optional user-supplied text; fall back to samples if it has no rows. */
export function runConsolidation(
  samples: ReportInput[],
  pasted?: string
): ConsolidationResult {
  const trimmed = (pasted || "").trim();
  if (!trimmed) return consolidateReports(samples);
  const userInput: ReportInput = { name: "Your pasted report", text: trimmed, origin: "user-supplied" };
  if (parseReport(trimmed).length === 0) {
    return {
      ...consolidateReports(samples),
      warning: "No metric rows found in the pasted text (expected lines like “Metric, Value, Unit”). Using the sample reports instead.",
    };
  }
  return consolidateReports([...samples, userInput]);
}
