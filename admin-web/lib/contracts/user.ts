import type { CityId } from "./city";
import type { ProviderCategory } from "./provider";

export type UserRole = "admin" | "provider" | "customer";

export interface AppUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  city: CityId;
  area: string;
  avatarInitials: string;
  category?: ProviderCategory; // providers only
}
