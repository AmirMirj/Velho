"use client";

import { useState } from "react";
import type { OutreachDraft, ReviewStatus } from "@/types/proofpulse";

interface Props {
  drafts: OutreachDraft[];
  review: ReviewStatus;
  onReview: (status: ReviewStatus) => void;
}

export function OutreachReview({ drafts, review, onReview }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  if (!drafts.length) return null;

  return (
    <section className="drafts">
      <h2>Message Draft</h2>
      <p className="muted">
        Read this before deciding. These buttons only save your choice here;
        they do not send or share anything.
      </p>
      <p className="decision-help">
        Choose “Looks good” to keep going, “Check more” if something is missing,
        or “Not a fit” to stop.
      </p>
      <div className="row decision-actions">
        <button
          type="button"
          className="copy decision-approve"
          onClick={() => onReview("approved")}
        >
          Looks good
        </button>
        <button
          type="button"
          className="copy decision-investigate"
          onClick={() => onReview("investigate")}
        >
          Check more
        </button>
        <button
          type="button"
          className="copy decision-reject"
          onClick={() => onReview("rejected")}
        >
          Not a fit
        </button>
        {review !== "pending" && (
          <button
            type="button"
            className="quiet-action"
            onClick={() => onReview("pending")}
          >
            Undo choice
          </button>
        )}
      </div>
      <div className="draft-grid">
        {drafts.map((d) => {
          const key = d.channel;
          const full =
            d.channel === "email"
              ? `Subject: ${d.subject ?? ""}\n\n${d.body}`
              : d.body;
          return (
            <article key={key} className="draft-card">
              <div className="draft-head">
                <span className="draft-badge">{d.draftLabel}</span>
                {d.lowConfidence && (
                  <span className="draft-badge">low confidence / investigate</span>
                )}
                <span className="channel">{d.channel}</span>
              </div>
              <p className="addressee">To: {d.addresseeRole}</p>
              {d.subject && (
                <p className="subject">
                  <strong>Subject:</strong> {d.subject}
                </p>
              )}
              <pre className="body">{d.body}</pre>
              <button
                type="button"
                className="copy"
                onClick={async () => {
                  await navigator.clipboard.writeText(full);
                  setCopied(key);
                  setTimeout(() => setCopied(null), 1500);
                }}
              >
                {copied === key ? "Copied" : "Copy draft"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
