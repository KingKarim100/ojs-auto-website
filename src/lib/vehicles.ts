import { vehicles, type Vehicle, type VehicleCategory, type ListingType } from '../data/vehicles';

/**
 * Data access layer. UI components call these functions only, never the raw data file,
 * so a database or API can replace data/vehicles.ts later without touching the UI.
 */

const matchesListing = (v: Vehicle, l: Exclude<ListingType, 'both'>) => v.listing === l || v.listing === 'both';

export function getVehicles(filter?: { category?: VehicleCategory; listing?: Exclude<ListingType, 'both'> }): Vehicle[] {
  return vehicles.filter(
    (v) => (!filter?.category || v.category === filter.category) && (!filter?.listing || matchesListing(v, filter.listing)),
  );
}

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id);
}

export const isForRent = (v: Vehicle) => matchesListing(v, 'rental');
export const isForSale = (v: Vehicle) => matchesListing(v, 'sale');

export function listingLabel(v: Vehicle): string {
  return v.listing === 'both' ? 'Rent or buy' : v.listing === 'sale' ? 'For sale' : 'Rental';
}

export const categoryLabels: Record<VehicleCategory, { label: string; plural: string; use: string }> = {
  economy: { label: 'Economy', plural: 'Economy', use: 'Easy to park, light on fuel, made for town.' },
  sedan: { label: 'Sedan', plural: 'Sedans', use: 'Comfort for airport runs and long coast drives.' },
  hatchback: { label: 'Hatchback', plural: 'Hatchbacks', use: 'Compact outside, roomy boot, easy in town.' },
  suv: { label: 'SUV', plural: 'SUVs', use: 'Ground clearance for hills and country roads.' },
  van: { label: 'Van', plural: 'Vans', use: 'Seats for the family and room for every bag.' },
};

const order: VehicleCategory[] = ['economy', 'hatchback', 'sedan', 'suv', 'van'];

/** Categories that actually have vehicles. Empty categories are never shown. */
export function getCategories(listing?: Exclude<ListingType, 'both'>): VehicleCategory[] {
  const present = new Set(getVehicles(listing ? { listing } : undefined).map((v) => v.category));
  return order.filter((c) => present.has(c));
}

export function vehicleName(v: Vehicle): string {
  return [v.year, v.make, v.model].filter(Boolean).join(' ');
}

export function rateLabel(v: Vehicle): string {
  return v.dailyRate ? `JMD ${v.dailyRate.toLocaleString('en-JM')} / day` : 'Rates on request';
}

export function priceLabel(v: Vehicle): string {
  return v.salePrice ? `JMD ${v.salePrice.toLocaleString('en-JM')}` : 'Price on request';
}
