"use client";

import type { Leak, PublicSignal } from "@/types/audit";
import { StagingPreview } from "@/components/StagingPreview";

interface LeakDetailProps {
  leak: Leak | null;
  signals: PublicSignal[];
}

export function LeakDetail({ leak, signals }: LeakDetailProps) {
  if (!leak) {
    return (
      <div className="opp-detail empty">
        Select a leak on the dashboard to see evidence, conceptual fix, and
        staging preview.
      </div>
    );
  }

  const linked = signals.filter((s) => leak.signalIds.includes(s.id));

  return (
    <article className="opp-detail">
      <h3>{leak.title}</h3>
      <p className="meta">
        Rank #{leak.rank} · impact {leak.impactScore}/5 · effort{" "}
        {leak.effortScore}/5 · confidence {leak.confidence}
      </p>
      <h4>Why it costs conversions</h4>
      <p>{leak.rationale}</p>
      <h4>What we’d try first</h4>
      <p className="try-first">{leak.tryFirst}</p>
      <h4>Conceptual coded fix</h4>
      <p>{leak.conceptualFix}</p>
      <StagingPreview html={leak.stagingPreviewHtml} />
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
