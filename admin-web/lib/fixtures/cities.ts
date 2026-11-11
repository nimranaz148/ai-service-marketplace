import type { City, CityId } from "@/lib/contracts";

export const cities: City[] = [
  { id: "isb", name: "Islamabad", areas: ["Sector G-13", "Sector G-11", "Sector F-10", "Sector F-11", "Sector I-8", "Blue Area", "Bahria Town"] },
  { id: "khi", name: "Karachi", areas: ["Gulshan-e-Iqbal", "DHA Phase 5", "Clifton", "PECHS", "Gulistan-e-Johar", "North Nazimabad"] },
  { id: "lhe", name: "Lahore", areas: ["DHA Phase 5", "Gulberg", "Model Town", "Johar Town", "Bahria Town"] },
];

export const cityById = Object.fromEntries(cities.map((c) => [c.id, c])) as Record<CityId, City>;
