import type { BusinessCaseAssumptions } from "@/types/proofpulse";

export const DEFAULT_ASSUMPTIONS: BusinessCaseAssumptions = {
  hoursPerWeek: 10,
  automationShare: 0.6,
  laborCostEurPerHour: 40,
};

export function estimateAnnualEur(a: BusinessCaseAssumptions): number {
  const hours = Math.max(0, a.hoursPerWeek);
  const share = Math.min(1, Math.max(0, a.automationShare));
  const cost = Math.max(0, a.laborCostEurPerHour);
  return Math.round(hours * share * cost * 52);
}

export const ASSUMPTIONS_NOTE =
  "Example only—not guaranteed savings. It does not subtract the cost of setting up or maintaining a tool.";
