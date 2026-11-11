import type { Provider, ProviderSlot } from "@/lib/contracts";

export const providers: Provider[] = [
  { id: "prov-01", name: "Tariq Mehmood", category: "ac", city: "isb", area: "Sector G-13", rating: 4.9, jobsCompleted: 142, priceLabel: "from PKR 2,500", verified: true, active: true },
  { id: "prov-02", name: "Imran Baig", category: "ac", city: "khi", area: "Gulshan-e-Iqbal", rating: 4.8, jobsCompleted: 185, priceLabel: "from PKR 2,500", verified: true, active: true },
  { id: "prov-03", name: "Kashif Siddiqui", category: "electrician", city: "khi", area: "Gulshan-e-Iqbal", rating: 4.7, jobsCompleted: 210, priceLabel: "from PKR 2,000", verified: true, active: true },
  { id: "prov-04", name: "Naveed Akhtar", category: "electrician", city: "isb", area: "Sector G-13", rating: 4.8, jobsCompleted: 110, priceLabel: "from PKR 1,800", verified: true, active: true },
  { id: "prov-05", name: "Arshad Hussain", category: "plumber", city: "khi", area: "Gulistan-e-Johar", rating: 4.7, jobsCompleted: 98, priceLabel: "from PKR 1,500", verified: true, active: true },
  { id: "prov-06", name: "Rafiq Masih", category: "plumber", city: "isb", area: "Sector F-10", rating: 4.6, jobsCompleted: 75, priceLabel: "from PKR 1,500", verified: true, active: true },
  { id: "prov-07", name: "Bushra Cleaning Co.", category: "cleaner", city: "khi", area: "North Nazimabad", rating: 4.9, jobsCompleted: 310, priceLabel: "from PKR 3,500", verified: true, active: true },
  { id: "prov-08", name: "Capital Deep Clean", category: "cleaner", city: "isb", area: "Sector F-10", rating: 4.9, jobsCompleted: 215, priceLabel: "from PKR 3,500", verified: true, active: true },
  { id: "prov-09", name: "Dr. Usman Farooq", category: "tutor", city: "lhe", area: "Johar Town", rating: 5.0, jobsCompleted: 89, priceLabel: "from PKR 15,000 / mo", verified: true, active: true },
  { id: "prov-10", name: "Sana Tutors", category: "tutor", city: "khi", area: "Clifton", rating: 4.8, jobsCompleted: 64, priceLabel: "from PKR 12,000 / mo", verified: true, active: false },
];

const TIMES = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM", "06:00 PM"];

/** 3 upcoming dates x 5 times per provider; deterministic ids. */
export const providerSlots: ProviderSlot[] = providers.flatMap((p) =>
  [0, 1, 2].flatMap((d) =>
    TIMES.map((time, ti) => ({
      id: `slot-${p.id}-${d}-${ti}`,
      providerId: p.id,
      date: `2026-09-${String(11 + d).padStart(2, "0")}`,
      time,
      booked: false,
    })),
  ),
);
