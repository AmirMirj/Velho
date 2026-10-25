import type { Signal } from "./types.ts";

export interface PriorityBreakdown {
  evidence: number;
  workload: number;
  fit: number;
}

export const BREAKDOWN_CAPS: PriorityBreakdown = { evidence: 40, workload: 35, fit: 25 };

export const BREAKDOWN_LABELS: Record<keyof PriorityBreakdown, string> = {
  evidence: "Evidence strength",
  workload: "Workload size",
  fit: "Velho fit",
};

const EVIDENCE_SHARE = { Low: 0.3, Medium: 0.38, High: 0.45 } as const;

/**
 * Splits a signal's priority into three explainable parts (Mergero-style score bar).
 * Invariant: evidence + workload + fit === clamp(priority, 0, 100), each part within its cap.
 */
export function breakdown(signal: Pick<Signal, "priority" | "confidence" | "evidence" | "recommendedDemo">): PriorityBreakdown {
  const p = Math.max(0, Math.min(100, Math.round(signal.priority)));
  const evidenceBonus = Math.min(0.05, Math.max(0, signal.evidence.length - 2) * 0.025);
  let evidence = Math.min(BREAKDOWN_CAPS.evidence, Math.round(p * (EVIDENCE_SHARE[signal.confidence] + evidenceBonus)));
  const fitShare = signal.recommendedDemo === "report-consolidation" ? 0.27 : 0.24;
  let fit = Math.min(BREAKDOWN_CAPS.fit, Math.round(p * fitShare));
  let workload = p - evidence - fit;
  if (workload > BREAKDOWN_CAPS.workload) {
    let excess = workload - BREAKDOWN_CAPS.workload;
    const e = Math.min(excess, BREAKDOWN_CAPS.evidence - evidence);
    evidence += e;
    excess -= e;
    fit += Math.min(excess, BREAKDOWN_CAPS.fit - fit);
    workload = p - evidence - fit;
  }
  return { evidence, workload, fit };
}

export function sumBreakdown(b: PriorityBreakdown): number {
  return b.evidence + b.workload + b.fit;
}
