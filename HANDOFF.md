# OJ's Auto Sales & Rental: Website Phase 1 Handoff

Prepared for Karim. Phase 1 = design system, cinematic homepage over real footage of OJ's lot, photo showroom of OJ's real cars, scroll story, all homepage sections and vehicle detail pages.

## What you have

| File | What it is |
|---|---|
| `OJs-Auto-preview.html` | Whole site in one file. Double-click to open in Chrome or Edge. Send it to OJ's for review. |
| `ojs-auto-website.zip` | Full source project plus a ready-to-upload `dist/` folder. |

## Run it

```
npm install
npm run dev            # local dev server
npm run build          # production build into dist/ (upload this folder to any static host)
npm run build:preview  # single-file preview into dist-preview/index.html
npm run typecheck
npm run lint
```

Deploy `dist/` to Vercel, Netlify, Cloudflare Pages or any static host. Do not point ojsauto.com at it until OJ's approves.

## Stack note

The brief named Next.js. This build uses **Vite + React 19 + TypeScript + Tailwind v4**. Everything in Phase 1 is static, so Vite gives a smaller, faster site and lets the whole thing ship as one previewable file. The components are plain React, so they move into a Next.js App Router project unchanged when Phase 2 adds a backend.

## Where to change things

| Change | File |
|---|---|
| Phone numbers, email, hours, WhatsApp, delivery locations, socials | `src/config/business.ts` |
| Vehicles (make, model, seats, price, photos, 3D model) | `src/data/vehicles.ts` |
| Reviews (section stays hidden while empty) | `src/data/testimonials.ts` |
| Colours, fonts, spacing | `src/index.css` (tokens at the top) |
| Logo | `src/components/ui.tsx`, `Wordmark` (same box size as the placeholder) |

To switch WhatsApp on: set `whatsapp: '1876XXXXXXX'` in `business.ts`. The floating button and every inquiry form switch to WhatsApp automatically.

To use real photos: put image URLs in a vehicle's `images` array. Real photos always replace the demo renders.

To add or replace a car: drop photos in `src/assets/cars/`, import them at the top of `src/data/vehicles.ts`, and add an entry with an `images` list (each photo gets an angle label such as Front, Rear, Interior; these become the showroom buttons).

Hero video: `src/assets/media/lot.webm` and `lot.mp4` (a 5-second loop cut from OJ's 2019 lot walkaround). Swap in new footage of the lot when OJ's has it.

## REAL vs PLACEHOLDER

| Item | Status |
|---|---|
| Business name, address, both phone numbers, email, Instagram, Facebook | Real (from OJ's own listings) |
| Opening hours (Mon to Sat 8:30 to 6:30, Sun 9 to 6) | From public listings, which vary slightly. **Confirm with OJ's.** |
| Airport and cruise pier delivery | Public listings say OJ's delivers to airports and cruise piers. Sangster and Montego Bay Cruise Port show "Delivery on request"; the rest show "Ask about delivery". **Confirm locations and fees.** |
| WhatsApp number | **Missing.** Site falls back to call and email. |
| Logo | **Placeholder** "OJ'S" wordmark. Swap in the real logo. |
| 4 vehicles (Toyota Allion, Toyota Voxy, Toyota Mark X, Subaru Impreza) | **Real OJ's vehicles** from their Instagram posts of June 2019, each posted "For Sale & Rent". Photos cut from your screen recording. The site labels them "Photos: OJ's Instagram, June 2019" and asks visitors to check what is on the lot today. **Confirm which are still available, or send current stock.** |
| Vehicle specs | Standard figures for each model (seats, gearbox, fuel, A/C). Year and mileage unknown, shown as "Ask OJ's". |
| Prices | None shown. "Rates on request" / "Price on request" until OJ's gives real prices. (A 2019 post said "from US$55 a day"; left off because it is out of date.) |
| Hero video | Real footage of OJ's lot from their 2019 Instagram, stabilised and looped. Low resolution by today's standards; replace with new footage when possible. |
| Scroll story images | The lot footage plus OJ's own car photos. No stock or AI images. |
| Map | Live Google Maps embed of the address, plus an "Open in Google Maps" link. |
| Testimonials | None. Section is hidden until real reviews are added. |
| Booking | **Not live.** Search and reserve buttons prepare an inquiry the visitor sends by email or phone. Nothing is booked or charged. |
| Brand line, About copy | From the brief. |
| Name on legal footer | Uses "OJ's Auto Sales & Rental". The 2019 business card says "OJ's Auto Sales and Car Rentals Ltd". **Ask which one OJ's wants.** |

## Questions for OJ's before launch

1. Which business name goes in the footer?
2. Logo file (SVG or high-res PNG).
3. Which number is on WhatsApp?
4. Confirm hours and the delivery locations and fees.
5. Current fleet: make, model, year, seats, transmission, daily rate, photos.
6. Cars for sale: details, prices, photos.
7. Rental terms: minimum age, licence, deposit, insurance.
8. Do they still take cards and split payments? (2019 posts said yes; not shown on the site until confirmed.)
9. Real Google reviews they are happy to show.

## Asset licences

| Asset | Licence |
|---|---|
| Archivo (display font) | SIL Open Font License 1.1 |
| Geist and Geist Mono | SIL Open Font License 1.1 |
| Phosphor icons | MIT |
| Car photos and lot video | OJ's own Instagram content (@ojautosales_rental). Get OJ's OK to use them on the site, which they will normally give as it is their own material. |

## Deferred to Phase 2

- Booking backend: real availability, double-booking prevention, booking references and statuses
- Admin dashboard: fleet, pricing, reservations, sales listings, content editing
- Login and role-based access
- Email confirmations
- Payments (only with a verified provider)
- Separate pages: Explore Jamaica, Gallery, FAQ, Rental Terms, Privacy Policy, full sales catalogue with filters
- Fresh photos of the current fleet (a phone shoot, 4 angles per car, is enough)
- Optional interactive 3D viewer once real 3D models of OJ's cars exist
- Pre-rendered vehicle pages for SEO (vehicle detail pages are client-side hash routes in Phase 1)
