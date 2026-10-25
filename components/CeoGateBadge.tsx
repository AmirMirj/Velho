"use client";

import type { CeoGateResult } from "@/types/proofpulse";

export function CeoGateBadge({ gate }: { gate: CeoGateResult | null }) {
  if (!gate) return null;
  const explanations: Record<string, string> = {
    "No cited public facts": "We could not find a public source to back up a fact.",
    "Missing opportunity hypothesis": "We still need to write down what might be happening.",
    "Working demonstration not completed": "The sample test has not been run yet.",
    "Business-case assumptions missing": "The value estimate needs example numbers.",
    "Message not company-specific enough": "The message needs a detail about this company.",
    "Evidence confidence is low": "The public clues are not strong yet.",
  };

  return (
    <div className={`pack-status ${gate.passed ? "complete" : "partial"}`}>
      <div className="status-line">
        <span className="badge">
          {gate.passed ? "Ready to review" : "A few things need checking"}
        </span>
      </div>
      {!gate.passed && (
        <ul className="gaps">
          {gate.failedCriteria.map((c) => (
            <li key={c}>{explanations[c] ?? c}</li>
          ))}
        </ul>
      )}
      {gate.passed && (
        <p className="muted">
          This is only a reminder to review the clues. You decide what happens next.
        </p>
      )}
    </div>
  );
}
