import type { CityId } from "./city";

export type ProviderCategory = "ac" | "plumber" | "electrician" | "cleaner" | "tutor";

export const PROVIDER_CATEGORY_LABEL: Record<ProviderCategory, string> = {
  ac: "AC Technician",
  plumber: "Plumber",
  electrician: "Electrician",
  cleaner: "Cleaner",
  tutor: "Tutor",
};

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
