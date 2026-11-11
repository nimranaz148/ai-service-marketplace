import type { AppUser, UserRole } from "@/lib/contracts";

export const personas: Record<UserRole, AppUser> = {
  admin: {
    id: "usr-admin-01", role: "admin", name: "Ayesha Malik",
    email: "ayesha.malik@atelier.pk", phone: "+92 51 888 2040",
    city: "isb", area: "Blue Area", avatarInitials: "AM",
  },
  provider: {
    id: "usr-prov-01", role: "provider", name: "Tariq Mehmood",
    email: "tariq.mehmood@atelier.pk", phone: "+92 301 555 4321",
    city: "isb", area: "Sector G-13", avatarInitials: "TM", category: "ac",
  },
  customer: {
    id: "usr-cust-01", role: "customer", name: "Zubair Khan",
    email: "zubair.khan@gmail.com", phone: "+92 300 987 6543",
    city: "khi", area: "Gulshan-e-Iqbal", avatarInitials: "ZK",
  },
};

export const personaList: AppUser[] = Object.values(personas);
