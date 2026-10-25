"use client";

import "./demo.css";
import { useEffect, useRef, useState } from "react";
import { Timeline, TimelineStep } from "@/components/demo/Timeline";
import { ProspectStep } from "@/components/demo/ProspectStep";
import { InvestigationStep } from "@/components/demo/InvestigationStep";
import { BusinessCaseStep } from "@/components/demo/BusinessCaseStep";
import { ProofStep } from "@/components/demo/ProofStep";
import { MeetingStep } from "@/components/demo/MeetingStep";
import { FunnelStrip, type FunnelStage } from "@/components/demo/FunnelStrip";
import { ActionBar } from "@/components/demo/ActionBar";
import { CoachCard } from "@/components/demo/CoachCard";
import { Recap } from "@/components/demo/Recap";
import { TopBar } from "@/components/TopBar";
import { useDemoFlow } from "@/components/demo/useDemoFlow";
import { nextAction, performTour } from "@/components/demo/nextAction";
import { COMPANIES } from "@/lib/demo/companies.ts";
import { formatEur } from "@/lib/demo/business-case.ts";
import { TOUR } from "@/lib/demo/tour.ts";

function isTyping(el: Element | null): boolean {
  if (!el) return false;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName) || (el as HTMLElement).isContentEditable;
}

export default function DemoPage() {
  const f = useDemoFlow();
  const [tour, setTour] = useState<number | null>(null);
  const next = nextAction(f);

  function startTour() {
    f.selectCompany(COMPANIES[0].id);
    setTour(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function tourNext() {
    if (tour === null) return;
    performTour(f, TOUR[tour].id);
    setTour(tour + 1 < TOUR.length ? tour + 1 : null);
  }
  function tourBack() {
    if (tour === null || tour === 0) return;
    setTour(tour - 1);
    f.setOpen(TOUR[tour - 1].target);
  }
  // Manual prospect changes close the tour — the user is now driving (FR-003).
  const selectCompany = (id: string) => {
    setTour(null);
    f.selectCompany(id);
  };
  const selectSignal = (id: string) => {
    setTour(null);
    f.selectSignal(id);
  };

  const live = useRef({ tour, tourNext, next: next.run });
  live.current = { tour, tourNext, next: next.run };
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && live.current.tour !== null) {
        setTour(null);
        return;
      }
      if (e.key !== "ArrowRight" || e.altKey || e.ctrlKey || e.metaKey || isTyping(document.activeElement)) return;
      e.preventDefault();
      if (live.current.tour !== null) live.current.tourNext();
      else live.current.next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const { company, signal, bc, result, draft, plan } = f;
  const flagged = result?.rows.filter((r) => r.flagged).length ?? 0;
  const stages: FunnelStage[] = [
    { n: 1, label: "Signal", value: String(signal.priority), sub: "priority / 100", state: f.status(1) },
    { n: 2, label: "Evidence", value: `${signal.evidence.length} · ${signal.assumptions.length}`, sub: "facts · assumptions", state: f.status(2) },
    { n: 3, label: "Value", value: formatEur(bc.annual), sub: "per year · estimate", state: f.status(3) },
    {
      n: 4,
      label: "Proof",
      value: result ? `${result.rows.length} KPIs` : plan ? "Plan" : "—",
      sub: result ? `${flagged} flagged · ${result.units.length} reports` : plan?.runnable ? "ready to run" : "plan only",
      state: f.status(4),
    },
    { n: 5, label: "Meeting", value: draft ? "Draft" : "—", sub: draft ? "ready · never sent" : "to COO", state: f.status(5) },
  ];
  const tourTarget = tour !== null ? TOUR[tour].target : null;
  const step = (n: number) => ({
    n,
    status: f.status(n),
    expanded: f.open === n && n <= f.reached,
    onOpen: () => f.setOpen(n),
    spotlight: tourTarget === n,
  });

  return (
    <>
      <TopBar current="demo" />
      <main className="shell demo">
        <header className="demo-head">
          <div>
            <p className="eyebrow">Interactive demo · fictional data · never sends</p>
            <h1>Turn a business signal into a reason to meet.</h1>
          </div>
        </header>

        <FunnelStrip stages={stages} onOpen={(n) => f.setOpen(n)} />

        <Timeline>
          <TimelineStep {...step(1)} title="Prospect" summary={`${company.name} · ${signal.title}`}>
            <ProspectStep company={company} signal={signal} onCompany={selectCompany} onSignal={selectSignal} />
          </TimelineStep>
          <TimelineStep {...step(2)} title="Investigate" summary={signal.hypothesis}>
            <InvestigationStep signal={signal} />
          </TimelineStep>
          <TimelineStep {...step(3)} title="Business case" summary={`${formatEur(bc.annual)} / yr · ${bc.hoursPerYear.toLocaleString("en-US")} h released`}>
            <BusinessCaseStep
              raw={f.raw}
              bc={bc}
              onRaw={(k, v) => f.setRaw((r) => ({ ...r, [k]: v }))}
              demoId={f.demoId}
              recommendedDemo={signal.recommendedDemo}
              onDemo={f.selectDemo}
            />
          </TimelineStep>
          <TimelineStep {...step(4)} title="Proof" summary={result ? `${f.demo.name} · ${result.rows.length} KPIs merged` : f.demo.name}>
            {plan && (
              <ProofStep key={f.planVersion} plan={plan} pasted={f.pasted} onPasted={f.setPasted} result={result} onRun={f.run} />
            )}
          </TimelineStep>
          <TimelineStep {...step(5)} title="Meeting" summary={draft ? `To ${draft.addressee} · never sent` : undefined}>
            {draft && <MeetingStep draft={draft} text={f.draftText} onText={f.setDraftText} />}
          </TimelineStep>
        </Timeline>

        {draft && (
          <div ref={(el) => { f.recapRef.current = el; }} className={tourTarget === 6 ? "spotlight" : undefined}>
            <Recap
              company={company}
              signal={signal}
              bc={bc}
              demoName={f.demo.name}
              result={result}
              draft={draft}
              onAgain={() => {
                setTour(null);
                f.restart();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onOther={() => {
                setTour(null);
                f.nextCompany();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        )}

        <p className="foot">ProofPulse · evidence ≠ assumption · a person decides before any outreach</p>
      </main>

      <ActionBar label={next.label} hint={next.hint} onNext={next.run} onTour={startTour} tourOpen={tour !== null} />
      {tour !== null && <CoachCard index={tour} onNext={tourNext} onBack={tourBack} onExit={() => setTour(null)} />}
    </>
  );
}
