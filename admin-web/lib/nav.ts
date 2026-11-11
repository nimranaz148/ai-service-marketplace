import type { UserRole } from "@/lib/contracts";

export const NAV: Record<UserRole, { href: string; label: string }[]> = {
  admin: [
    { href: "/dashboard/admin", label: "Overview" },
    { href: "/dashboard/admin/customers", label: "Customers" },
    { href: "/dashboard/admin/providers", label: "Providers" },
    { href: "/traces", label: "Agent traces" },
    { href: "/bookings", label: "Bookings" },
    { href: "/dashboard/admin/settings", label: "Settings" },
  ],
  provider: [
    { href: "/dashboard/provider", label: "Today" },
    { href: "/dashboard/provider/bookings", label: "Assigned jobs" },
    { href: "/dashboard/provider/services", label: "Services" },
    { href: "/dashboard/provider/slots", label: "Availability" },
  ],
  customer: [
    { href: "/dashboard/customer", label: "Home" },
    { href: "/dashboard/customer/providers", label: "Find artisans" },
    { href: "/dashboard/customer/bookings", label: "My bookings" },
    { href: "/dashboard/customer/profile", label: "Addresses" },
  ],
};

const PREFIX: Record<string, UserRole> = {
  "/dashboard/admin": "admin",
  "/traces": "admin",
  "/bookings": "admin",
  "/services": "admin",
  "/dashboard/provider": "provider",
  "/dashboard/customer": "customer",
};

export function routeRole(pathname: string): UserRole | null {
  const hit = Object.keys(PREFIX).find((p) => pathname === p || pathname.startsWith(p + "/"));
  return hit ? PREFIX[hit] : null;
}
