import type {
  Confidence,
  EvidenceStrength,
  RecommendedAction,
  ScoreBreakdown,
  Signal,
} from "@/types/proofpulse";

export const SCORE_WEIGHTS = {
  relevance: 0.25,
  evidenceStrength: 0.3,
  timeliness: 0.2,
  demoFeasibility: 0.15,
  businessValue: 0.1,
} as const;

export function computeScore(breakdown: ScoreBreakdown): number {
  const raw =
    breakdown.relevance * SCORE_WEIGHTS.relevance +
    breakdown.evidenceStrength * SCORE_WEIGHTS.evidenceStrength +
    breakdown.timeliness * SCORE_WEIGHTS.timeliness +
    breakdown.demoFeasibility * SCORE_WEIGHTS.demoFeasibility +
    breakdown.businessValue * SCORE_WEIGHTS.businessValue;
  return Math.round(Math.min(100, Math.max(0, raw)));
}

export function confidenceFromSignals(signals: Signal[]): Confidence {
  const types = new Set(signals.map((s) => s.sourceType));
  if (signals.length >= 3 && types.size >= 2) return "high";
  if (signals.length >= 2) return "medium";
  return "low";
}

export function evidenceStrengthFromSignals(
  signals: Signal[]
): EvidenceStrength {
  const conf = confidenceFromSignals(signals);
  if (conf === "high") return "strong";
  if (conf === "medium") return "moderate";
  return "weak";
}

export function defaultBreakdown(signals: Signal[]): ScoreBreakdown {
  const strength = evidenceStrengthFromSignals(signals);
  const strengthScore =
    strength === "strong" ? 80 : strength === "moderate" ? 55 : 30;
  const typeBonus = Math.min(20, new Set(signals.map((s) => s.sourceType)).size * 8);
  return {
    relevance: 70,
    evidenceStrength: strengthScore,
    timeliness: 50 + typeBonus,
    demoFeasibility: 75,
    businessValue: 55,
  };
}

export function actionFromScore(
  score: number,
  confidence: Confidence
): RecommendedAction {
  if (confidence === "low" || score < 45) return "investigate";
  if (score >= 70) return "pursue";
  if (score < 35) return "reject";
  return "investigate";
}
