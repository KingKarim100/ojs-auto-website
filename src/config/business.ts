/**
 * OJ's Auto Sales & Rental - single source of truth for business details.
 * Components must read from here. Never hardcode these values elsewhere.
 *
 * `confirmed: false` marks anything not yet verified directly with OJ's.
 */

export type DeliveryStatus = 'on-request' | 'ask';

export interface DeliveryLocation {
  id: string;
  name: string;
  area: string;
  /** on-request: OJ's public listings mention delivery here. ask: not verified. */
  status: DeliveryStatus;
}

export interface HoursRow {
  days: string;
  open: string;
}

export const business = {
  name: "OJ's Auto Sales & Rental",
  shortName: "OJ's",
  /** Registered name seen on a 2019 business card. Confirm which name OJ's wants in the legal footer. */
  legalName: "OJ's Auto Sales & Rental",
  address: {
    street: '27 The Queens Drive',
    city: 'Montego Bay',
    parish: 'St. James',
    country: 'Jamaica',
    countryCode: 'JM',
  },
  phones: [
    { label: 'Main line', display: '+1 876-351-6144', e164: '+18763516144' },
    { label: 'Second line', display: '+1 876-622-4629', e164: '+18766224629' },
  ],
  email: 'info@ojsauto.com',
  domain: 'ojsauto.com',
  /**
   * WhatsApp number is NOT confirmed. While null, the site never shows a WhatsApp link
   * and falls back to call and email. Set an E.164 number without "+" (e.g. "18763516144")
   * only after OJ's confirms which line is on WhatsApp.
   */
  whatsapp: null as string | null,
  social: {
    instagram: { handle: '@ojautosales_rental', url: 'https://www.instagram.com/ojautosales_rental/' },
    facebook: { handle: 'ojsautosales', url: 'https://www.facebook.com/ojsautosales/' },
  },
  /**
   * Hours taken from public listings (Google, Tripadvisor, Facebook), which vary slightly.
   * confirmed: false until OJ's verifies them.
   */
  hours: {
    confirmed: false,
    rows: [
      { days: 'Monday to Saturday', open: '8:30 AM to 6:30 PM' },
      { days: 'Sunday', open: '9:00 AM to 6:00 PM' },
    ] as HoursRow[],
    note: 'Holiday hours may differ. Call ahead to confirm.',
  },
  pickupLocations: [
    { id: 'office', name: "OJ's office", area: '27 The Queens Drive, Montego Bay' },
    { id: 'sangster', name: 'Sangster International Airport', area: 'Montego Bay' },
    { id: 'mobay-cruise', name: 'Montego Bay Cruise Port', area: 'Montego Bay' },
    { id: 'falmouth-cruise', name: 'Falmouth Cruise Port', area: 'Trelawny' },
    { id: 'hotel', name: 'Hotel or villa', area: 'Montego Bay area' },
    { id: 'other', name: 'Other location', area: 'Tell us where' },
  ],
  /**
   * Delivery locations. Public listings say OJ's delivers to airports and cruise ship piers;
   * specific locations, fees and hours are still to be confirmed by OJ's.
   */
  deliveryLocations: [
    { id: 'sangster', name: 'Sangster International Airport', area: 'Montego Bay', status: 'on-request' },
    { id: 'mobay-cruise', name: 'Montego Bay Cruise Port', area: 'Montego Bay', status: 'on-request' },
    { id: 'falmouth-cruise', name: 'Falmouth Cruise Port', area: 'Trelawny', status: 'ask' },
    { id: 'hotels', name: 'Hotels and villas', area: 'Montego Bay area', status: 'ask' },
    { id: 'kingston', name: 'Norman Manley International Airport', area: 'Kingston', status: 'ask' },
  ] as DeliveryLocation[],
} as const;

export function mapsUrl(): string {
  const q = encodeURIComponent(`${business.address.street}, ${business.address.city}, ${business.address.country}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function mapsEmbedUrl(): string {
  const q = encodeURIComponent(`${business.address.street}, ${business.address.city}, ${business.address.country}`);
  return `https://www.google.com/maps?q=${q}&output=embed`;
}
