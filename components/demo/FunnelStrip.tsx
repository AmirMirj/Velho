import type { StepStatus } from "./Timeline";

export interface FunnelStage {
  n: number;
  label: string;
  value: string;
  sub: string;
  state: StepStatus;
}

export function FunnelStrip({ stages, onOpen }: { stages: FunnelStage[]; onOpen: (n: number) => void }) {
  return (
    <ol className="funnel" data-testid="funnel" aria-label="Progress">
      {stages.map((s) => {
        const reachable = s.state !== "locked";
        return (
          <li key={s.n} className={`fn ${s.state}`} data-testid={`funnel-${s.n}`} data-state={s.state}>
            <button type="button" disabled={!reachable} onClick={() => onOpen(s.n)} aria-current={s.state === "current" ? "step" : undefined}>
              <span className="fn-label">
                {s.state === "done" ? "✓ " : ""}
                {s.label}
              </span>
              <span className="fn-value">{reachable ? s.value : "—"}</span>
              <span className="fn-sub">{reachable ? s.sub : "locked"}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
