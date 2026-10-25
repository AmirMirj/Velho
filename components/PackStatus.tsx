"use client";

import type { PackStatus as Status, ProofPack } from "@/types/pack";

interface PackStatusProps {
  generating: boolean;
  pack: ProofPack | null;
  requestError: string | null;
}

function statusLabel(s: Status): string {
  if (s === "complete") return "Complete";
  if (s === "partial") return "Partial";
  return "Error";
}

export function PackStatus({ generating, pack, requestError }: PackStatusProps) {
  if (generating) {
    return (
      <div className="pack-status generating" role="status">
        Gathering public signals and building the opportunity map…
      </div>
    );
  }

  if (requestError) {
    return (
      <div className="pack-status error" role="alert">
        <strong>Request failed.</strong> {requestError}
      </div>
    );
  }

  if (!pack) return null;

  return (
    <div className={`pack-status ${pack.status}`} role="status">
      <div className="status-line">
        <span className="badge">{statusLabel(pack.status)}</span>
        {pack.company && (
          <span>
            {pack.company.name}{" "}
            <span className="muted">({pack.company.domain})</span>
          </span>
        )}
      </div>
      {pack.company?.snapshot && (
        <p className="snapshot">{pack.company.snapshot}</p>
      )}
      {pack.gaps.length > 0 && (
        <ul className="gaps">
          {pack.gaps.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      )}
      {pack.warnings.length > 0 && (
        <ul className="warnings">
          {pack.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
