"use client";

import { useState } from "react";
import type { OutreachDraft } from "@/types/pack";

interface OutreachDraftsProps {
  drafts: OutreachDraft[];
}

export function OutreachDrafts({ drafts }: OutreachDraftsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  if (!drafts.length) {
    return (
      <div className="drafts empty">
        No outreach drafts in this pack.
      </div>
    );
  }

  async function copyText(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied("failed");
    }
  }

  return (
    <section className="drafts">
      <h2>Outreach drafts</h2>
      <p className="muted">
        Internal drafts for a COO / head of operations. Copy manually — this
        tool never sends messages.
      </p>
      <div className="draft-grid">
        {drafts.map((d) => {
          const key = `${d.channel}-${d.subject ?? "note"}`;
          const full =
            d.channel === "email"
              ? `Subject: ${d.subject ?? ""}\n\n${d.body}`
              : d.body;
          return (
            <article key={key} className="draft-card">
              <div className="draft-head">
                <span className="draft-badge">{d.draftLabel}</span>
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
                onClick={() => copyText(key, full)}
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
