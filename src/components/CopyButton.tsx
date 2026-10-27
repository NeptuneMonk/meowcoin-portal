import { useState } from 'react';

export function CopyButton({
  value,
  label,
  display,
}: {
  value: string;
  label: string;
  display: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="hash"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          setCopied(false);
        }
      }}
      aria-label={
        copied ? `${label} copied` : `${label} ${value}. Copy this simulated value.`
      }
    >
      <span>{label}</span>
      <code>{copied ? 'Copied' : display}</code>
    </button>
  );
}
