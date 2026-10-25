"use client";

import type { Demonstration } from "@/types/proofpulse";

interface Props {
  demo: Demonstration | null;
  running: boolean;
  onRun: () => void;
}

export function ProofRunner({ demo, running, onRun }: Props) {
  return (
    <section className="drafts">
      <h2>Sample Test</h2>
      <p className="muted">
        Try combining sample reports. This does not use or change the company’s files.
      </p>
      <button type="button" className="copy" onClick={onRun} disabled={running}>
        {running ? "Running test…" : demo ? "Run test again" : "Run sample test"}
      </button>
      {demo && (
        <div className="staging" style={{ marginTop: "1rem" }}>
          {demo.inputSource === "synthetic-fallback" && (
            <p className="staging-banner">
              These are made-up examples, not the company’s private files.
            </p>
          )}
          <h4>Sample reports</h4>
          <ul className="signal-list">
            {demo.inputs.map((i) => (
              <li key={i.name}>
                <strong>{i.name}</strong>
                <blockquote>{i.excerpt}</blockquote>
              </li>
            ))}
          </ul>
          <h4>Combined result</h4>
          <p>{demo.output.summary}</p>
          <pre className="body">
            {JSON.stringify(demo.output.rows.slice(0, 8), null, 2)}
          </pre>
          <h4>What this test cannot do</h4>
          <ul className="gaps">
            {demo.limitations.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
