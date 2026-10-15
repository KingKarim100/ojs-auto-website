import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { business } from './src/config/business';

/** LocalBusiness / AutoRental structured data, built from the business config (no invented ratings). */
function structuredData(): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': ['AutoRental', 'AutoDealer'],
    name: business.name,
    url: `https://${business.domain}/`,
    email: business.email,
    telephone: business.phones.map((p) => p.e164),
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.parish,
      addressCountry: business.address.countryCode,
    },
    sameAs: [business.social.instagram.url, business.social.facebook.url],
  };
  return JSON.stringify(data);
}

export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'ojs-jsonld',
      transformIndexHtml: (html: string) => html.replace('<!--JSONLD-->', `<script type="application/ld+json">${structuredData()}</script>`),
    },
    ...(mode === 'singlefile' ? [viteSingleFile()] : []),
  ],
  build: {
    outDir: mode === 'singlefile' ? 'dist-preview' : 'dist',
    chunkSizeWarningLimit: 1500,
    assetsInlineLimit: mode === 'singlefile' ? 100_000_000 : 4096,
  },
}));
