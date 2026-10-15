/**
 * OJ's vehicles, taken from OJ's own Instagram posts (@ojautosales_rental, June 2019).
 * Each post said "For Sale & Rent". These are real OJ's vehicles, but the photos are from 2019,
 * so the site says so and asks visitors to check what is on the lot today.
 *
 * Specs are the standard figures for each model (seats, gearbox, fuel). Year, mileage and
 * price are unknown, so they stay null and the site shows "Ask OJ's" / "Rates on request".
 *
 * Replace or extend this list when OJ's sends current stock. UI code reads it only through lib/vehicles.ts.
 */
import allionFront from '../assets/cars/allion-front.webp';
import allionRear from '../assets/cars/allion-rear.webp';
import allionTop from '../assets/cars/allion-top.webp';
import allionInterior from '../assets/cars/allion-interior.webp';
import markxFront from '../assets/cars/markx-front.webp';
import markxSide from '../assets/cars/markx-side.webp';
import markxInterior from '../assets/cars/markx-interior.webp';
import voxyFront from '../assets/cars/voxy-front.webp';
import voxyRear from '../assets/cars/voxy-rear.webp';
import voxyInterior from '../assets/cars/voxy-interior.webp';
import imprezaFront from '../assets/cars/impreza-front.webp';
import imprezaSide from '../assets/cars/impreza-side.webp';
import imprezaRear from '../assets/cars/impreza-rear.webp';
import imprezaInterior from '../assets/cars/impreza-interior.webp';

export type VehicleCategory = 'economy' | 'sedan' | 'hatchback' | 'suv' | 'van';
/** 'both' = offered for rent and for sale. */
export type ListingType = 'rental' | 'sale' | 'both';

export interface VehiclePhoto {
  src: string;
  /** Angle label shown on the view buttons, e.g. "Front", "Interior". */
  label: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  colour: string;
  year: number | null;
  category: VehicleCategory;
  listing: ListingType;
  transmission: 'Automatic' | 'Manual';
  seats: number;
  luggage: number | null;
  aircon: boolean;
  fuel: 'Petrol' | 'Diesel' | 'Hybrid';
  /** null = "Rates on request" */
  dailyRate: number | null;
  /** null = "Price on request" */
  salePrice: number | null;
  mileage: number | null;
  images: VehiclePhoto[];
  /** Optional GLB/GLTF for a future 3D viewer. */
  modelUrl: string | null;
  /** Where the photos came from. Shown to visitors. */
  source: string;
  /** false until OJ's confirms the vehicle is currently available. */
  confirmedAvailable: boolean;
  summary: string;
}

const source = "OJ's Instagram, June 2019";

export const vehicles: Vehicle[] = [
  {
    id: 'toyota-allion',
    make: 'Toyota',
    model: 'Allion',
    colour: 'Silver',
    year: null,
    category: 'sedan',
    listing: 'both',
    transmission: 'Automatic',
    seats: 5,
    luggage: 3,
    aircon: true,
    fuel: 'Petrol',
    dailyRate: null,
    salePrice: null,
    mileage: null,
    images: [
      { src: allionFront, label: 'Front' },
      { src: allionRear, label: 'Rear' },
      { src: allionTop, label: 'Above' },
      { src: allionInterior, label: 'Interior' },
    ],
    modelUrl: null,
    source,
    confirmedAvailable: false,
    summary: 'A comfortable four-door for airport runs, town errands and the drive along the north coast.',
  },
  {
    id: 'toyota-voxy',
    make: 'Toyota',
    model: 'Voxy',
    colour: 'Dark blue',
    year: null,
    category: 'van',
    listing: 'both',
    transmission: 'Automatic',
    seats: 8,
    luggage: 4,
    aircon: true,
    fuel: 'Petrol',
    dailyRate: null,
    salePrice: null,
    mileage: null,
    images: [
      { src: voxyFront, label: 'Front' },
      { src: voxyRear, label: 'Rear' },
      { src: voxyInterior, label: 'Interior' },
    ],
    modelUrl: null,
    source,
    confirmedAvailable: false,
    summary: 'Sliding doors, three rows and room for the whole family plus the suitcases.',
  },
  {
    id: 'toyota-mark-x',
    make: 'Toyota',
    model: 'Mark X',
    colour: 'Pearl white',
    year: null,
    category: 'sedan',
    listing: 'both',
    transmission: 'Automatic',
    seats: 5,
    luggage: 3,
    aircon: true,
    fuel: 'Petrol',
    dailyRate: null,
    salePrice: null,
    mileage: null,
    images: [
      { src: markxFront, label: 'Front' },
      { src: markxSide, label: 'Side' },
      { src: markxInterior, label: 'Interior' },
    ],
    modelUrl: null,
    source,
    confirmedAvailable: false,
    summary: 'A longer, lower sedan with a smooth, quiet ride. Smart enough for a wedding, easy on a long drive.',
  },
  {
    id: 'subaru-impreza',
    make: 'Subaru',
    model: 'Impreza',
    colour: 'Black',
    year: null,
    category: 'hatchback',
    listing: 'both',
    transmission: 'Automatic',
    seats: 5,
    luggage: 2,
    aircon: true,
    fuel: 'Petrol',
    dailyRate: null,
    salePrice: null,
    mileage: null,
    images: [
      { src: imprezaFront, label: 'Front' },
      { src: imprezaSide, label: 'Side' },
      { src: imprezaRear, label: 'Rear' },
      { src: imprezaInterior, label: 'Interior' },
    ],
    modelUrl: null,
    source,
    confirmedAvailable: false,
    summary: 'A practical hatchback with a big boot opening. Easy to park in town, steady on country roads.',
  },
];
