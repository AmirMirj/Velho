export type TourAction = "choose" | "investigate" | "case" | "proof" | "run" | "meeting" | "recap";

export interface TourStep {
  id: TourAction;
  title: string;
  text: string;
  /** Timeline step / funnel stage highlighted while this tour step is shown (6 = recap). */
  target: 1 | 2 | 3 | 4 | 5 | 6;
}

// Mergero-style guided demo: every "Next: do it" performs the step in the real UI.
export const TOUR: TourStep[] = [
  {
    id: "choose",
    title: "Spot a public signal",
    text: "We start from something observable — here, job ads that keep mentioning manual reporting.",
    target: 1,
  },
  {
    id: "investigate",
    title: "Separate fact from guess",
    text: "Observed evidence on the left, unverified assumptions on the right — we never blur the two.",
    target: 2,
  },
  {
    id: "case",
    title: "Put a number on it",
    text: "Hours per week × share automated × 52 × cost per hour. Every input is visible and editable.",
    target: 3,
  },
  {
    id: "proof",
    title: "Generate the proof plan",
    text: "Instead of a pitch, we design a small proof the company could check in one hour.",
    target: 4,
  },
  {
    id: "run",
    title: "Run the working prototype",
    text: "The consolidation prototype really merges three site reports into one KPI table and flags outliers.",
    target: 4,
  },
  {
    id: "meeting",
    title: "Earn the meeting",
    text: "A specific request to the COO cites the signal, the proof and the estimate. It is never sent.",
    target: 5,
  },
  {
    id: "recap",
    title: "From signal to meeting",
    text: "One signal became a quantified, proven reason to talk — in under two minutes.",
    target: 6,
  },
];
