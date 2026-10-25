import type { ConsolidationResult, ProofPlan } from "@/lib/demo/types.ts";

interface Props {
  plan: ProofPlan;
  pasted: string;
  onPasted: (v: string) => void;
  result: ConsolidationResult | null;
  onRun: () => void;
}

function fmt(n: number | undefined): string {
  return n === undefined ? "—" : n.toLocaleString("en-US");
}

export function ProofStep({ plan, pasted, onPasted, result, onRun }: Props) {
  return (
    <>
      <p className="value">{plan.valueLine}</p>
      <ol className="flow">
        {plan.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <details className="more">
        <summary>Data, run approach and limitations</summary>
        <ul>
          <li>
            <strong>Data:</strong> {plan.dataNeeded.join("; ")}
          </li>
          <li>
            <strong>Run:</strong> {plan.runApproach}
          </li>
          <li>
            <strong>Success:</strong> {plan.successMeasure}
          </li>
          {plan.limitations.map((l) => (
            <li key={l}>
              <strong>Limit:</strong> {l}
            </li>
          ))}
        </ul>
      </details>

      {plan.runnable ? (
        <ProofRunner pasted={pasted} onPasted={onPasted} result={result} onRun={onRun} />
      ) : (
        <p className="note">Plan only — choose “Automated report consolidation” to run a live prototype.</p>
      )}

    </>
  );
}

interface RunnerProps {
  pasted: string;
  onPasted: (v: string) => void;
  result: ConsolidationResult | null;
  onRun: () => void;
}

function ProofRunner({ pasted, onPasted, result, onRun }: RunnerProps) {
  return (
    <>
      <div className="actions">
        <button className="btn ghost" onClick={onRun}>
          {result ? "Re-run prototype ↻" : "Run sample prototype ▶"}
        </button>
        <span className="chip warn">illustrative sample data</span>
      </div>
      <details className="more">
        <summary>Paste your own report lines (optional, processed locally)</summary>
        <textarea
          rows={3}
          style={{ width: "100%" }}
          value={pasted}
          placeholder={"Units produced, 3500, count\nScrap rate, 2.8, %"}
          onChange={(e) => onPasted(e.target.value)}
        />
      </details>
      {result && <ProofResult result={result} />}
    </>
  );
}

function ProofResult({ result }: { result: ConsolidationResult }) {
  return (
    <>
      {result.warning && <p className="note warn-text">{result.warning}</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              {result.units.map((u) => (
                <th key={u}>{u.replace(/ — weekly ops report$/, "")}</th>
              ))}
              <th>Total / avg</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((r) => (
              <tr key={r.metric} className={r.flagged ? "flagged" : ""}>
                <td>
                  {r.metric} {r.unit && <span className="note">({r.unit})</span>}{" "}
                  {r.flagged && <span className="chip warn">check</span>}
                </td>
                {result.units.map((u) => (
                  <td key={u}>{fmt(r.perUnit[u])}</td>
                ))}
                <td>
                  <strong>{fmt(r.aggregate)}</strong> <span className="note">{r.aggregateLabel}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <details className="more">
        <summary>
          {result.inputs.length} inputs · remaining manual work
        </summary>
        <ul>
          {result.manualWork.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        {result.inputs.map((i) => (
          <details key={i.name}>
            <summary>
              {i.name} <span className={`chip ${i.origin === "user-supplied" ? "warn" : ""}`}>{i.origin}</span>
            </summary>
            <pre>{i.text}</pre>
          </details>
        ))}
      </details>
    </>
  );
}
