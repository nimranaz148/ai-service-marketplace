export type BookingStatus =
  | "confirmed"
  | "en_route"
  | "arrived"
  | "completed"
  | "cancelled";

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  confirmed: "Confirmed",
  en_route: "En route",
  arrived: "Arrived",
  completed: "Completed",
  cancelled: "Cancelled",
};

export interface Booking {
  id: string;
  token: string; // "BK-4821"
  customerId: string;
  providerId: string;
  slotId: string;
  status: BookingStatus;
  pricePkr: number;
  createdAt: string; // ISO datetime
}
