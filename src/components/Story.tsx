import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import { useUI } from '../lib/store';
import { getVehicleById, getVehicles } from '../lib/vehicles';
import lotPoster from '../assets/media/lot-poster.webp';

/**
 * Scroll story: a sticky photo frame on one side, three beats of copy on the other.
 * As each beat reaches the middle of the screen, the frame swaps to its photo with a light sweep.
 */
export function Story() {
  const id = useUI((s) => s.selectedId);
  const v = getVehicleById(id) ?? getVehicles()[0];
  const van = getVehicles({ category: 'van' })[0];
  const [active, setActive] = useState(0);
  const beats = useRef<(HTMLDivElement | null)[]>([]);

  const frames = [
    { src: lotPoster, alt: "OJ's lot on Queens Drive, Montego Bay, from OJ's Instagram" },
    { src: (van ?? v).images[0]?.src, alt: `${(van ?? v).colour} ${(van ?? v).make} ${(van ?? v).model} from OJ's Instagram` },
    { src: v.images[0]?.src, alt: `${v.colour} ${v.make} ${v.model} from OJ's Instagram` },
  ];

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.beat));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    beats.current.forEach((b) => b && io.observe(b));
    return () => io.disconnect();
  }, []);

  const beat = (i: number) => ({
    ref: (el: HTMLDivElement | null) => {
      beats.current[i] = el;
    },
    'data-beat': i,
    className: `story-beat flex min-h-[85dvh] flex-col justify-center py-16 transition-opacity duration-500 lg:min-h-[100dvh] ${
      active === i ? 'opacity-100' : 'lg:opacity-40'
    }`,
  });

  return (
    <section id="story" aria-labelledby="story-title" className="relative border-t border-line">
      <div className="gutter mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        {/* sticky frame (desktop) */}
        <div className="relative hidden lg:block">
          <div className="sticky top-[12vh] h-[76vh] overflow-hidden rounded-[6px] border border-line bg-ink-2">
            {frames.map((f, i) => (
              <img
                key={i}
                src={f.src}
                alt={active === i ? f.alt : ''}
                aria-hidden={active !== i}
                className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[900ms] ease-[var(--ease-out-quint)] ${
                  active === i ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'
                }`}
                loading="lazy"
              />
            ))}
            <div key={active} className="stage-sweep run" aria-hidden />
            <div className="absolute bottom-4 left-4 flex gap-1.5" aria-hidden>
              {frames.map((_, i) => (
                <span key={i} className={`h-[3px] rounded-full transition-all duration-500 ${active === i ? 'w-8 bg-red' : 'w-4 bg-paper/35'}`} />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div {...beat(0)}>
            <img src={frames[0].src} alt={frames[0].alt} className="mb-6 aspect-[16/10] w-full rounded-[6px] object-cover lg:hidden" loading="lazy" />
            <h2 id="story-title" className="label mb-4">
              Explore beyond the ordinary
            </h2>
            <p className="display text-[clamp(2.1rem,4vw,3.8rem)]">Arrive in Jamaica.</p>
            <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-paper/80">
              OJ&rsquo;s is on Queens Drive by the airport roundabout in Montego Bay, so your car is close to where your trip
              begins.
            </p>
          </div>
          <div {...beat(1)}>
            <img src={frames[1].src} alt={frames[1].alt} className="mb-6 aspect-[16/10] w-full rounded-[6px] object-cover lg:hidden" loading="lazy" />
            <p className="display text-[clamp(2.1rem,4vw,3.8rem)]">The island is yours to explore.</p>
            <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-paper/80">
              Negril sunsets, Ocho Rios waterfalls, the old streets of Falmouth. Bring the whole family and leave Montego Bay
              on your own schedule.
            </p>
          </div>
          <div {...beat(2)}>
            <img src={frames[2].src} alt={frames[2].alt} className="mb-6 aspect-[16/10] w-full rounded-[6px] object-cover lg:hidden" loading="lazy" />
            <p className="display text-[clamp(2.1rem,4vw,3.8rem)]">The right ride for every journey.</p>
            <dl className="mt-7 grid max-w-[30rem] grid-cols-3 gap-4 border-t border-line pt-5">
              <div>
                <dt className="label">Seats</dt>
                <dd className="display-tight mt-1 text-[30px] tabular">{v.seats}</dd>
              </div>
              <div>
                <dt className="label">Gearbox</dt>
                <dd className="mt-2.5 text-[15px] font-medium">{v.transmission}</dd>
              </div>
              <div>
                <dt className="label">Bags</dt>
                <dd className="display-tight mt-1 text-[30px] tabular">{v.luggage ?? '-'}</dd>
              </div>
            </dl>
            <p className="mt-4 text-[13.5px] text-muted">
              Shown: {v.make} {v.model}. Pick another in the showroom above.
            </p>
            <a href="#categories" className="btn btn-secondary mt-7 self-start">
              Browse by class <ArrowRight size={15} weight="bold" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
