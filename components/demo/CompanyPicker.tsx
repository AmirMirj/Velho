import { COMPANIES } from "@/lib/demo/companies.ts";
import type { ExampleCompany, Signal } from "@/lib/demo/types.ts";

interface Props {
  company: ExampleCompany;
  signal: Signal;
  onCompany: (id: string) => void;
  onSignal: (id: string) => void;
}

export function CompanyPicker({ company, signal, onCompany, onSignal }: Props) {
  return (
    <>
      <div className="cards" role="group" aria-label="Choose a fictional company">
        {COMPANIES.map((c) => {
          const best = Math.max(...c.signals.map((s) => s.priority));
          const active = c.id === company.id;
          return (
            <button
              key={c.id}
              type="button"
              className={`co-card${active ? " active" : ""}`}
              aria-pressed={active}
              data-testid={`company-card-${c.id}`}
              onClick={() => onCompany(c.id)}
            >
              <span className="co-top">
                <span className="co-name">{c.name}</span>
                <span className={`co-score ${best >= 75 ? "hot" : best >= 60 ? "warm" : ""}`}>{best}</span>
              </span>
              <span className="co-meta">
                {c.industry} · {c.signals.length} signals <span className="chip">fictional</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="chips" role="group" aria-label="Choose a public signal">
        {company.signals.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`sig-chip${s.id === signal.id ? " active" : ""}`}
            aria-pressed={s.id === signal.id}
            data-testid={`signal-chip-${s.id}`}
            onClick={() => onSignal(s.id)}
          >
            <span className="chip info">{s.sourceType}</span>
            {s.title}
          </button>
        ))}
      </div>
    </>
  );
}
