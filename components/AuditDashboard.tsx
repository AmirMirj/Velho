"use client";

import type { Leak } from "@/types/audit";

interface AuditDashboardProps {
  leaks: Leak[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function AuditDashboard({
  leaks,
  selectedId,
  onSelect,
}: AuditDashboardProps) {
  const sorted = [...leaks].sort((a, b) => a.rank - b.rank);

  if (sorted.length === 0) {
    return (
      <div className="map empty">
        No leaks in this audit — check gaps or try another domain.
      </div>
    );
  }

  return (
    <div className="opportunity-map">
      <h2>Audit dashboard</h2>
      <p className="muted">
        Ranked public UX/ops conversion leaks (not security vulns). Select one
        to see the conceptual fix.
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
                impact {o.impactScore}/5 · effort {o.effortScore}/5 ·{" "}
                {o.confidence}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
