import { Wind, Droplets, Zap, Sparkles, GraduationCap, type LucideIcon } from "lucide-react";
import type { ProviderCategory } from "@/lib/contracts";

export const TRADES: { id: ProviderCategory; label: string; blurb: string; Icon: LucideIcon }[] = [
  { id: "ac", label: "AC & refrigeration", blurb: "Cooling faults, gas top-up, servicing.", Icon: Wind },
  { id: "plumber", label: "Plumbing & sanitary", blurb: "Leaks, motors, fittings, drainage.", Icon: Droplets },
  { id: "electrician", label: "Electrical & UPS", blurb: "Wiring, breakers, inverters, backup.", Icon: Zap },
  { id: "cleaner", label: "Home cleaning", blurb: "Deep cleans, sofa wash, post-work tidy.", Icon: Sparkles },
  { id: "tutor", label: "Tutoring", blurb: "School subjects, O/A-levels, at home or online.", Icon: GraduationCap },
];
