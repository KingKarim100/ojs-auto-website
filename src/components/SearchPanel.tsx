import { useId, useState, type FormEvent } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { business } from '../config/business';
import { categoryLabels, getCategories } from '../lib/vehicles';
import { setUI, smoothScrollTo } from '../lib/store';
import { formatDate, type RentalInquiry } from '../lib/inquiry';
import type { VehicleCategory } from '../data/vehicles';

type Errors = Partial<Record<'pickupDate' | 'pickupTime' | 'returnDate' | 'returnTime' | 'pickupLocation', string>>;

function todayISO(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export function validateRental(f: {
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  pickupLocation: string;
}, now = new Date()): Errors {
  const e: Errors = {};
  if (!f.pickupDate) e.pickupDate = 'Choose a pickup date.';
  if (!f.pickupTime) e.pickupTime = 'Choose a pickup time.';
  if (!f.returnDate) e.returnDate = 'Choose a return date.';
  if (!f.returnTime) e.returnTime = 'Choose a return time.';
  if (!f.pickupLocation) e.pickupLocation = 'Choose where to collect the vehicle.';
  if (f.pickupDate && f.pickupTime) {
    const start = new Date(`${f.pickupDate}T${f.pickupTime}`);
    if (Number.isNaN(start.getTime())) e.pickupDate = 'Enter a valid date.';
    else if (start.getTime() < now.getTime() - 60_000) e.pickupDate = 'Pickup cannot be in the past.';
    if (f.returnDate && f.returnTime) {
      const end = new Date(`${f.returnDate}T${f.returnTime}`);
      if (Number.isNaN(end.getTime())) e.returnDate = 'Enter a valid date.';
      else if (end.getTime() <= start.getTime()) e.returnDate = 'Return must be after pickup.';
    }
  }
  return e;
}

export function SearchPanel() {
  const uid = useId();
  const cats = getCategories('rental');
  const [f, setF] = useState({
    pickupDate: '',
    pickupTime: '10:00',
    returnDate: '',
    returnTime: '10:00',
    pickupLocation: business.pickupLocations[1].name,
    returnLocation: business.pickupLocations[1].name,
    category: '' as VehicleCategory | '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState('');
  const set = (k: keyof typeof f) => (ev: { target: { value: string } }) => setF((s) => ({ ...s, [k]: ev.target.value }));

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validateRental(f);
    setErrors(e);
    if (Object.keys(e).length) {
      setStatus(`Please fix ${Object.keys(e).length} ${Object.keys(e).length === 1 ? 'field' : 'fields'}.`);
      const first = Object.keys(e)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setStatus('');
    const cat = f.category ? categoryLabels[f.category].plural.toLowerCase() : 'vehicles';
    const search: RentalInquiry = {
      kind: 'rental',
      pickupDate: f.pickupDate,
      pickupTime: f.pickupTime,
      returnDate: f.returnDate,
      returnTime: f.returnTime,
      pickupLocation: f.pickupLocation,
      returnLocation: f.returnLocation,
      category: f.category ? categoryLabels[f.category].label : undefined,
    };
    setUI({
      filter: f.category || 'all',
      search,
      searchNotice: `Showing ${cat} for ${formatDate(f.pickupDate)} to ${formatDate(f.returnDate)}. OJ's confirms real availability and price when you inquire.`,
    });
    smoothScrollTo('showroom');
  };

  const field = (k: keyof Errors, label: string, input: React.ReactNode) => (
    <label className="field" htmlFor={`${uid}-${k}`}>
      <span>{label}</span>
      {input}
      {errors[k] && (
        <span id={`${uid}-${k}-err`} className="error-text">
          {errors[k]}
        </span>
      )}
    </label>
  );
  const aria = (k: keyof Errors) => ({
    id: `${uid}-${k}`,
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `${uid}-${k}-err` : undefined,
  });

  return (
    <section id="search" aria-labelledby="search-title" className="gutter relative z-[1] -mt-16 scroll-mt-24">
      <form
        noValidate
        onSubmit={submit}
        className="glass mx-auto max-w-[1440px] rounded-[6px] p-5 md:p-7"
        aria-describedby={`${uid}-note`}
      >
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 id="search-title" className="display-tight text-[clamp(1.35rem,2.4vw,1.9rem)]">
            Find your perfect ride.
          </h2>
          <p id={`${uid}-note`} className="text-[13.5px] text-muted">
            This starts an inquiry with OJ's. It is not a confirmed booking.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-[1.1fr_0.8fr_1.1fr_0.8fr_1.5fr_1.5fr_1.1fr_auto] xl:items-start">
          {field('pickupDate', 'Pickup date', <input type="date" className="input" min={todayISO()} value={f.pickupDate} onChange={set('pickupDate')} {...aria('pickupDate')} />)}
          {field('pickupTime', 'Pickup time', <input type="time" className="input" value={f.pickupTime} onChange={set('pickupTime')} {...aria('pickupTime')} />)}
          {field('returnDate', 'Return date', <input type="date" className="input" min={f.pickupDate || todayISO()} value={f.returnDate} onChange={set('returnDate')} {...aria('returnDate')} />)}
          {field('returnTime', 'Return time', <input type="time" className="input" value={f.returnTime} onChange={set('returnTime')} {...aria('returnTime')} />)}
          <div className="col-span-2 md:col-span-2 xl:col-span-1">
            {field(
              'pickupLocation',
              'Pickup location',
              <select className="input" value={f.pickupLocation} onChange={set('pickupLocation')} {...aria('pickupLocation')}>
                {business.pickupLocations.map((l) => (
                  <option key={l.id} value={l.name}>
                    {l.name}
                  </option>
                ))}
              </select>,
            )}
          </div>
          <label className="field col-span-2 md:col-span-2 xl:col-span-1" htmlFor={`${uid}-ret`}>
            <span>Return location</span>
            <select id={`${uid}-ret`} className="input" value={f.returnLocation} onChange={set('returnLocation')}>
              {business.pickupLocations.map((l) => (
                <option key={l.id} value={l.name}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field col-span-2 md:col-span-2 xl:col-span-1" htmlFor={`${uid}-cat`}>
            <span>Vehicle class</span>
            <select id={`${uid}-cat`} className="input" value={f.category} onChange={set('category')}>
              <option value="">Any class</option>
              {cats.map((c) => (
                <option key={c} value={c}>
                  {categoryLabels[c].label}
                </option>
              ))}
            </select>
          </label>
          <div className="col-span-2 flex items-end md:col-span-2 xl:col-span-1 xl:pt-[26px]">
            <button type="submit" className="btn btn-primary w-full">
              <MagnifyingGlass size={17} weight="bold" aria-hidden /> Find vehicles
            </button>
          </div>
        </div>
        <p role="status" aria-live="polite" className="error-text mt-3 min-h-[1em] empty:hidden">
          {status}
        </p>
      </form>
    </section>
  );
}
