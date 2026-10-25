"use client";

import type { FeedEntry } from "@/types/proofpulse";

interface Props {
  entries: FeedEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function OpportunityFeed({ entries, selectedId, onSelect }: Props) {
  return (
    <div className="opportunity-map">
      <h2>Companies to explore</h2>
      <p className="muted">
        Choose a company with public clues. A clue does not prove they need help.
      </p>
      <ol className="opp-list">
        {entries.map((e) => (
          <li key={e.opportunityId}>
            <button
              type="button"
              className={
                selectedId === e.opportunityId ? "opp-row selected" : "opp-row"
              }
              onClick={() => onSelect(e.opportunityId)}
            >
              <span className="rank" aria-label={`Match score ${e.score} out of 100`}>
                {e.score}
              </span>
              <span className="title">{e.companyName}</span>
              <span className="scores">
                {e.score}/100 match score · {e.signals.length} public clues
              </span>
              <span className="scores">{e.hypothesis}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
