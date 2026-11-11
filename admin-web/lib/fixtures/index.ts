export { personas, personaList } from "./personas";
export { cities, cityById } from "./cities";
export { providers, providerSlots } from "./providers";
export { bookings } from "./bookings";
export { sessions } from "./sessions";

import { personas } from "./personas";
import { cities } from "./cities";
import { providers, providerSlots } from "./providers";
import { bookings } from "./bookings";
import { sessions } from "./sessions";

/** Single accessor so later phases swap this import for a fetch with one edit per call site. */
export function getFixtures() {
  return { personas, cities, providers, providerSlots, bookings, sessions };
}
