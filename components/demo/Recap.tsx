import { formatEur, formulaLine } from "@/lib/demo/business-case.ts";
import type { BusinessCase, ConsolidationResult, ExampleCompany, MeetingDraft, Signal } from "@/lib/demo/types.ts";

interface Props {
  company: ExampleCompany;
  signal: Signal;
  bc: BusinessCase;
  demoName: string;
  result: ConsolidationResult | null;
  draft: MeetingDraft;
  onAgain: () => void;
  onOther: () => void;
}

export function Recap({ company, signal, bc, demoName, result, draft, onAgain, onOther }: Props) {
  const flagged = result?.rows.filter((r) => r.flagged).length ?? 0;
  return (
    <section className="recap" data-testid="recap" aria-labelledby="recap-title">
      <p className="eyebrow">Recap</p>
      <h2 id="recap-title">From signal to meeting</h2>
      <dl className="recap-grid">
        <div>
          <dt>Company</dt>
          <dd>{company.name}</dd>
        </div>
        <div>
          <dt>Signal</dt>
          <dd>{signal.title}</dd>
        </div>
        <div className="big">
          <dt>Potential value</dt>
          <dd>
            {formatEur(bc.annual)} <small>/ yr</small>
          </dd>
          <dd className="formula">{formulaLine(bc)}</dd>
        </div>
        <div>
          <dt>Proof</dt>
          <dd>
            {result
              ? `${demoName}: ${result.rows.length} KPIs merged from ${result.units.length} reports, ${flagged} flagged`
              : `${demoName}: plan ready`}
          </dd>
        </div>
        <div>
          <dt>Meeting</dt>
          <dd>
            Draft to {draft.addressee} ready — <span className="warn-text">never sent</span>
          </dd>
        </div>
      </dl>
      <div className="actions">
        <button type="button" className="btn ghost" data-testid="recap-again" onClick={onAgain}>
          ↺ Run again
        </button>
        <button type="button" className="btn primary" data-testid="recap-other" onClick={onOther}>
          Try another company →
        </button>
      </div>
    </section>
  );
}
