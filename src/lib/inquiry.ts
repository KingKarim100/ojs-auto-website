import { business } from '../config/business';

/**
 * Inquiry message builder. Produces the prefilled text plus every contact channel
 * that is actually confirmed. WhatsApp is only offered once business.whatsapp is set.
 *
 * Never put ID numbers, licence numbers or payment details into these messages or URLs.
 */

export type InquiryKind = 'rental' | 'sale' | 'airport' | 'general';

export interface RentalInquiry {
  kind: 'rental';
  vehicle?: string;
  pickupDate?: string;
  pickupTime?: string;
  returnDate?: string;
  returnTime?: string;
  pickupLocation?: string;
  returnLocation?: string;
  category?: string;
}
export interface SaleInquiry {
  kind: 'sale';
  vehicle: string;
}
export interface AirportInquiry {
  kind: 'airport';
  date: string;
  time?: string;
  location: string;
  travelRef?: string;
  vehicle?: string;
  passengers?: string;
  name?: string;
}
export interface GeneralInquiry {
  kind: 'general';
}
export type Inquiry = RentalInquiry | SaleInquiry | AirportInquiry | GeneralInquiry;

export function formatDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(t?: string): string {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  if (Number.isNaN(h)) return t;
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${((h + 11) % 12) + 1}:${String(m ?? 0).padStart(2, '0')} ${suffix}`;
}

export function buildMessage(q: Inquiry): { subject: string; body: string } {
  switch (q.kind) {
    case 'rental': {
      const what = q.vehicle ?? (q.category ? `a ${q.category.toLowerCase()}` : 'a vehicle');
      const from = [formatDate(q.pickupDate), formatTime(q.pickupTime)].filter(Boolean).join(' at ');
      const to = [formatDate(q.returnDate), formatTime(q.returnTime)].filter(Boolean).join(' at ');
      let body = `Hello OJ's, I'm interested in renting ${what}`;
      if (from && to) body += ` from ${from} to ${to}`;
      body += '. Can you confirm availability and pricing?';
      if (q.pickupLocation) body += `\nPickup: ${q.pickupLocation}`;
      if (q.returnLocation) body += `\nReturn: ${q.returnLocation}`;
      return { subject: `Rental inquiry: ${what}`, body };
    }
    case 'sale':
      return {
        subject: `Vehicle inquiry: ${q.vehicle}`,
        body: `Hello OJ's, I'm interested in the ${q.vehicle} listed on your website. Is it still available?`,
      };
    case 'airport': {
      let body = `Hello OJ's, I'm arriving in Jamaica on ${formatDate(q.date)}`;
      if (q.time) body += ` at ${formatTime(q.time)}`;
      body += `, at ${q.location}, and would like to inquire about vehicle delivery.`;
      if (q.travelRef) body += `\nFlight or cruise: ${q.travelRef}`;
      if (q.vehicle) body += `\nVehicle preference: ${q.vehicle}`;
      if (q.passengers) body += `\nPassengers: ${q.passengers}`;
      if (q.name) body += `\nName: ${q.name}`;
      return { subject: `Airport / cruise delivery inquiry: ${formatDate(q.date)}`, body };
    }
    default:
      return { subject: 'Inquiry from ojsauto.com', body: "Hello OJ's, I have a question about renting or buying a vehicle." };
  }
}

export interface Channels {
  whatsapp: string | null;
  mailto: string;
  tel: { display: string; href: string }[];
}

export function channelsFor(q: Inquiry): Channels {
  const { subject, body } = buildMessage(q);
  return {
    whatsapp: business.whatsapp ? `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(body)}` : null,
    mailto: `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    tel: business.phones.map((p) => ({ display: p.display, href: `tel:${p.e164}` })),
  };
}
