import type { ReactNode } from "react";

export type StepStatus = "done" | "current" | "locked";

interface StepProps {
  n: number;
  title: string;
  status: StepStatus;
  expanded: boolean;
  summary?: string;
  onOpen?: () => void;
  spotlight?: boolean;
  children?: ReactNode;
}

export function Timeline({ children }: { children: ReactNode }) {
  return <ol className="tl">{children}</ol>;
}

export function TimelineStep({ n, title, status, expanded, summary, onOpen, spotlight, children }: StepProps) {
  const head = (
    <>
      <span className="tl-title">{title}</span>
      {!expanded && status === "done" && summary && <span className="tl-summary">{summary}</span>}
    </>
  );
  const clickable = status !== "locked" && !expanded && onOpen;
  return (
    <li className={`tl-step ${expanded ? "current" : status}${spotlight ? " spotlight" : ""}`} aria-current={expanded ? "step" : undefined}>
      <span className="tl-node" aria-hidden>
        {status === "done" && !expanded ? "✓" : n}
      </span>
      {clickable ? (
        <button type="button" className="tl-head" onClick={onOpen} aria-label={`Reopen step ${n}: ${title}`}>
          {head}
        </button>
      ) : (
        <div className="tl-head">{head}</div>
      )}
      {expanded && <div className="tl-body">{children}</div>}
    </li>
  );
}
