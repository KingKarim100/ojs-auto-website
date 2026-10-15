import { ArrowUpRight } from '@phosphor-icons/react';
import { categoryLabels, getCategories, getVehicles } from '../lib/vehicles';
import { selectVehicle, setUI, smoothScrollTo } from '../lib/store';
import type { VehicleCategory } from '../data/vehicles';

/** Exactly one cell per category that has vehicles. */
const layout: Record<number, string[]> = {
  5: ['md:col-span-7 md:row-span-2', 'md:col-span-5', 'md:col-span-5', 'md:col-span-6', 'md:col-span-6'],
  4: ['md:col-span-7 md:row-span-2', 'md:col-span-5', 'md:col-span-5', 'md:col-span-12'],
  3: ['md:col-span-7 md:row-span-2', 'md:col-span-5', 'md:col-span-5'],
  2: ['md:col-span-6', 'md:col-span-6'],
  1: ['md:col-span-12'],
};

export function Categories() {
  const cats = getCategories();
  const ordered = [...cats].sort((a, b) => getVehicles({ category: b }).length - getVehicles({ category: a }).length);
  const spans = layout[ordered.length] ?? ordered.map(() => 'md:col-span-6');

  const go = (c: VehicleCategory) => {
    const first = getVehicles({ category: c })[0];
    setUI({ filter: c, searchNotice: null });
    if (first) selectVehicle(first.id);
    smoothScrollTo('showroom');
  };

  return (
    <section id="categories" aria-labelledby="categories-title" className="relative border-t border-line bg-ink">
      <div className="gutter mx-auto max-w-[1440px] py-[clamp(80px,12vw,160px)]">
        <h2 id="categories-title" className="display max-w-[14ch] text-[clamp(2.3rem,5.6vw,5.4rem)]">
          A ride for every occasion.
        </h2>
        <div className="mt-12 grid gap-3 md:auto-rows-[minmax(280px,auto)] md:grid-cols-12">
          {ordered.map((c, i) => {
            const vs = getVehicles({ category: c });
            const img = vs[0]?.images[0];
            return (
              <button
                key={c}
                type="button"
                onClick={() => go(c)}
                className={`group relative isolate flex min-h-[280px] flex-col justify-end overflow-hidden rounded-[6px] border border-line p-6 text-left ${spans[i]} ${
                  i === 0 ? 'md:min-h-[580px]' : ''
                }`}
              >
                {img && (
                  <img
                    src={img.src}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.04]"
                  />
                )}
                <span className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgb(11_11_13/0.92)_0%,rgb(11_11_13/0.35)_55%,transparent_100%)]" aria-hidden />
                <span className="flex items-end justify-between gap-4">
                  <span>
                    <span className="display-tight block text-[clamp(1.7rem,2.8vw,2.6rem)]">{categoryLabels[c].plural}</span>
                    <span className="mt-1 block max-w-[34ch] text-[14.5px] text-paper/85">{categoryLabels[c].use}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-[13px] text-paper/85">
                    <span className="tabular">{vs.length}</span> {vs.length === 1 ? 'vehicle' : 'vehicles'}
                    <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
