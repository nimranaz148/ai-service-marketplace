"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, Phone, MapPin, Navigation, CheckCircle2, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { api, type ProviderBooking } from "@/lib/api";

const STATUS_STYLE: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  arrived: "bg-[#292212] text-[#D4A843] border-[#473B1F]",
  en_route: "bg-[#0E202B] text-[#38BDF8] border-[#18394D]",
  confirmed: "bg-[#111118] text-zinc-400 border-white/8",
  cancelled: "bg-[#291316] text-[#EF4444] border-[#471E23]",
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/provider"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111118] border border-white/8 text-xs font-semibold text-zinc-400 hover:text-[#D4A843] transition-colors"
          >
            <ChevronLeft size={14} />
            <span>Dashboard</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="font-display font-bold text-base text-white flex items-center gap-2">
            <CalendarCheck size={18} className="text-[#D4A843]" />
            <span>Bookings</span>
          </span>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#292212] border border-[#473B1F] text-[#D4A843] font-code text-xs font-bold">
          {activeCount} Active
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-xs text-zinc-500">
          <Loader2 size={14} className="animate-spin" /> Loading your bookings…
        </div>
      ) : bookings.length === 0 ? (
        <div className="py-10 text-center text-xs text-zinc-500">No bookings yet.</div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="p-6 rounded-3xl bg-[#111118] border border-white/8 hover:border-[#D4A843]/40 transition-all shadow-[0_16px_40px_rgba(0,0,0,0.3)] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-xl bg-[#141420] border border-white/10 text-[#38BDF8] font-code font-bold text-xs">
                    {booking.confirmation_code}
                  </span>
                  <span className="font-display font-bold text-base text-white">
                    {booking.customer?.name ?? "Customer"}
                  </span>
                </div>
                {booking.slot ? (
                  <span className="text-xs text-zinc-400 font-code">
                    {booking.slot.slot_date} · {booking.slot.slot_time}
                  </span>
                ) : null}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-zinc-300">
                    <MapPin size={14} className="text-[#38BDF8] shrink-0 mt-0.5" />
                    <span>{booking.customer?.area ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 font-code">
                    <Phone size={13} className="text-[#D4A843]" />
                    <span>
                      Phone: <strong className="text-white">{booking.customer?.phone ?? "—"}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-code text-[11px] text-zinc-400">Status:</span>
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
                      className="h-9 px-4 rounded-xl bg-[#0E202B] hover:bg-[#153142] text-[#38BDF8] border border-[#18394D] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Navigation size={13} />
                      <span>Mark On The Way</span>
                    </Button>
                  )}
                  {booking.status === "en_route" && (
                    <Button
                      onClick={() => void handleUpdateStatus(booking.id, "arrived")}
                      disabled={updatingId === booking.id}
                      className="h-9 px-4 rounded-xl bg-[#292212] hover:bg-[#3D331B] text-[#D4A843] border border-[#473B1F] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <MapPin size={13} />
                      <span>Mark Arrived</span>
                    </Button>
                  )}
                  {booking.status === "arrived" && (
                    <Button
                      onClick={() => void handleUpdateStatus(booking.id, "completed")}
                      disabled={updatingId === booking.id}
                      className="h-9 px-4 rounded-xl bg-[#0054F9] hover:bg-[#0043C7] text-white font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 size={14} />
                      <span>Mark Completed</span>
                    </Button>
                  )}
                  {booking.status === "completed" && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-code font-semibold px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
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
