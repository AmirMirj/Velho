"use client";

import { useEffect, useMemo, useState } from "react";
import { OpportunityFeed } from "@/components/OpportunityFeed";
import { InvestigationPanel } from "@/components/InvestigationPanel";
import { ProofRunner } from "@/components/ProofRunner";
import { BusinessCasePanel } from "@/components/BusinessCasePanel";
import { CeoGateBadge } from "@/components/CeoGateBadge";
import { OutreachReview } from "@/components/OutreachReview";
import { TopBar } from "@/components/TopBar";
import { DEFAULT_ASSUMPTIONS } from "@/lib/business-case";
import { runCeoAttentionTest } from "@/lib/ceo-gate";
import { buildDrafts } from "@/lib/drafts";
import type {
  BusinessCaseAssumptions,
  CeoGateResult,
  Demonstration,
  FeedEntry,
  InvestigationResult,
  OutreachDraft,
  ReviewStatus,
  SeedRecord,
} from "@/types/proofpulse";

type Active =
  | InvestigationResult
  | (SeedRecord & { gaps?: string[]; warnings?: string[]; drafts?: OutreachDraft[]; publicDocTexts?: { name: string; text: string }[] });

export default function HomePage() {
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [seedMap, setSeedMap] = useState<Record<string, SeedRecord>>({});
  const [liveMap, setLiveMap] = useState<Record<string, InvestigationResult>>({});
  const [active, setActive] = useState<Active | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [proofBusy, setProofBusy] = useState(false);
  const [demo, setDemo] = useState<Demonstration | null>(null);
  const [assumptions, setAssumptions] =
    useState<BusinessCaseAssumptions>(DEFAULT_ASSUMPTIONS);
  const [drafts, setDrafts] = useState<OutreachDraft[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<ReviewStatus>("pending");

  useEffect(() => {
    (async () => {
      const [feedRes, seedRes] = await Promise.all([
        fetch("/api/opportunities"),
        fetch("/api/opportunities/seed"),
      ]);
      const feed = await feedRes.json();
      const seed = await seedRes.json();
      setEntries(feed.entries || []);
      const map: Record<string, SeedRecord> = {};
      for (const r of seed.records || []) map[r.company.id] = r;
      setSeedMap(map);
    })().catch((e) => setError(String(e)));
  }, []);

  function selectFeed(id: string) {
    setSelectedId(id);
    setDemo(null);
    setReview("pending");
    setError(null);
    const entry = entries.find((e) => e.opportunityId === id);
    if (!entry) return;
    const live = liveMap[entry.opportunityId] || liveMap[entry.companyId];
    if (live) {
      setActive(live);
      setDrafts(live.drafts);
      return;
    }
    const rec = seedMap[entry.companyId];
    if (rec) {
      setActive(rec);
      setDrafts(
        buildDrafts(
          rec.company,
          rec.opportunity,
          rec.opportunity.confidence === "low"
        )
      );
    }
  }

  function startOver() {
    setSelectedId(null);
    setActive(null);
    setDemo(null);
    setAssumptions(DEFAULT_ASSUMPTIONS);
    setDrafts([]);
    setReview("pending");
    setError(null);
  }

  async function investigate() {
    if (!input.trim()) return;
    setBusy(true);
    setError(null);
    setDemo(null);
    try {
      const res = await fetch("/api/opportunities/investigate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Investigate failed");
        return;
      }
      const result = data as InvestigationResult;
      setActive(result);
      setDrafts(result.drafts);
      setSelectedId(result.opportunity.id);
      setLiveMap((m) => ({
        ...m,
        [result.opportunity.id]: result,
        [result.company.id]: result,
      }));
      setEntries((prev) => {
        const feedEntry: FeedEntry = {
          opportunityId: result.opportunity.id,
          companyId: result.company.id,
          companyName: result.company.name,
          domain: result.company.domain,
          industryHint: result.company.industryHint,
          hypothesis: result.opportunity.hypothesis,
          score: result.opportunity.score,
          confidence: result.opportunity.confidence,
          evidenceStrength: result.opportunity.evidenceStrength,
          estimatedAnnualValueEur: result.opportunity.estimatedAnnualValueEur,
          recommendedAction: result.opportunity.recommendedAction,
          signals: result.signals.map((s) => ({
            id: s.id,
            sourceType: s.sourceType,
            summary: s.summary,
            sourceUrl: s.sourceUrl,
          })),
        };
        const without = prev.filter((e) => e.companyId !== result.company.id);
        return [feedEntry, ...without].sort((a, b) => b.score - a.score);
      });
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function runProof() {
    if (!active) return;
    setProofBusy(true);
    setError(null);
    try {
      const publicDocTexts =
        "publicDocTexts" in active ? active.publicDocTexts || [] : [];
      const res = await fetch("/api/proofs/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          companyName: active.company.name,
          opportunityId: active.opportunity.id,
          publicDocTexts,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Proof failed");
        return;
      }
      setDemo(data as Demonstration);
    } catch (e) {
      setError(String(e));
    } finally {
      setProofBusy(false);
    }
  }

  const gate: CeoGateResult | null = useMemo(() => {
    if (!active) return null;
    return runCeoAttentionTest({
      opportunity: active.opportunity,
      evidence: active.evidence,
      demonstration: demo,
      hasAssumptions: true,
      draftSpecific: Boolean(active.company.name && active.opportunity.hypothesis),
    });
  }, [active, demo]);

  useEffect(() => {
    if (!active || !gate) return;
    setDrafts(
      buildDrafts(active.company, active.opportunity, !gate.passed)
    );
  }, [gate?.passed, active?.opportunity.id]);

  return (
    <>
    <TopBar current="workspace" />
    <main className="shell">
      <header className="hero">
        <p className="eyebrow">
          Velho · public clues, clear choices
        </p>
        <h1>Don&apos;t pitch. Show what they could fix.</h1>
        <p className="lede">
          Choose a company, check what we know, and decide if it is worth a
          closer look. Any message stays a draft until a person chooses what
          to do.
        </p>
        <a href="/demo">New here? Play the guided demo →</a>
      </header>

      <section className="workflow" aria-label="Opportunity workflow">
        <section className="workflow-step discovery-step">
          <div className="workflow-step-heading">
            <span className="step-number">01</span>
            <div>
              <h2>Choose a Company</h2>
              <p>Pick one from the list, or search by name or website.</p>
            </div>
            {active && (
              <button type="button" className="quiet-action" onClick={startOver}>
                Start over
              </button>
            )}
          </div>

          <form
            className="company-input"
            onSubmit={(e) => {
              e.preventDefault();
              void investigate();
            }}
          >
            <label htmlFor="inv" className="label">
              Company name or website
            </label>
            <div className="row">
              <input
                id="inv"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. kone.com or Nokia"
                disabled={busy}
              />
              <button type="submit" disabled={busy || !input.trim()}>
                {busy ? "Investigating…" : "Investigate Company"}
              </button>
            </div>
            <p className="hint">
              We look at public information. Your results stay in this browser session.
            </p>
          </form>

          {error && (
            <div className="pack-status error" role="alert">
              {error}
            </div>
          )}

          <OpportunityFeed
            entries={entries}
            selectedId={selectedId}
            onSelect={selectFeed}
          />
        </section>

      {active && (
        <div className="workflow-steps">
          <details className="workflow-step workflow-step-primary" open>
            <summary className="workflow-step-heading">
              <span className="step-number">02</span>
              <span className="step-heading-copy">
                <span className="step-title">Check the Clues</span>
                <span className="step-description">Start here: see what we found and what still needs checking.</span>
              </span>
              <span className="step-status complete">Ready</span>
            </summary>
            <InvestigationPanel data={active} />
          </details>

          <details className="workflow-step">
            <summary className="workflow-step-heading">
              <span className="step-number">03</span>
              <span className="step-heading-copy">
                <span className="step-title">Estimate the Value</span>
                <span className="step-description">Change the guesses below; the estimate updates right away.</span>
              </span>
              <span className="step-status optional">If useful</span>
            </summary>
            <BusinessCasePanel assumptions={assumptions} onChange={setAssumptions} />
          </details>

          <details className="workflow-step">
            <summary className="workflow-step-heading">
              <span className="step-number">04</span>
              <span className="step-heading-copy">
                <span className="step-title">Try a Small Test</span>
                <span className="step-description">See how sample reports can be combined. No company files are changed.</span>
              </span>
              <span className={`step-status${demo ? " complete" : " optional"}`}>
                {demo ? "Test complete" : "If useful"}
              </span>
            </summary>
            <ProofRunner demo={demo} running={proofBusy} onRun={() => void runProof()} />
          </details>

          <details className="workflow-step">
            <summary className="workflow-step-heading">
              <span className="step-number">05</span>
              <span className="step-heading-copy">
                <span className="step-title">Choose What to Do</span>
                <span className="step-description">Read the draft and choose whether to keep going. Nothing is sent.</span>
              </span>
              <span
                className={`step-status${
                  review === "approved"
                    ? " complete"
                    : review === "rejected"
                      ? " error"
                      : review === "investigate"
                        ? " attention"
                        : ""
                }`}
              >
                {review === "pending"
                  ? "Your choice"
                  : review === "approved"
                    ? "Looks good"
                    : review === "rejected"
                      ? "Not a fit"
                      : "Check more"}
              </span>
            </summary>
            <CeoGateBadge gate={gate} />
            <OutreachReview
              drafts={drafts}
              onReview={(s) => setReview(s)}
              review={review}
            />
          </details>
        </div>
      )}

      <footer className="foot">
        Public clues are not proof · Nothing is sent automatically
      </footer>
      </section>
    </main>
    </>
  );
}
