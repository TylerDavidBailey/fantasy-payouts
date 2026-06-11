import { useState } from "react";

type NumberFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  prefix?: string;
  onCommit: (value: number) => void;
};

/**
 * Number input that lets the user type freely while focused, commits every
 * parseable value as they type, and snaps back to the sanitized value on blur.
 */
function NumberField({ label, value, min, max, prefix, onCommit }: NumberFieldProps): JSX.Element {
  const [draft, setDraft] = useState<string | null>(null);

  function handleChange(rawValue: string): void {
    setDraft(rawValue);

    if (rawValue.trim() === "") {
      return;
    }

    const parsed = Number(rawValue);

    if (Number.isFinite(parsed)) {
      onCommit(parsed);
    }
  }

  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <div className="field-input">
        {prefix === undefined ? null : <span className="field-prefix">{prefix}</span>}
        <input
          type="number"
          min={String(min)}
          max={String(max)}
          value={draft ?? String(value)}
          onFocus={() => setDraft(String(value))}
          onChange={(event) => handleChange(event.target.value)}
          onBlur={() => setDraft(null)}
        />
      </div>
    </label>
  );
}

export default NumberField;
