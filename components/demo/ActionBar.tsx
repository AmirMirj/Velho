interface Props {
  label: string;
  hint: string;
  onNext: () => void;
  onTour: () => void;
  tourOpen: boolean;
}

export function ActionBar({ label, hint, onNext, onTour, tourOpen }: Props) {
  return (
    <div className="action-bar" role="region" aria-label="Next action">
      <div className="ab-inner">
        <button type="button" className="btn ghost" data-testid="play-tour" onClick={onTour} disabled={tourOpen}>
          ▶ Play guided demo
        </button>
        <span className="ab-hint">{hint}</span>
        <button type="button" className="btn primary" data-testid="next-action" onClick={onNext}>
          {label}
        </button>
        <kbd className="ab-kbd" title="Keyboard shortcut">→</kbd>
      </div>
    </div>
  );
}
