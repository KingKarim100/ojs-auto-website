import { useEffect, useState } from 'react';
import { ArrowLeft } from '@phosphor-icons/react';
import { categoryLabels, getVehicleById, isForRent, isForSale, listingLabel, priceLabel, rateLabel, vehicleName } from '../lib/vehicles';
import { askToBuy, reserve } from './Showroom';
import { SourceBadge } from './ui';

export function VehicleDetail({ id }: { id: string }) {
  const v = getVehicleById(id);
  const [i, setI] = useState(0);
  useEffect(() => {
    window.scrollTo(0, 0);
    setI(0);
    const prev = document.title;
    if (v) document.title = `${vehicleName(v)} | OJ's Auto Sales & Rental, Montego Bay`;
    return () => {
      document.title = prev;
    };
  }, [v]);

  if (!v) {
    return (
      <main id="main" className="gutter relative mx-auto min-h-[70dvh] max-w-[1440px] pt-32">
        <h1 className="display text-[clamp(2rem,5vw,4rem)]">Vehicle not found.</h1>
        <p className="mt-4 text-paper/80">This listing may have been removed. Browse the fleet instead.</p>
        <a href="#showroom" className="btn btn-primary mt-8">
          Back to the fleet
        </a>
      </main>
    );
  }

  const img = v.images[i];
  const specs: [string, string][] = [
    ['Class', categoryLabels[v.category].label],
    ['Offered', listingLabel(v)],
    ['Colour', v.colour],
    ['Gearbox', v.transmission],
    ['Seats', String(v.seats)],
    ['Luggage', v.luggage ? `${v.luggage} bags` : 'Ask OJ’s'],
    ['Air conditioning', v.aircon ? 'Yes' : 'No'],
    ['Fuel', v.fuel],
    ['Year', v.year ? String(v.year) : 'Ask OJ’s'],
    ['Mileage', v.mileage ? `${v.mileage.toLocaleString()} km` : 'Ask OJ’s'],
  ];

  return (
    <main id="main" className="relative min-h-screen bg-ink">
      <div className="gutter mx-auto max-w-[1440px] pb-24 pt-24">
        <a href="#showroom" className="btn btn-ghost -ml-3 min-h-[40px] text-[12px]">
          <ArrowLeft size={16} weight="bold" aria-hidden /> Back to the fleet
        </a>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          <div className="min-w-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] border border-line bg-ink-2">
              {img && <img key={img.src} src={img.src} alt={`${v.colour} ${v.make} ${v.model}, ${img.label.toLowerCase()}`} className="photo-in absolute inset-0 h-full w-full object-cover" />}
            </div>
            {v.images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2" role="group" aria-label="Choose a photo">
                {v.images.map((im, k) => (
                  <button
                    key={im.src}
                    type="button"
                    aria-pressed={k === i}
                    aria-label={`Show ${im.label.toLowerCase()} photo`}
                    onClick={() => setI(k)}
                    className={`overflow-hidden rounded-[6px] border ${k === i ? 'border-red' : 'border-line hover:border-line-strong'}`}
                  >
                    <img src={im.src} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
            <div className="mt-4">
              <SourceBadge>Photos: {v.source}</SourceBadge>
            </div>
          </div>

          <div className="grid content-start gap-6">
            <h1 className="display text-[clamp(2.2rem,4.6vw,4rem)]">{vehicleName(v)}</h1>
            <p className="text-[17px] leading-relaxed text-paper/80">{v.summary}</p>
            <div className="grid grid-cols-2 gap-3 rounded-[6px] border border-line p-5">
              {isForRent(v) && (
                <div>
                  <p className="label">Daily rate</p>
                  <p className="mt-1 text-[18px] font-semibold">{rateLabel(v)}</p>
                </div>
              )}
              {isForSale(v) && (
                <div>
                  <p className="label">Price</p>
                  <p className="mt-1 text-[18px] font-semibold">{priceLabel(v)}</p>
                </div>
              )}
              <p className="col-span-2 text-[13px] text-muted">These photos are from 2019. Ask OJ&rsquo;s what is on the lot today.</p>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {specs.map(([k, val]) => (
                <div key={k}>
                  <dt className="label">{k}</dt>
                  <dd className="mt-1 text-[16px] font-medium">{val}</dd>
                </div>
              ))}
            </dl>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {isForRent(v) && (
                <button type="button" className="btn btn-primary" onClick={() => reserve(v)}>
                  Reserve this vehicle
                </button>
              )}
              {isForSale(v) && (
                <button type="button" className="btn btn-secondary" onClick={() => askToBuy(v)}>
                  Ask to buy
                </button>
              )}
            </div>
            {isForRent(v) && (
              <div className="border-t border-line pt-5 text-[14px] leading-relaxed text-paper/75">
                <h2 className="mb-1.5 text-[15px] font-semibold text-paper">Terms and requirements</h2>
                Driver age, licence, deposit and insurance requirements are confirmed by OJ&rsquo;s when you book. Rental fees do not
                include fuel, tolls or attraction admission.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
