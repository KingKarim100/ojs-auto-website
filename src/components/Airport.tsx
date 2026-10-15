import { useId, useState, type FormEvent } from 'react';
import { AirplaneLanding, Anchor, Buildings, PaperPlaneTilt } from '@phosphor-icons/react';
import { business } from '../config/business';
import { openInquiry } from '../lib/store';
import { categoryLabels, getCategories } from '../lib/vehicles';

type Errs = Partial<Record<'date' | 'location' | 'name' | 'contact', string>>;

export function validateAirport(f: { date: string; location: string; name: string; contact: string }, now = new Date()): Errs {
  const e: Errs = {};
  if (!f.date) e.date = 'Choose your arrival date.';
  else {
    const d = new Date(`${f.date}T23:59`);
    if (Number.isNaN(d.getTime())) e.date = 'Enter a valid date.';
    else if (d.getTime() < now.getTime()) e.date = 'Arrival date cannot be in the past.';
  }
  if (!f.location) e.location = 'Choose where you arrive.';
  if (!f.name.trim()) e.name = 'Tell us your name.';
  if (!f.contact.trim()) e.contact = 'Add an email or phone number so OJ’s can reply.';
  else if (!/@/.test(f.contact) && f.contact.replace(/\D/g, '').length < 7) e.contact = 'Enter a valid email or phone number.';
  return e;
}

const icon = (id: string) =>
  id.includes('cruise') ? <Anchor size={20} aria-hidden /> : id === 'hotels' ? <Buildings size={20} aria-hidden /> : <AirplaneLanding size={20} aria-hidden />;

export function Airport() {
  const uid = useId();
  const [f, setF] = useState({ date: '', time: '', location: business.deliveryLocations[0].name, ref: '', vehicle: '', passengers: '', name: '', contact: '' });
  const [errs, setErrs] = useState<Errs>({});
  const set = (k: keyof typeof f) => (ev: { target: { value: string } }) => setF((s) => ({ ...s, [k]: ev.target.value }));

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validateAirport(f);
    setErrs(e);
    if (Object.keys(e).length) {
      document.getElementById(`${uid}-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    openInquiry(
      {
        kind: 'airport',
        date: f.date,
        time: f.time || undefined,
        location: f.location,
        travelRef: f.ref || undefined,
        vehicle: f.vehicle || undefined,
        passengers: f.passengers || undefined,
        name: `${f.name} (${f.contact})`,
      },
      'Airport and cruise delivery inquiry',
    );
  };

  const a = (k: keyof Errs) => ({
    id: `${uid}-${k}`,
    'aria-invalid': errs[k] ? true : undefined,
    'aria-describedby': errs[k] ? `${uid}-${k}-e` : undefined,
  });
  const err = (k: keyof Errs) =>
    errs[k] ? (
      <span id={`${uid}-${k}-e`} className="error-text">
        {errs[k]}
      </span>
    ) : null;

  return (
    <section id="airport" aria-labelledby="airport-title" className="relative border-t border-line bg-ink-2">
      <div className="gutter mx-auto grid max-w-[1440px] gap-14 py-[clamp(80px,11vw,150px)] lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <p className="label mb-5">Airport and cruise arrivals</p>
          <h2 id="airport-title" className="display text-[clamp(2.6rem,6.4vw,6rem)]">
            Land.
            <br />
            Collect.
            <br />
            Explore<span className="text-red">.</span>
          </h2>
          <p className="mt-7 max-w-[44ch] text-[17px] leading-relaxed text-paper/80">
            Arriving in Jamaica? Ask about vehicle pickup and delivery arrangements that suit your travel plans. Delivery fees
            and timing are confirmed by OJ&rsquo;s before anything is booked.
          </p>
          <ul className="mt-10 grid border-t border-line" aria-label="Delivery locations">
            {business.deliveryLocations.map((l) => (
              <li key={l.id} className="flex items-center gap-4 border-b border-line py-4">
                <span className="text-silver">{icon(l.id)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15.5px] font-semibold leading-snug">{l.name}</span>
                  <span className="block text-[13px] text-muted">{l.area}</span>
                </span>
                <span className={`shrink-0 text-right text-[13px] font-medium ${l.status === 'on-request' ? 'text-paper' : 'text-muted'}`}>
                  {l.status === 'on-request' ? 'Delivery on request' : 'Ask about delivery'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <form noValidate onSubmit={submit} className="grid content-start gap-4 rounded-[6px] border border-line bg-ink p-5 md:p-8" aria-labelledby={`${uid}-t`}>
          <h3 id={`${uid}-t`} className="display-tight text-[22px]">
            Delivery inquiry
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="field" htmlFor={`${uid}-date`}>
              <span>Arrival date</span>
              <input type="date" className="input" value={f.date} onChange={set('date')} {...a('date')} />
              {err('date')}
            </label>
            <label className="field" htmlFor={`${uid}-time`}>
              <span>Arrival time (optional)</span>
              <input id={`${uid}-time`} type="time" className="input" value={f.time} onChange={set('time')} />
            </label>
          </div>
          <label className="field" htmlFor={`${uid}-location`}>
            <span>Arrival location</span>
            <select className="input" value={f.location} onChange={set('location')} {...a('location')}>
              {business.deliveryLocations.map((l) => (
                <option key={l.id} value={l.name}>
                  {l.name}
                </option>
              ))}
            </select>
            {err('location')}
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="field" htmlFor={`${uid}-ref`}>
              <span>Flight or cruise (optional)</span>
              <input id={`${uid}-ref`} className="input" value={f.ref} onChange={set('ref')} placeholder="e.g. AA 1503" />
            </label>
            <label className="field" htmlFor={`${uid}-pax`}>
              <span>Passengers (optional)</span>
              <input id={`${uid}-pax`} className="input" inputMode="numeric" value={f.passengers} onChange={set('passengers')} />
            </label>
          </div>
          <label className="field" htmlFor={`${uid}-veh`}>
            <span>Vehicle preference (optional)</span>
            <select id={`${uid}-veh`} className="input" value={f.vehicle} onChange={set('vehicle')}>
              <option value="">No preference</option>
              {getCategories('rental').map((c) => (
                <option key={c} value={categoryLabels[c].label}>
                  {categoryLabels[c].label}
                </option>
              ))}
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="field" htmlFor={`${uid}-name`}>
              <span>Your name</span>
              <input className="input" autoComplete="name" value={f.name} onChange={set('name')} {...a('name')} />
              {err('name')}
            </label>
            <label className="field" htmlFor={`${uid}-contact`}>
              <span>Email or phone</span>
              <input className="input" autoComplete="email" value={f.contact} onChange={set('contact')} {...a('contact')} />
              {err('contact')}
            </label>
          </div>
          <button type="submit" className="btn btn-primary mt-2">
            <PaperPlaneTilt size={17} weight="bold" aria-hidden /> Prepare my inquiry
          </button>
          <p className="text-[12.5px] text-muted">
            Next you choose how to send it: email or phone. Nothing is sent until you do.
          </p>
        </form>
      </div>
    </section>
  );
}
