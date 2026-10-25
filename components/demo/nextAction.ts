import type { DemoFlow } from "./useDemoFlow";
import { RUNNABLE } from "./useDemoFlow";
import type { TourAction } from "@/lib/demo/tour.ts";

export interface NextAction {
  label: string;
  hint: string;
  run: () => void;
}

/** Exactly one primary next action for every state (FR-007, SC-005). */
export function nextAction(f: DemoFlow): NextAction {
  if (f.reached === 1) return { label: "Investigate →", hint: "Pick a company and a signal.", run: f.investigate };
  if (f.reached === 2) return { label: "Build business case →", hint: "Facts on the left, guesses on the right.", run: f.buildCase };
  if (f.reached === 3) return { label: "Generate proof →", hint: "Tune the inputs — value updates live.", run: () => f.generate() };
  if (f.reached === 4 && f.plan?.runnable && !f.result)
    return { label: "Run prototype ▶", hint: "Merge three site reports into one KPI table.", run: f.run };
  if (f.reached === 4) return { label: "Prepare meeting request →", hint: "Turn the proof into a specific ask.", run: () => f.prepare() };
  if (f.open !== 6) return { label: "See recap →", hint: "Edit or copy the draft — it is never sent.", run: f.showRecap };
  return { label: "Try another company →", hint: "Done — replay or switch company.", run: f.nextCompany };
}

/** Guided tour: each "Next: do it" performs the real action through the same transitions (FR-002). */
export function performTour(f: DemoFlow, action: TourAction) {
  switch (action) {
    case "choose":
      return f.investigate();
    case "investigate":
      return f.buildCase();
    case "case":
      // Tour always shows the runnable prototype (edge case in spec).
      f.generate(RUNNABLE);
      return;
    case "proof":
      if (!f.plan?.runnable) f.generate(RUNNABLE);
      return f.run();
    case "run":
      return f.prepare(f.plan ? f.demoId : RUNNABLE);
    case "meeting":
      return f.showRecap();
    case "recap":
      return;
  }
}
