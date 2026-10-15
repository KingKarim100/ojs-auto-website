import { useSyncExternalStore } from 'react';
import type { VehicleCategory } from '../data/vehicles';
import { getVehicles } from './vehicles';
import type { Inquiry, RentalInquiry } from './inquiry';

/** Small shared UI store. Subscribe with useUI(selector). */

export interface InquiryRequest {
  open: boolean;
  payload: Inquiry | null;
  title: string;
}

export interface UIState {
  selectedId: string;
  /** index into the selected vehicle's photos */
  photo: number;
  filter: VehicleCategory | 'all';
  zoom: number;
  inquiry: InquiryRequest;
  searchNotice: string | null;
  /** Last validated rental search, reused when the visitor reserves a specific car. */
  search: RentalInquiry | null;
  route: { name: 'home' } | { name: 'vehicle'; id: string };
}

let ui: UIState = {
  selectedId: getVehicles()[0].id,
  photo: 0,
  filter: 'all',
  zoom: 0,
  inquiry: { open: false, payload: null, title: '' },
  searchNotice: null,
  search: null,
  route: { name: 'home' },
};

const listeners = new Set<() => void>();

export function getUI(): UIState {
  return ui;
}

export function setUI(patch: Partial<UIState> | ((s: UIState) => Partial<UIState>)): void {
  const next = typeof patch === 'function' ? patch(ui) : patch;
  ui = { ...ui, ...next };
  listeners.forEach((l) => l());
}

function subscribe(l: () => void): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useUI<T>(selector: (s: UIState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(ui),
    () => selector(ui),
  );
}

export function selectVehicle(id: string): void {
  if (ui.selectedId === id) return;
  setUI({ selectedId: id, photo: 0, zoom: 0 });
}

export function openInquiry(payload: Inquiry, title: string): void {
  setUI({ inquiry: { open: true, payload, title } });
}

export function closeInquiry(): void {
  setUI((s) => ({ inquiry: { ...s.inquiry, open: false } }));
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

export function smoothScrollTo(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}
