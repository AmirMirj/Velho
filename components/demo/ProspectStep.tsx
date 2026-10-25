import { CompanyPicker } from "./CompanyPicker";
import { PriorityBreakdown } from "./PriorityBreakdown";
import type { ExampleCompany, Signal } from "@/lib/demo/types.ts";

interface Props {
  company: ExampleCompany;
  signal: Signal;
  onCompany: (id: string) => void;
  onSignal: (id: string) => void;
}

export function ProspectStep({ company, signal, onCompany, onSignal }: Props) {
  return (
    <>
      <CompanyPicker company={company} signal={signal} onCompany={onCompany} onSignal={onSignal} />
      <PriorityBreakdown signal={signal} />
      <p className="note caution">⚠ {signal.caution}</p>
    </>
  );
}
