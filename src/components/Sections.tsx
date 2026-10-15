import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ChatCircleText,
  Clock,
  EnvelopeSimple,
  FacebookLogo,
  InstagramLogo,
  MapPin,
  Phone,
} from '@phosphor-icons/react';
import { business, mapsEmbedUrl, mapsUrl } from '../config/business';
import { getVehicles, priceLabel, vehicleName } from '../lib/vehicles';
import { openInquiry } from '../lib/store';
import { testimonials } from '../data/testimonials';
import { CopyButton, Wordmark } from './ui';
import { navLinks } from './Nav';
import { askToBuy } from './Showroom';

/* ---------------------------------------------------------------- for sale */

export function ForSale() {
  const list = getVehicles({ listing: 'sale' });
  return (
    <section id="for-sale" aria-labelledby="sale-title" className="relative border-t border-line bg-ink">
      <div className="gutter mx-auto max-w-[1440px] py-[clamp(80px,11vw,150px)]">
        <h2 id="sale-title" className="display text-[clamp(2.3rem,5.6vw,5.4rem)]">
          Find your next vehicle.
        </h2>
        <p className="mt-5 max-w-[56ch] text-[17px] text-paper/80">
          Every car OJ&rsquo;s rents can also be bought. These are vehicles OJ&rsquo;s has posted for sale. Call or email to hear what
          is on the lot today and to book a viewing.
        </p>
        {list.length > 0 && (
          <ul className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 no-scrollbar lg:grid lg:grid-cols-4 lg:overflow-visible">
            {list.map((v) => {
              const img = v.images[0];
              return (
                <li key={v.id} className="w-[min(340px,82vw)] shrink-0 snap-start lg:w-auto overflow-hidden rounded-[6px] border border-line bg-ink-2">
                  <div className="relative aspect-[4/3]">
                    {img && <img src={img.src} alt={`${v.colour} ${v.make} ${v.model}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
                  </div>
                  <div className="grid gap-4 p-5">
                    <div>
                      <h3 className="display-tight text-[24px]">{vehicleName(v)}</h3>
                      <p className="mt-1 text-[14px] text-muted">
                        {v.colour}, {v.transmission.toLowerCase()}, {v.seats} seats
                      </p>
                    </div>
                    <dl className="grid grid-cols-2 gap-3 text-[14px]">
                      <div>
                        <dt className="label">Price</dt>
                        <dd className="mt-1 font-medium">{priceLabel(v)}</dd>
                      </div>
                      <div>
                        <dt className="label">Year</dt>
                        <dd className="mt-1 font-medium">{v.year ?? 'Ask OJ\u2019s'}</dd>
                      </div>
                    </dl>
                    <div className="flex flex-wrap gap-2.5">
                      <button type="button" className="btn btn-primary" onClick={() => askToBuy(v)}>
                        Ask to buy
                      </button>
                      <a href={`#fleet-${v.id}`} className="btn btn-secondary">
                        Details
                      </a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <div className="mt-8 grid gap-6 rounded-[6px] border border-line p-6 md:grid-cols-[1.2fr_1fr] md:items-center md:p-8">
          <div>
            <h3 className="display-tight text-[clamp(1.5rem,2.4vw,2rem)]">Looking for something specific?</h3>
            <p className="mt-2 max-w-[52ch] text-[15.5px] leading-relaxed text-paper/80">
              Tell OJ&rsquo;s the make, budget or size you have in mind. Viewings at 27 The Queens Drive.
            </p>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {business.phones.map((p) => (
              <a key={p.e164} href={`tel:${p.e164}`} className="btn btn-secondary tabular">
                <Phone size={16} weight="bold" aria-hidden /> {p.display}
              </a>
            ))}
            <a href={`mailto:${business.email}?subject=${encodeURIComponent('Buying a vehicle')}`} className="btn btn-secondary normal-case tracking-normal sm:col-span-2">
              <EnvelopeSimple size={16} weight="bold" aria-hidden /> {business.email}
            </a>
          </div>
        </div>
        <p className="mt-4 text-[13px] text-muted">Photos from OJ&rsquo;s Instagram, June 2019.</p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- about */

const reasons = [
  { t: 'Local rental support', d: 'Talk to people in Montego Bay who know the vehicles and the roads.' },
  { t: 'Options for different needs', d: 'Small cars for town, sedans for comfort, SUVs and vans for bigger groups.' },
  { t: 'Direct booking help', d: 'Call or email, and OJ’s confirms the vehicle, dates and price with you.' },
  { t: 'Airport and cruise pier inquiries', d: 'Ask about having your vehicle brought to Sangster or the cruise port.' },
  { t: 'Rentals and sales in one place', d: 'Rent for the week or buy your next car from the same team.' },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative border-t border-line bg-ink">
      <div className="gutter mx-auto max-w-[1440px] py-[clamp(80px,11vw,150px)]">
        <div className="grid gap-12 lg:grid-cols-12">
          <h2 id="about-title" className="display text-[clamp(2.3rem,5.2vw,5rem)] lg:col-span-7">
            Local service. Every road ahead<span className="text-red">.</span>
          </h2>
          <p className="text-[19px] leading-relaxed text-paper/85 lg:col-span-5 lg:pt-3">
            Based in Montego Bay, OJ&rsquo;s Auto Sales &amp; Rental helps travelers and local customers find vehicles suited to
            their journeys. Whether you&rsquo;re planning a vacation, arranging everyday transportation, or searching for your
            next vehicle, we&rsquo;re here to help you get moving.
          </p>
        </div>
        <div className="mt-16 grid gap-x-12 md:grid-cols-2">
          {reasons.map((r) => (
            <div key={r.t} className="grid grid-cols-[auto_1fr] gap-5 border-t border-line py-7">
              <span className="mt-2 h-px w-6 bg-red" aria-hidden />
              <div>
                <h3 className="text-[19px] font-semibold">{r.t}</h3>
                <p className="mt-1.5 max-w-[48ch] text-[15.5px] text-paper/70">{r.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- testimonials (hidden until real reviews exist) */

export function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="relative border-t border-line bg-ink">
      <div className="gutter mx-auto max-w-[1440px] py-[clamp(80px,11vw,150px)]">
        <h2 id="reviews-title" className="display text-[clamp(2.3rem,5.6vw,5.4rem)]">
          What our customers say.
        </h2>
        <ul className="mt-12 flex snap-x gap-4 overflow-x-auto pb-4 no-scrollbar">
          {testimonials.map((t) => (
            <li key={t.id} className="min-w-[min(420px,85vw)] snap-start rounded-[6px] border border-line p-7">
              <blockquote className="text-[19px] leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
              <p className="mt-5 text-[14px] font-semibold">{t.name}</p>
              <p className="text-[13px] text-muted">
                {t.context}, {t.source}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- visit */

function LazyMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) return setShow(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setShow(true), io.disconnect()), { rootMargin: '400px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative min-h-[360px] overflow-hidden rounded-[6px] border border-line bg-ink-3">
      {show && (
        <iframe
          title={`Map showing ${business.address.street}, ${business.address.city}`}
          src={mapsEmbedUrl()}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full grayscale-[0.6] invert-[0.92] hue-rotate-180"
        />
      )}
      <a href={mapsUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-secondary absolute bottom-4 left-4 bg-ink/90">
        <MapPin size={16} weight="bold" aria-hidden /> Open in Google Maps
      </a>
    </div>
  );
}

export function Visit() {
  const { address, hours } = business;
  return (
    <section id="visit" aria-labelledby="visit-title" className="relative border-t border-line bg-ink-2">
      <div className="gutter mx-auto max-w-[1440px] py-[clamp(80px,11vw,150px)]">
        <h2 id="visit-title" className="display max-w-[16ch] text-[clamp(2.3rem,5.2vw,5rem)]">
          Your journey starts in Montego Bay.
        </h2>
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <LazyMap />
          <div className="grid content-start gap-8">
            <address className="not-italic">
              <p className="label mb-2 flex items-center gap-2">
                <MapPin size={14} aria-hidden /> Address
              </p>
              <p className="text-[19px] leading-snug">
                {address.street}
                <br />
                {address.city}, {address.parish}
                <br />
                {address.country}
              </p>
            </address>
            <div>
              <p className="label mb-2 flex items-center gap-2">
                <Phone size={14} aria-hidden /> Call
              </p>
              <ul className="grid gap-1">
                {business.phones.map((p) => (
                  <li key={p.e164} className="flex flex-wrap items-center justify-between gap-2">
                    <a href={`tel:${p.e164}`} className="text-[19px] tabular underline-offset-4 hover:underline">
                      {p.display}
                    </a>
                    <CopyButton text={p.display} label="Copy" />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label mb-2 flex items-center gap-2">
                <EnvelopeSimple size={14} aria-hidden /> Email
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <a href={`mailto:${business.email}`} className="text-[19px] underline-offset-4 hover:underline">
                  {business.email}
                </a>
                <CopyButton text={business.email} label="Copy" />
              </div>
            </div>
            <div>
              <p className="label mb-2 flex items-center gap-2">
                <Clock size={14} aria-hidden /> Hours
              </p>
              <dl className="grid gap-1 text-[16px]">
                {hours.rows.map((r) => (
                  <div key={r.days} className="flex justify-between gap-4">
                    <dt className="text-paper/75">{r.days}</dt>
                    <dd className="tabular">{r.open}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-[13px] text-muted">{hours.note}</p>
            </div>
            <div className="flex gap-2">
              <a href={business.social.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary px-3.5" aria-label={`Instagram ${business.social.instagram.handle}`}>
                <InstagramLogo size={18} aria-hidden /> Instagram
              </a>
              <a href={business.social.facebook.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary px-3.5" aria-label="Facebook">
                <FacebookLogo size={18} aria-hidden /> Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- final CTA */

export function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="relative overflow-hidden border-t border-line bg-ink">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-red/70" aria-hidden />
      <div className="gutter mx-auto max-w-[1440px] py-[clamp(96px,14vw,200px)]">
        <h2 id="final-title" className="display text-[clamp(3rem,9vw,9rem)]">
          Ready to hit
          <br />
          the road?
        </h2>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href="#showroom" className="btn btn-primary">
            Explore the fleet <ArrowRight size={16} weight="bold" aria-hidden />
          </a>
          <button type="button" className="btn btn-secondary" onClick={() => openInquiry({ kind: 'general' }, "Contact OJ's")}>
            Contact OJ&rsquo;s
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- footer */

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-ink">
      <div className="gutter mx-auto grid max-w-[1440px] gap-10 pb-28 pt-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="grid content-start gap-4">
          <Wordmark />
          <p className="max-w-[36ch] text-[14px] text-muted">
            {business.address.street}, {business.address.city}, {business.address.country}
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid gap-2 text-[14.5px]">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-paper/80 hover:text-paper">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="grid content-start gap-2 text-[14.5px]">
          {business.phones.map((p) => (
            <a key={p.e164} href={`tel:${p.e164}`} className="tabular text-paper/80 hover:text-paper">
              {p.display}
            </a>
          ))}
          <a href={`mailto:${business.email}`} className="text-paper/80 hover:text-paper">
            {business.email}
          </a>
        </div>
        <p className="text-[12.5px] leading-relaxed text-muted md:col-span-3">
          &copy; {new Date().getFullYear()} {business.legalName}. Vehicle photos are from OJ&rsquo;s Instagram (2019) and may not
          show current stock. Rates, availability and delivery are confirmed by OJ&rsquo;s when you inquire.
        </p>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------- floating contact */

export function ContactFab() {
  const wa = business.whatsapp;
  return (
    <div className="fab fixed z-[var(--z-fab)]" style={{ right: 'max(16px, env(safe-area-inset-right, 0px))', bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}>
      {wa ? (
        <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary min-h-[52px] shadow-lg shadow-black/40">
          <ChatCircleText size={20} weight="bold" aria-hidden /> WhatsApp
        </a>
      ) : (
        <button type="button" className="btn btn-primary min-h-[52px] shadow-lg shadow-black/40" onClick={() => openInquiry({ kind: 'general' }, "Contact OJ's")}>
          <Phone size={19} weight="bold" aria-hidden /> Contact OJ&rsquo;s
        </button>
      )}
    </div>
  );
}
