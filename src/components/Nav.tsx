import { useEffect, useState } from 'react';
import { List, Phone, X } from '@phosphor-icons/react';
import { business } from '../config/business';
import { Wordmark } from './ui';

export const navLinks = [
  { href: '#showroom', label: 'Fleet' },
  { href: '#for-sale', label: 'For sale' },
  { href: '#airport', label: 'Airport delivery' },
  { href: '#about', label: 'About' },
  { href: '#visit', label: 'Contact' },
];

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById('top-sentinel');
    if (!sentinel || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting), { rootMargin: '80px 0px 0px 0px' });
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const main = business.phones[0];

  return (
    <header
      className={`site-nav gutter fixed inset-x-0 z-[var(--z-nav)] transition-colors duration-300 ${
        solid || open ? 'bg-ink/88 backdrop-blur-xl border-b border-line' : 'bg-transparent border-b border-transparent'
      }`}
      style={{ top: 'env(safe-area-inset-top, 0px)' }}
    >
      <nav aria-label="Main" className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-6">
        <a href="#top" className="hit shrink-0" aria-label="OJ's Auto Sales and Rental, back to top">
          <Wordmark />
        </a>
        <ul className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="whitespace-nowrap rounded-[6px] px-2.5 py-2 text-[14px] text-paper/80 transition-colors hover:text-paper xl:px-3">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a href={`tel:${main.e164}`} className="btn btn-ghost hidden min-h-[40px] text-[12.5px] md:inline-flex lg:hidden xl:inline-flex tabular">
            <Phone size={16} weight="bold" aria-hidden />
            {main.display}
          </a>
          <a href="#search" className="btn btn-primary hidden min-h-[40px] px-4 text-[12.5px] sm:inline-flex">
            Reserve your ride
          </a>
          <button
            type="button"
            className="btn btn-ghost min-h-[44px] px-2.5 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={24} /> : <List size={24} />}
          </button>
        </div>
      </nav>
      {open && (
        <div id="mobile-menu" className="gutter fixed inset-x-0 bottom-0 top-[68px] z-[var(--z-nav)] overflow-y-auto bg-ink pb-10 lg:hidden">
          <ul className="flex flex-col pt-4">
            {navLinks.map((l) => (
              <li key={l.href} className="border-b border-line">
                <a href={l.href} onClick={() => setOpen(false)} className="display-tight block py-5 text-[28px]">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            <a href="#search" onClick={() => setOpen(false)} className="btn btn-primary w-full">
              Reserve your ride
            </a>
            {business.phones.map((p) => (
              <a key={p.e164} href={`tel:${p.e164}`} className="btn btn-secondary w-full tabular">
                <Phone size={16} weight="bold" aria-hidden /> {p.display}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
