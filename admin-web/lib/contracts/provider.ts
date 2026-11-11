import type { CityId } from "./city";

export type ProviderCategory = "ac" | "plumber" | "electrician" | "cleaner" | "tutor";

export const PROVIDER_CATEGORY_LABEL: Record<ProviderCategory, string> = {
  ac: "AC Technician",
  plumber: "Plumber",
  electrician: "Electrician",
  cleaner: "Cleaner",
  tutor: "Tutor",
};

/**
 * Reverse of PROVIDER_CATEGORY_LABEL. The backend seed stores the human label
 * (`"AC Technician"`); the frontend contract stores the id (`"ac"`). Phase 0 locks
 * the schema, so this adapter is the mitigation for that mismatch.
 */
export const PROVIDER_CATEGORY_FROM_LABEL: Record<string, ProviderCategory> = Object.fromEntries(
  (Object.entries(PROVIDER_CATEGORY_LABEL) as [ProviderCategory, string][]).map(([id, label]) => [label, id]),
);

/**
 * The backend seed stores one combined location string (`"Sector G-13, Islamabad"`);
 * the frontend contract splits it into `area` + a `city` id. Splits on the LAST comma
 * so multi-comma areas keep their commas.
 */
export function splitCityArea(combined: string): { area: string; cityName: string } {
  const i = combined.lastIndexOf(",");
  if (i === -1) return { area: combined.trim(), cityName: "" };
  return { area: combined.slice(0, i).trim(), cityName: combined.slice(i + 1).trim() };
}

export interface Provider {
  id: string;
  name: string;
  category: ProviderCategory;
  city: CityId;
  area: string;
  rating: number;
  jobsCompleted: number;
  priceLabel: string;
  verified: boolean;
  active: boolean;
}

export interface ProviderSlot {
  id: string;
  providerId: string;
  date: string; // ISO date
  time: string; // "09:00 AM"
  booked: boolean;
}

export interface ProviderStats {
  providerId: string;
  upcomingJobs: number;
  monthlyEarningsPkr: number;
  rating: number;
  onTimeRate: number; // 0..1
}
