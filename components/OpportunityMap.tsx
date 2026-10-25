"use client";

import type { OpportunityHypothesis } from "@/types/pack";

interface OpportunityMapProps {
  opportunities: OpportunityHypothesis[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function OpportunityMap({
  opportunities,
  selectedId,
  onSelect,
}: OpportunityMapProps) {
  const sorted = [...opportunities].sort((a, b) => a.rank - b.rank);

  if (sorted.length === 0) {
    return (
      <div className="map empty">
        No opportunities in this pack — check gaps or try another domain.
      </div>
    );
  }

  return (
    <div className="opportunity-map">
      <h2>Opportunity map</h2>
      <p className="muted">
        Ranked by likely business value vs effort. Select one to drill down.
      </p>
      <ol className="opp-list">
        {sorted.map((o) => (
          <li key={o.id}>
            <button
              type="button"
              className={
                selectedId === o.id ? "opp-row selected" : "opp-row"
              }
              onClick={() => onSelect(o.id)}
            >
              <span className="rank">#{o.rank}</span>
              <span className="title">{o.title}</span>
              <span className="scores">
                value {o.valueScore}/5 · effort {o.effortScore}/5 ·{" "}
                {o.confidence}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
