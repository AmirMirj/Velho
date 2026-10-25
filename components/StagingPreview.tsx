"use client";

interface StagingPreviewProps {
  html: string | null;
}

export function StagingPreview({ html }: StagingPreviewProps) {
  if (!html) {
    return (
      <div className="staging empty">
        No staging preview for this leak.
      </div>
    );
  }

  return (
    <div className="staging">
      <h4>Staging preview</h4>
      <p className="staging-banner">
        Concept / draft fix — not deployed on the prospect’s systems. Session
        only.
      </p>
      <iframe
        title="Conceptual staging preview"
        className="staging-frame"
        sandbox=""
        srcDoc={html}
      />
    </div>
  );
}
