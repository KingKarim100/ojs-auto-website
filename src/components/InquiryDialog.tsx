import { useEffect, useRef, useState } from 'react';
import { ChatCircleText, EnvelopeSimple, Phone, X } from '@phosphor-icons/react';
import { business } from '../config/business';
import { buildMessage, channelsFor } from '../lib/inquiry';
import { closeInquiry, useUI } from '../lib/store';
import { CopyButton } from './ui';

/**
 * Inquiry hand-off. Phase 1 has no booking backend, so this prepares the message and lets the
 * visitor send it through a confirmed channel (email or phone; WhatsApp once the number is set).
 */
export function InquiryDialog() {
  const { open, payload, title } = useUI((s) => s.inquiry);
  const panel = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!open || !payload) return;
    setText(buildMessage(payload).body);
    lastFocus.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>('textarea')?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeInquiry();
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),textarea,input,select');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      lastFocus.current?.focus?.();
    };
  }, [open, payload]);

  if (!open || !payload) return null;
  const { subject } = buildMessage(payload);
  const ch = channelsFor(payload);
  const mailto = `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  const wa = ch.whatsapp && business.whatsapp ? `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}` : null;

  return (
    <div className="fixed inset-0 z-[var(--z-dialog)] flex items-end justify-center bg-black/65 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && closeInquiry()}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inq-title"
        className="dialog-in max-h-[92dvh] w-full max-w-[560px] overflow-y-auto rounded-t-[6px] border border-line bg-ink-2 p-6 sm:rounded-[6px] md:p-8"
        style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="inq-title" className="display-tight text-[clamp(1.4rem,3vw,1.9rem)]">
            {title}
          </h2>
          <button type="button" className="btn btn-ghost -mr-2 -mt-1 min-h-[40px] px-2" aria-label="Close" onClick={closeInquiry}>
            <X size={20} aria-hidden />
          </button>
        </div>
        <p className="mt-2 text-[14px] text-paper/75">
          This is an inquiry, not a booking. OJ&rsquo;s replies to confirm availability, price and any delivery fee.
        </p>
        <label className="field mt-5" htmlFor="inq-text">
          <span>Your message (edit it if you like)</span>
          <textarea id="inq-text" rows={5} className="input min-h-[132px] py-3 leading-relaxed" value={text} onChange={(e) => setText(e.target.value)} />
        </label>
        <div className="mt-1 flex justify-end">
          <CopyButton text={text} label="Copy message" />
        </div>
        <div className="mt-4 grid gap-2.5">
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <ChatCircleText size={18} weight="bold" aria-hidden /> Send on WhatsApp
            </a>
          )}
          <a href={mailto} className={`btn ${wa ? 'btn-secondary' : 'btn-primary'}`}>
            <EnvelopeSimple size={18} weight="bold" aria-hidden /> Email this to OJ&rsquo;s
          </a>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {ch.tel.map((t) => (
              <a key={t.href} href={t.href} className="btn btn-secondary tabular">
                <Phone size={16} weight="bold" aria-hidden /> {t.display}
              </a>
            ))}
          </div>
        </div>
        <p className="mt-5 text-[12.5px] text-muted">
          Email: <span className="select-all text-paper/85">{business.email}</span>. Please don&rsquo;t include card or ID
          details in your message.
        </p>
      </div>
    </div>
  );
}
