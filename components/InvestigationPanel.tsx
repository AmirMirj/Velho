"use client";

import type { EvidenceItem, InvestigationResult, SeedRecord } from "@/types/proofpulse";

type ViewModel = InvestigationResult | (SeedRecord & { gaps?: string[]; warnings?: string[] });

interface Props {
  data: ViewModel | null;
}

export function InvestigationPanel({ data }: Props) {
  if (!data) {
    return (
      <div className="opp-detail empty">
        Select a feed entry or investigate a company to open the workspace.
      </div>
    );
  }

  const facts = data.evidence.filter((e: EvidenceItem) => e.kind === "fact");
  const hyps = data.evidence.filter((e: EvidenceItem) => e.kind === "hypothesis");
  const signals = data.signals;
  const gaps = "gaps" in data ? data.gaps || [] : [];
  const warnings = "warnings" in data ? data.warnings || [] : [];
  const now = Date.now();
  const recentSignals = signals.filter((signal) => {
    if (!signal.publishedAt) return false;
    const publishedAt = Date.parse(signal.publishedAt);
    const age = now - publishedAt;
    return Number.isFinite(publishedAt) && age >= 0 && age <= 365 * 24 * 60 * 60 * 1000;
  });
  const clueStrength = {
    high: "strong",
    medium: "mixed",
    low: "limited",
  }[data.opportunity.confidence];

  return (
    <article className="opp-detail">
      <h3>
        {data.company.name}{" "}
        <span className="muted">
          ({data.company.domain || "no domain"})
        </span>
      </h3>
      <p className="meta">
        Match score {data.opportunity.score}/100 · clues look {clueStrength}
      </p>
      <p className="hint">
        The score helps sort companies. It does not mean they want to buy.
      </p>

      <h4>Public signals</h4>
      <p className="hint">
        These company pages may be worth checking. A page is not proof that a
        problem exists.
      </p>
      {signals.length > 0 ? (
        <>
          <ul className="signal-list public-signals">
            {signals.map((signal) => {
              const publishedAt = signal.publishedAt
                ? Date.parse(signal.publishedAt)
                : Number.NaN;
              const age = now - publishedAt;
              const isRecent =
                Number.isFinite(publishedAt) &&
                age >= 0 &&
                age <= 365 * 24 * 60 * 60 * 1000;
              const dateLabel = Number.isFinite(publishedAt)
                ? new Date(publishedAt).toLocaleDateString()
                : "Date not shown";
              const sourceTypeLabel = {
                jobs: "Jobs",
                procurement: "Tender or supplier notice",
                registry: "Permit or registry",
                other: "News or update",
                website: "Company page",
              }[signal.sourceType];
              return (
                <li key={signal.id}>
                  <span className={`signal-date${isRecent ? " recent" : ""}`}>
                    {isRecent ? "Recent · " : ""}
                    {dateLabel}
                  </span>
                  <span className="signal-kind">{sourceTypeLabel}</span>
                  <strong>{signal.sourceLabel}</strong>
                  <p>{signal.summary}</p>
                  {signal.sourceUrl && (
                    <a href={signal.sourceUrl} target="_blank" rel="noreferrer">
                      Open source
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
          {recentSignals.length === 0 && (
            <p className="hint">
              No dated signal from the last 12 months was found. Check the
              linked pages for updates.
            </p>
          )}
        </>
      ) : (
        <p className="hint">
          No job, news, permit, or tender pages were found. Try the company
          website directly and check its public updates.
        </p>
      )}

      <h4>What we know</h4>
      <ul className="signal-list">
        {facts.map((f) => (
          <li key={f.id}>
            {f.text}{" "}
            {f.sourceUrl && (
              <a href={f.sourceUrl} target="_blank" rel="noreferrer">
                source
              </a>
            )}
          </li>
        ))}
      </ul>

      <h4>What might be happening</h4>
      <p className="hint">These are guesses to check, not confirmed facts.</p>
      <ul className="signal-list">
        {hyps.map((h) => (
          <li key={h.id}>{h.text}</li>
        ))}
      </ul>

      <h4>Why this may matter now</h4>
      <p>{data.opportunity.whyNow}</p>

      <details className="more-details">
        <summary>How we worked out the score</summary>
        <p className="muted">
          Clues {data.opportunity.scoreBreakdown.relevance} · strength{" "}
          {data.opportunity.scoreBreakdown.evidenceStrength} · timing{" "}
          {data.opportunity.scoreBreakdown.timeliness} · test fit{" "}
          {data.opportunity.scoreBreakdown.demoFeasibility} · possible value{" "}
          {data.opportunity.scoreBreakdown.businessValue}
        </p>
      </details>

      {gaps.length > 0 && (
        <>
          <h4>Gaps</h4>
          <ul className="gaps">
            {gaps.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </>
      )}
      {warnings.length > 0 && (
        <ul className="warnings">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
    </article>
  );
}
