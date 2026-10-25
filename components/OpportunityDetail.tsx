"use client";

import type { OpportunityHypothesis, PublicSignal } from "@/types/pack";

interface OpportunityDetailProps {
  opportunity: OpportunityHypothesis | null;
  signals: PublicSignal[];
}

export function OpportunityDetail({
  opportunity,
  signals,
}: OpportunityDetailProps) {
  if (!opportunity) {
    return (
      <div className="opp-detail empty">
        Select an opportunity on the map to see rationale and “what we’d try
        first”.
      </div>
    );
  }

  const linked = signals.filter((s) =>
    opportunity.signalIds.includes(s.id)
  );

  return (
    <article className="opp-detail">
      <h3>{opportunity.title}</h3>
      <p className="meta">
        Rank #{opportunity.rank} · value {opportunity.valueScore}/5 · effort{" "}
        {opportunity.effortScore}/5 · confidence {opportunity.confidence}
      </p>
      <h4>Why it matters</h4>
      <p>{opportunity.rationale}</p>
      <h4>What we’d try first</h4>
      <p className="try-first">{opportunity.tryFirst}</p>
      <h4>Linked public signals</h4>
      {linked.length === 0 ? (
        <p className="muted">
          No linked signals — treat as a low-confidence hypothesis.
        </p>
      ) : (
        <ul className="signal-list">
          {linked.map((s) => (
            <li key={s.id}>
              <strong>{s.sourceLabel}</strong>{" "}
              <a href={s.sourceUrl} target="_blank" rel="noreferrer">
                source
              </a>
              <blockquote>{s.excerpt}</blockquote>
              <p className="muted">{s.whyItMatters}</p>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
