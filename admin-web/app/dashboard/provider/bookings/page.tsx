"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, Phone, MapPin, Navigation, CheckCircle2, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { api, type ProviderBooking } from "@/lib/api";

const STATUS_STYLE: Record<string, string> = {
  completed: "bg-status-go-tint text-status-go border-status-go-line",
  arrived: "bg-status-warn-tint text-status-warn border-status-warn-line",
  en_route: "bg-status-info-tint text-accent border-status-info-line",
  confirmed: "bg-surface-raised text-ink-muted border-hairline",
  cancelled: "bg-status-stop-tint text-status-stop border-status-stop-line",
};

export default function ProviderBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<ProviderBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function refresh() {
    try {
      setBookings(await api.getMyBookings(user?.id));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function handleUpdateStatus(id: string, newStatus: "en_route" | "arrived" | "completed") {
    setUpdatingId(id);
    try {
      await api.updateMyBookingStatus(id, newStatus, user?.id);
      if (newStatus === "en_route") toast.info("Status: EN ROUTE — customer notified.");
      else if (newStatus === "arrived") toast.info("Status: ARRIVED.");
      else toast.success("Booking marked COMPLETED.");
      await refresh();
    } catch {
      toast.error("Could not update this booking's status.");
    } finally {
      setUpdatingId(null);
    }
  }

  const activeCount = bookings.filter((b) => b.status !== "completed" && b.status !== "cancelled").length;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-hairline">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/provider"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-raised border border-hairline text-xs font-semibold text-ink-muted hover:text-status-warn transition-colors"
          >
            <ChevronLeft size={14} />
            <span>Dashboard</span>
          </Link>
          <span className="text-ink-muted">/</span>
          <span className="font-display font-bold text-base text-ink flex items-center gap-2">
            <CalendarCheck size={18} className="text-status-warn" />
            <span>Bookings</span>
          </span>
        </div>

        <span className="px-3 py-1 rounded-full bg-status-warn-tint border border-status-warn-line text-status-warn font-code text-xs font-bold">
          {activeCount} Active
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-xs text-ink-muted">
          <Loader2 size={14} className="animate-spin" /> Loading your bookings…
        </div>
      ) : bookings.length === 0 ? (
        <div className="py-10 text-center text-xs text-ink-muted">No bookings yet.</div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="p-6 rounded-3xl bg-surface-raised border border-hairline hover:border-status-warn-line transition-all shadow-raised space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-hairline">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-xl bg-surface-raised border border-hairline text-accent font-code font-bold text-xs">
                    {booking.confirmation_code}
                  </span>
                  <span className="font-display font-bold text-base text-ink">
                    {booking.customer?.name ?? "Customer"}
                  </span>
                </div>
                {booking.slot ? (
                  <span className="text-xs text-ink-muted font-code">
                    {booking.slot.slot_date} · {booking.slot.slot_time}
                  </span>
                ) : null}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-ink">
                    <MapPin size={14} className="text-accent shrink-0 mt-0.5" />
                    <span>{booking.customer?.area ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink-muted font-code">
                    <Phone size={13} className="text-status-warn" />
                    <span>
                      Phone: <strong className="text-ink">{booking.customer?.phone ?? "—"}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-code text-[11px] text-ink-muted">Status:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full border text-[10px] font-code font-bold uppercase ${
                      STATUS_STYLE[booking.status] ?? STATUS_STYLE.confirmed
                    }`}
                  >
                    ● {booking.status.replace("_", " ")}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {booking.status === "confirmed" && (
                    <Button
                      onClick={() => void handleUpdateStatus(booking.id, "en_route")}
                      disabled={updatingId === booking.id}
                      className="h-9 px-4 rounded-xl bg-status-info-tint hover:bg-status-info-tint text-accent border border-status-info-line text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Navigation size={13} />
                      <span>Mark On The Way</span>
                    </Button>
                  )}
                  {booking.status === "en_route" && (
                    <Button
                      onClick={() => void handleUpdateStatus(booking.id, "arrived")}
                      disabled={updatingId === booking.id}
                      className="h-9 px-4 rounded-xl bg-status-warn-tint hover:bg-status-warn-tint text-status-warn border border-status-warn-line text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <MapPin size={13} />
                      <span>Mark Arrived</span>
                    </Button>
                  )}
                  {booking.status === "arrived" && (
                    <Button
                      onClick={() => void handleUpdateStatus(booking.id, "completed")}
                      disabled={updatingId === booking.id}
                      className="h-9 px-4 rounded-xl bg-primary hover:bg-[var(--accent-strong-hover)] text-accent-ink font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 size={14} />
                      <span>Mark Completed</span>
                    </Button>
                  )}
                  {booking.status === "completed" && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-status-go font-code font-semibold px-3 py-1 rounded-xl bg-status-go-tint border border-status-go-line">
                      <CheckCircle2 size={13} />
                      <span>Completed</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
