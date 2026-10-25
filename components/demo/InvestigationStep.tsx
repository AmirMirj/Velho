import type { Signal } from "@/lib/demo/types.ts";

export function InvestigationStep({ signal }: { signal: Signal }) {
  return (
    <>
      <p className="hyp">
        <span className="chip warn">Hypothesis</span>
        {signal.hypothesis}
      </p>
      <div className="grid two">
        <div>
          <p className="list-title">Observed evidence</p>
          <ul className="list">
            {signal.evidence.map((e) => (
              <li key={e.text}>
                <span className="chip ok">{e.sourceType}</span>
                {e.text}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="list-title">Unverified assumptions</p>
          <ul className="list">
            {signal.assumptions.map((a) => (
              <li key={a}>
                <span className="chip warn">?</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <details className="more">
          <summary>Questions to validate ({signal.questions.length})</summary>
          <ol>
            {signal.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
      </details>
    </>
  );
}
