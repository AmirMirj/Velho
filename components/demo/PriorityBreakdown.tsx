import { BREAKDOWN_CAPS, BREAKDOWN_LABELS, breakdown, sumBreakdown, type PriorityBreakdown as PB } from "@/lib/demo/priority.ts";
import type { Signal } from "@/lib/demo/types.ts";

const KEYS: (keyof PB)[] = ["evidence", "workload", "fit"];

export function PriorityBreakdown({ signal }: { signal: Signal }) {
  const b = breakdown(signal);
  const sum = sumBreakdown(b);
  return (
    <div className="breakdown" data-testid="breakdown" data-sum={sum}>
      <div className="bd-head">
        <span className="bd-title">Why this prospect</span>
        <strong className="bd-score">{sum}</strong>
        <span className="bd-of">/ 100 priority</span>
        <span className={`chip conf-${signal.confidence.toLowerCase()}`}>{signal.confidence} confidence</span>
      </div>
      <div className="bd-bar" role="img" aria-label={KEYS.map((k) => `${BREAKDOWN_LABELS[k]} ${b[k]}`).join(", ")}>
        {KEYS.map((k) => (
          <span key={k} className={`bd-seg ${k}`} style={{ width: `${b[k]}%` }} />
        ))}
      </div>
      <ul className="bd-legend">
        {KEYS.map((k) => (
          <li key={k}>
            <span className={`dot ${k}`} aria-hidden />
            {BREAKDOWN_LABELS[k]} <strong>{b[k]}</strong>
            <span className="muted-num">/{BREAKDOWN_CAPS[k]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
