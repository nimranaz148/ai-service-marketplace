import type { Booking } from "@/lib/contracts";
import { personas } from "./personas";

export const bookings: Booking[] = [
  { id: "bk-01", token: "BK-4821", customerId: personas.customer.id, providerId: "prov-02", slotId: "slot-prov-02-0-2", status: "en_route", pricePkr: 2800, createdAt: "2026-09-10T08:30:00Z" },
  { id: "bk-02", token: "BK-4790", customerId: personas.customer.id, providerId: "prov-03", slotId: "slot-prov-03-0-0", status: "confirmed", pricePkr: 2000, createdAt: "2026-09-10T07:15:00Z" },
  { id: "bk-03", token: "BK-4655", customerId: personas.customer.id, providerId: "prov-07", slotId: "slot-prov-07-1-3", status: "arrived", pricePkr: 3500, createdAt: "2026-09-09T14:00:00Z" },
  { id: "bk-04", token: "BK-4501", customerId: personas.customer.id, providerId: "prov-05", slotId: "slot-prov-05-2-1", status: "completed", pricePkr: 1600, createdAt: "2026-09-05T10:00:00Z" },
  { id: "bk-05", token: "BK-4410", customerId: personas.customer.id, providerId: "prov-10", slotId: "slot-prov-10-1-4", status: "cancelled", pricePkr: 12000, createdAt: "2026-09-03T09:00:00Z" },
];
