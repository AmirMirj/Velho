import { useRef, useState } from "react";
import type { MeetingDraft } from "@/lib/demo/types.ts";

interface Props {
  draft: MeetingDraft;
  text: string;
  onText: (t: string) => void;
}

export function MeetingStep({ draft, text, onText }: Props) {
  const [msg, setMsg] = useState<string | null>(null);
  const ref = useRef<HTMLTextAreaElement>(null);
  const full = `Subject: ${draft.subject}\n\n${text}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(full);
      setMsg("Copied.");
    } catch {
      ref.current?.focus();
      ref.current?.select();
      setMsg("Clipboard unavailable — text selected, press Ctrl+C.");
    }
  }

  return (
    <>
      <p className="note">
        <span className="chip warn">{draft.label}</span>
        To <strong>{draft.addressee}</strong> · {draft.subject}
      </p>
      <textarea ref={ref} className="draft" rows={10} value={text} onChange={(e) => onText(e.target.value)} />
      <div className="actions">
        <button className="btn ghost" onClick={() => void copy()}>
          Copy draft
        </button>
        <span className="note">{msg ?? "Never sent — a person reviews and decides."}</span>
      </div>
    </>
  );
}
