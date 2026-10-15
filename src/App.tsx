import { useEffect } from 'react';
import { getUI, setUI, useUI } from './lib/store';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { SearchPanel } from './components/SearchPanel';
import { Showroom } from './components/Showroom';
import { Story } from './components/Story';
import { Categories } from './components/Categories';
import { Airport } from './components/Airport';
import { About, ContactFab, FinalCta, ForSale, Footer, Testimonials, Visit } from './components/Sections';
import { InquiryDialog } from './components/InquiryDialog';
import { VehicleDetail } from './components/VehicleDetail';

function parseRoute(): ReturnType<typeof getUI>['route'] {
  const h = window.location.hash;
  if (h.startsWith('#fleet-')) return { name: 'vehicle', id: decodeURIComponent(h.slice(7)) };
  return { name: 'home' };
}

export default function App() {
  const route = useUI((s) => s.route);

  useEffect(() => {
    setUI({ route: parseRoute() });
    const onHash = () => {
      const r = parseRoute();
      const was = getUI().route.name;
      setUI({ route: r });
      if (r.name === 'home' && was === 'vehicle') {
        requestAnimationFrame(() => document.querySelector(window.location.hash || '#top')?.scrollIntoView());
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <>
      <a href="#main" className="skip-link btn btn-primary">
        Skip to content
      </a>
      <Nav />
      <div id="top" />
      <div id="top-sentinel" className="absolute top-0 h-px w-px" aria-hidden />
      {route.name === 'vehicle' ? (
        <VehicleDetail id={route.id} />
      ) : (
        <main id="main" className="relative">
          <Hero />
          <SearchPanel />
          <Showroom />
          <Story />
          <Categories />
          <Airport />
          <ForSale />
          <About />
          <Testimonials />
          <Visit />
          <FinalCta />
        </main>
      )}
      <Footer />
      <ContactFab />
      <InquiryDialog />
    </>
  );
}
