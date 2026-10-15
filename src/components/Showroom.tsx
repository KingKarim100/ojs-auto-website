import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  ArrowRight,
  CaretLeft,
  CaretRight,
  CornersIn,
  CornersOut,
  GasPump,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  Snowflake,
  SteeringWheel,
  Suitcase,
  Users,
  X,
} from '@phosphor-icons/react';
import { getUI, openInquiry, selectVehicle, setUI, useUI } from '../lib/store';
import {
  categoryLabels,
  getCategories,
  getVehicleById,
  getVehicles,
  isForRent,
  isForSale,
  listingLabel,
  priceLabel,
  rateLabel,
  vehicleName,
} from '../lib/vehicles';
import type { Vehicle } from '../data/vehicles';
import { SourceBadge } from './ui';

type Filter = ReturnType<typeof getUI>['filter'];

export function reserve(v: Vehicle) {
  const s = getUI().search;
  openInquiry({ ...(s ?? { kind: 'rental' }), kind: 'rental', vehicle: `the ${vehicleName(v)}` }, `Reserve the ${vehicleName(v)}`);
}

export function askToBuy(v: Vehicle) {
  openInquiry({ kind: 'sale', vehicle: `${v.colour.toLowerCase()} ${vehicleName(v)}` }, `Ask about buying the ${vehicleName(v)}`);
}

/** Big photo stage. Crossfades between photos and runs a light sweep on every change. */
function Stage({ v }: { v: Vehicle }) {
  const photo = useUI((s) => s.photo);
  const zoom = useUI((s) => s.zoom);
  const stage = useRef<HTMLDivElement>(null);
  const sweep = useRef<HTMLDivElement>(null);
  const [fs, setFs] = useState(false);
  const img = v.images[Math.min(photo, v.images.length - 1)];

  useEffect(() => {
    const el = sweep.current;
    if (!el) return;
    el.classList.remove('run');
    void el.offsetWidth;
    el.classList.add('run');
  }, [v.id, photo]);

  useEffect(() => {
    const on = () => setFs(document.fullscreenElement === stage.current);
    document.addEventListener('fullscreenchange', on);
    return () => document.removeEventListener('fullscreenchange', on);
  }, []);

  const go = (d: number) => setUI({ photo: (photo + d + v.images.length) % v.images.length, zoom: 0 });
  const toggleFs = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await stage.current?.requestFullscreen();
    } catch {
      /* fullscreen not available here */
    }
  };
  const canFs = typeof document !== 'undefined' && !!document.documentElement.requestFullscreen;

  return (
    <div ref={stage} className="relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-[6px] border border-line bg-ink-2">
      <div className="relative flex-1 overflow-hidden">
        {img && (
          <img
            key={img.src}
            src={img.src}
            alt={`${v.colour} ${v.make} ${v.model}, ${img.label.toLowerCase()} view. Photo from ${v.source}.`}
            className="photo-in absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out-quint)]"
            style={{ transform: `scale(${1 + zoom * 0.5})` }}
            draggable={false}
          />
        )}
        <div ref={sweep} className="stage-sweep" aria-hidden />
        {v.images.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} className="btn btn-secondary absolute left-3 top-1/2 min-h-[44px] -translate-y-1/2 bg-ink/60 px-3 backdrop-blur" aria-label="Previous photo">
              <CaretLeft size={18} weight="bold" aria-hidden />
            </button>
            <button type="button" onClick={() => go(1)} className="btn btn-secondary absolute right-3 top-1/2 min-h-[44px] -translate-y-1/2 bg-ink/60 px-3 backdrop-blur" aria-label="Next photo">
              <CaretRight size={18} weight="bold" aria-hidden />
            </button>
          </>
        )}
      </div>
      <div role="toolbar" aria-label="Photo controls" className="relative flex flex-wrap items-center justify-between gap-2 border-t border-line bg-ink p-2">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {v.images.map((p, i) => (
            <button
              key={p.src}
              type="button"
              aria-pressed={i === photo}
              onClick={() => setUI({ photo: i, zoom: 0 })}
              className={`btn min-h-[38px] shrink-0 px-3 text-[11.5px] ${i === photo ? 'bg-paper text-ink' : 'btn-ghost'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          <button type="button" className="btn btn-ghost min-h-[38px] px-2.5" aria-label="Zoom out" disabled={zoom <= 0} onClick={() => setUI({ zoom: Math.max(0, zoom - 0.5) })}>
            <MagnifyingGlassMinus size={18} aria-hidden />
          </button>
          <button type="button" className="btn btn-ghost min-h-[38px] px-2.5" aria-label="Zoom in" disabled={zoom >= 1} onClick={() => setUI({ zoom: Math.min(1, zoom + 0.5) })}>
            <MagnifyingGlassPlus size={18} aria-hidden />
          </button>
          {canFs && (
            <button type="button" className="btn btn-ghost min-h-[38px] px-2.5" aria-label={fs ? 'Exit full screen' : 'Full screen'} onClick={toggleFs}>
              {fs ? <CornersIn size={18} aria-hidden /> : <CornersOut size={18} aria-hidden />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-[6px] border border-line text-silver">{icon}</span>
      <span className="min-w-0">
        <span className="label block">{label}</span>
        <span className="block text-[15px] font-medium">{value}</span>
      </span>
    </div>
  );
}

function SpecPanel({ v }: { v: Vehicle }) {
  return (
    <div className="rounded-[6px] border border-line bg-ink-2 p-5 md:p-6" aria-live="polite">
      <div key={v.id} className="spec-swap grid gap-5">
        <p className="label">
          {categoryLabels[v.category].label}, {listingLabel(v).toLowerCase()}
        </p>
        <div>
          <h3 className="display-tight text-[clamp(1.7rem,2.6vw,2.4rem)]">
            {v.make} {v.model}
          </h3>
          <p className="mt-1 text-[13.5px] text-muted">{v.colour}</p>
          <p className="mt-3 text-[14.5px] leading-relaxed text-paper/75">{v.summary}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <Spec icon={<Users size={18} aria-hidden />} label="Seats" value={String(v.seats)} />
          <Spec icon={<SteeringWheel size={18} aria-hidden />} label="Gearbox" value={v.transmission} />
          <Spec icon={<Suitcase size={18} aria-hidden />} label="Luggage" value={v.luggage ? `${v.luggage} bags` : 'Ask OJ’s'} />
          <Spec icon={<Snowflake size={18} aria-hidden />} label="A/C" value={v.aircon ? 'Yes' : 'No'} />
          <Spec icon={<GasPump size={18} aria-hidden />} label="Fuel" value={v.fuel} />
          <div className="min-w-0 self-center">
            <span className="label block">{isForRent(v) ? 'Daily rate' : 'Price'}</span>
            <span className="block text-[15px] font-medium">{isForRent(v) ? rateLabel(v) : priceLabel(v)}</span>
          </div>
        </div>
        <div className="grid justify-items-start gap-2 border-t border-line pt-4 text-[12.5px] leading-snug text-muted">
          <SourceBadge>Photos: {v.source}</SourceBadge>
          <p>Ask OJ&rsquo;s what is on the lot today. Availability and price are confirmed when you inquire.</p>
        </div>
        <div className="grid gap-2.5">
          {isForRent(v) && (
            <button type="button" className="btn btn-primary" onClick={() => reserve(v)}>
              Reserve this vehicle
            </button>
          )}
          <div className="grid gap-2.5 sm:grid-cols-2">
            {isForSale(v) && (
              <button type="button" className="btn btn-secondary" onClick={() => askToBuy(v)}>
                Ask to buy
              </button>
            )}
            <a href={`#fleet-${v.id}`} className="btn btn-secondary">
              Details <ArrowRight size={15} weight="bold" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Showroom() {
  const filter = useUI((s) => s.filter);
  const selectedId = useUI((s) => s.selectedId);
  const notice = useUI((s) => s.searchNotice);
  const list = filter === 'all' ? getVehicles() : getVehicles({ category: filter });
  const v = list.find((x) => x.id === selectedId) ?? list[0] ?? getVehicleById(selectedId);
  const tabs: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All' },
    ...getCategories().map((c) => ({ id: c as Filter, label: categoryLabels[c].plural })),
  ];

  useEffect(() => {
    if (list.length && !list.some((x) => x.id === selectedId)) selectVehicle(list[0].id);
  }, [list, selectedId]);

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const i = tabs.findIndex((t) => t.id === filter);
    const n =
      e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    setUI({ filter: tabs[n].id });
    (e.currentTarget.querySelectorAll('[role=tab]')[n] as HTMLElement)?.focus();
  };

  if (!v) return null;

  return (
    <section id="showroom" aria-labelledby="showroom-title" className="relative scroll-mt-16">
      <div className="gutter mx-auto max-w-[1440px] pb-[clamp(64px,9vw,120px)] pt-[clamp(56px,7vw,96px)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2 id="showroom-title" className="display text-[clamp(2.1rem,4.4vw,4rem)]">
            Choose your ride<span className="text-red">.</span>
          </h2>
          <div role="tablist" aria-label="Vehicle categories" onKeyDown={onTabKey} className="flex gap-1 overflow-x-auto no-scrollbar">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                id={`tab-${t.id}`}
                aria-selected={filter === t.id}
                aria-controls="showroom-panel"
                tabIndex={filter === t.id ? 0 : -1}
                onClick={() => setUI({ filter: t.id, searchNotice: null })}
                className={`btn min-h-[40px] shrink-0 px-3.5 text-[12px] ${filter === t.id ? 'bg-paper text-ink' : 'btn-ghost text-paper/75 hover:text-paper'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        {notice && (
          <div className="mt-4 flex items-start justify-between gap-4 rounded-[6px] border border-line bg-ink-2 p-3.5 text-[14px]">
            <p>{notice}</p>
            <button type="button" className="btn btn-ghost min-h-[32px] px-2" aria-label="Dismiss search notice" onClick={() => setUI({ searchNotice: null })}>
              <X size={16} aria-hidden />
            </button>
          </div>
        )}

        <div id="showroom-panel" role="tabpanel" aria-labelledby={`tab-${filter}`} className="mt-8 grid gap-5 lg:grid-cols-[minmax(230px,0.75fr)_2.1fr_minmax(320px,1fr)]">
          <div className="order-2 min-w-0 lg:order-1">
            <p className="label mb-3">
              {list.length} {list.length === 1 ? 'vehicle' : 'vehicles'}
            </p>
            <ul role="radiogroup" aria-label="Choose a vehicle" className="flex gap-2 overflow-x-auto pb-1 no-scrollbar lg:flex-col lg:overflow-visible">
              {list.map((x) => {
                const on = x.id === v.id;
                return (
                  <li key={x.id} className="shrink-0">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => selectVehicle(x.id)}
                      className={`flex w-full min-w-[230px] items-center gap-3 rounded-[6px] border p-2 text-left transition-colors ${
                        on ? 'border-red bg-ink-2' : 'border-line hover:border-line-strong'
                      }`}
                    >
                      <img src={x.images[0]?.src} alt="" className="h-14 w-20 shrink-0 rounded-[4px] object-cover" loading="lazy" />
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold">
                          {x.make} {x.model}
                        </span>
                        <span className="block text-[12.5px] text-muted">
                          {categoryLabels[x.category].label}, {listingLabel(x).toLowerCase()}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="order-1 h-[clamp(300px,62vw,620px)] min-w-0 lg:order-2 lg:h-auto lg:min-h-[580px]">
            <Stage v={v} />
          </div>
          <div className="order-3 min-w-0">
            <SpecPanel v={v} />
          </div>
        </div>
      </div>
    </section>
  );
}
