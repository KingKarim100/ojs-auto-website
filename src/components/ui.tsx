import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, Copy, InstagramLogo } from '@phosphor-icons/react';

/** Text wordmark placeholder. Sized to the same box the real OJ's logo will occupy (about 112 x 32). */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 leading-none ${className}`} aria-label="OJ's Auto Sales and Rental">
      <span className="display text-[26px] tracking-[-0.02em]" style={{ fontStretch: '125%' }}>
        OJ<span className="text-red">&rsquo;</span>S
      </span>
      <span className="font-mono text-[9.5px] uppercase leading-[1.15] tracking-[0.14em] text-muted">
        Auto Sales
        <br />
        &amp; Rental
      </span>
    </span>
  );
}

/** Small honest label for where a photo came from. */
export function SourceBadge({ children }: { children: ReactNode }) {
  return (
    <span className="badge-demo">
      <InstagramLogo size={13} aria-hidden />
      {children}
    </span>
  );
}

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  const t = useRef<number>(0);
  useEffect(() => () => window.clearTimeout(t.current), []);
  return (
    <button
      type="button"
      className="btn btn-ghost min-h-[36px] px-2.5 text-[11.5px]"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          window.clearTimeout(t.current);
          t.current = window.setTimeout(() => setDone(false), 1600);
        } catch {
          setDone(false);
        }
      }}
      aria-label={`${label}: ${text}`}
    >
      {done ? <Check size={15} weight="bold" /> : <Copy size={15} />}
      <span aria-live="polite">{done ? 'Copied' : label}</span>
    </button>
  );
}
