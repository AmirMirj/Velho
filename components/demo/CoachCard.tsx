import { TOUR } from "@/lib/demo/tour.ts";

interface Props {
  index: number;
  onNext: () => void;
  onBack: () => void;
  onExit: () => void;
}

export function CoachCard({ index, onNext, onBack, onExit }: Props) {
  const step = TOUR[index];
  const last = index === TOUR.length - 1;
  return (
    <aside className="coach" data-testid="coach" role="dialog" aria-modal="false" aria-labelledby="coach-title">
      <div className="coach-top">
        <span className="coach-eyebrow">
          Guided demo · {index + 1} of {TOUR.length}
        </span>
        <button type="button" className="coach-x" data-testid="coach-exit" onClick={onExit} aria-label="Exit guided demo (Esc)">
          ✕
        </button>
      </div>
      <div className="coach-progress" aria-hidden>
        {TOUR.map((t, i) => (
          <span key={t.id} className={i <= index ? "on" : ""} />
        ))}
      </div>
      <h2 id="coach-title">{step.title}</h2>
      <p>{step.text}</p>
      <div className="coach-actions">
        {index > 0 && (
          <button type="button" className="btn ghost" data-testid="coach-back" onClick={onBack}>
            Back
          </button>
        )}
        <button type="button" className="btn primary" data-testid="coach-next" onClick={onNext} autoFocus>
          {last ? "Finish" : "Next: do it →"}
        </button>
      </div>
    </aside>
  );
}
