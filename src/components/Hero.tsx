import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Pause, Play } from '@phosphor-icons/react';
import lotVideo from '../assets/media/lot.mp4';
import lotWebm from '../assets/media/lot.webm';
import lotPoster from '../assets/media/lot-poster.webp';
import { prefersReducedMotion } from '../lib/store';

/** Hero over real footage of OJ's lot on Queens Drive (from their Instagram). */
export function Hero() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [reduced] = useState(prefersReducedMotion);

  useEffect(() => {
    const v = video.current;
    if (!v || reduced) return;
    v.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [reduced]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      v.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section id="hero" aria-labelledby="hero-title" className="relative isolate flex min-h-[92dvh] flex-col overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden>
        <video
          ref={video}
          className="hero-media h-full w-full object-cover"
          poster={lotPoster}
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={lotWebm} type="video/webm" />
          <source src={lotVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(11_11_13/0.72)_0%,rgb(11_11_13/0.35)_38%,rgb(11_11_13/0.82)_78%,#0b0b0d_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(11_11_13/0.75)_0%,transparent_65%)]" />
        <div className="light-sweep" />
      </div>

      <div className="gutter mx-auto mt-auto w-full max-w-[1440px] pb-[clamp(88px,13vh,140px)] pt-28">
        <h1 id="hero-title" className="display hero-lines text-[clamp(2.5rem,5.8vw,6.4rem)]" style={{ fontStretch: '100%' }}>
          <span className="block">Your ride. Your journey.</span>
          <span className="block">
            Your Jamaica<span className="text-red">.</span>
          </span>
        </h1>
        <div className="hero-sub mt-7 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[34rem] text-[17px] leading-relaxed text-paper/90">
            Vehicle rentals and sales in Montego Bay. Explore our fleet and find the right ride for your next journey.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#showroom" className="btn btn-primary">
              Explore our fleet <ArrowRight size={16} weight="bold" aria-hidden />
            </a>
            <a href="#search" className="btn btn-secondary bg-ink/40 backdrop-blur">
              Reserve your ride
            </a>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={toggle}
        className="btn btn-ghost absolute right-[max(16px,env(safe-area-inset-right,0px))] top-[96px] hidden min-h-[36px] px-2.5 text-[11px] text-paper/70 md:inline-flex"
        aria-label={playing ? 'Pause background video' : 'Play background video'}
      >
        {playing ? <Pause size={14} weight="fill" aria-hidden /> : <Play size={14} weight="fill" aria-hidden />}
        Our lot, Queens Drive
      </button>
    </section>
  );
}
