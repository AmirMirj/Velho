"use client";

interface CompanyInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  submitLabel?: string;
}

export function CompanyInput({
  value,
  onChange,
  onSubmit,
  disabled,
  submitLabel = "Build proof pack",
}: CompanyInputProps) {
  return (
    <form
      className="company-input"
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled && value.trim()) onSubmit();
      }}
    >
      <label htmlFor="company-input" className="label">
        Company domain or name
      </label>
      <div className="row">
        <input
          id="company-input"
          type="text"
          placeholder="e.g. kone.com or KONE"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" disabled={disabled || !value.trim()}>
          {disabled ? "Auditing…" : submitLabel}
        </button>
      </div>
      <p className="hint">
        Public UX/ops data only — not a security scan. Session-only. Drafts are
        never sent.
      </p>
    </form>
  );
}
