"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { RawAssumptions } from "./BusinessCaseStep";
import type { StepStatus } from "./Timeline";
import { COMPANIES, findCompany } from "@/lib/demo/companies.ts";
import { computeBusinessCase } from "@/lib/demo/business-case.ts";
import { buildProofPlan, findDemoType } from "@/lib/demo/demonstrations.ts";
import { buildMeetingDraft } from "@/lib/demo/meeting.ts";
import { runConsolidation } from "@/lib/demo/consolidate.ts";
import { SAMPLE_REPORTS } from "@/lib/demo/sample-reports.ts";
import type { Assumptions, ConsolidationResult, DemoTypeId, MeetingDraft, ProofPlan, Signal } from "@/lib/demo/types.ts";

export const RUNNABLE: DemoTypeId = "report-consolidation";

function toRaw(a: Assumptions): RawAssumptions {
  return { hoursPerWeek: String(a.hoursPerWeek), automationPct: String(a.automationPct), costPerHour: String(a.costPerHour) };
}

/** All demo state + transitions. Manual UI, sticky next action and the guided tour share these. */
export function useDemoFlow() {
  const [companyId, setCompanyId] = useState(COMPANIES[0].id);
  const company = findCompany(companyId);
  const [signalId, setSignalId] = useState(company.signals[0].id);
  const signal: Signal = company.signals.find((s) => s.id === signalId) ?? company.signals[0];

  const [started, setStarted] = useState(false);
  const [investigated, setInvestigated] = useState(false);
  const [raw, setRaw] = useState<RawAssumptions>(toRaw(signal.defaults));
  const [demoId, setDemoId] = useState<DemoTypeId>(signal.recommendedDemo);
  const [plan, setPlan] = useState<ProofPlan | null>(null);
  const [planVersion, setPlanVersion] = useState(0);
  const [pasted, setPasted] = useState("");
  const [result, setResult] = useState<ConsolidationResult | null>(null);
  const [draft, setDraft] = useState<MeetingDraft | null>(null);
  const [draftText, setDraftText] = useState("");
  const [open, setOpen] = useState(1);
  const recapRef = useRef<HTMLElement | null>(null);

  const bc = useMemo(
    () => computeBusinessCase({ hoursPerWeek: raw.hoursPerWeek, automationPct: raw.automationPct, costPerHour: raw.costPerHour }),
    [raw]
  );

  // 1 Prospect · 2 Investigate · 3 Case · 4 Proof · 5 Meeting · 6 Recap
  const reached = draft ? 6 : plan ? 4 : investigated ? 3 : started ? 2 : 1;
  const status = (n: number): StepStatus => (n < reached ? "done" : n === reached ? "current" : "locked");

  const resetFor = useCallback((next: Signal) => {
    setOpen(1);
    setStarted(false);
    setInvestigated(false);
    setRaw(toRaw(next.defaults));
    setDemoId(next.recommendedDemo);
    setPlan(null);
    setResult(null);
    setPasted("");
    setDraft(null);
    setDraftText("");
  }, []);

  function selectCompany(id: string) {
    const c = findCompany(id);
    setCompanyId(c.id);
    setSignalId(c.signals[0].id);
    resetFor(c.signals[0]);
  }
  function selectSignal(id: string) {
    const s = company.signals.find((x) => x.id === id) ?? company.signals[0];
    setSignalId(s.id);
    resetFor(s);
  }
  function selectDemo(id: DemoTypeId) {
    setDemoId(id);
    setOpen(3);
    setPlan(null);
    setResult(null);
    setDraft(null);
    setDraftText("");
  }

  function investigate() {
    setStarted(true);
    setOpen(2);
  }
  function buildCase() {
    setStarted(true);
    setInvestigated(true);
    setOpen(3);
  }
  /** Returns the plan so chained tour actions can use it before React re-renders. */
  function generate(id: DemoTypeId = demoId): ProofPlan {
    const p = buildProofPlan(company, signal, id, bc);
    setStarted(true);
    setInvestigated(true);
    setDemoId(id);
    setPlan(p);
    setPlanVersion((v) => v + 1);
    setResult(null);
    setDraft(null);
    setDraftText("");
    setOpen(4);
    return p;
  }
  function run() {
    setResult(runConsolidation(SAMPLE_REPORTS, pasted));
    setOpen(4);
  }
  function prepare(id: DemoTypeId = demoId) {
    const d = buildMeetingDraft(company, signal, id, bc);
    setDraft(d);
    setDraftText(d.body);
    setOpen(5);
  }
  function showRecap() {
    setOpen(6);
    requestAnimationFrame(() => recapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  }
  function nextCompany() {
    const i = COMPANIES.findIndex((c) => c.id === company.id);
    selectCompany(COMPANIES[(i + 1) % COMPANIES.length].id);
  }
  function restart() {
    resetFor(signal);
  }

  return {
    company, signal, bc, raw, setRaw, demoId, demo: findDemoType(demoId), plan, planVersion,
    pasted, setPasted, result, draft, draftText, setDraftText, open, setOpen, reached, status, recapRef,
    selectCompany, selectSignal, selectDemo, investigate, buildCase, generate, run, prepare, showRecap,
    nextCompany, restart,
  };
}

export type DemoFlow = ReturnType<typeof useDemoFlow>;
