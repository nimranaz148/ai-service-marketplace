"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Calendar, Clock, ChevronLeft, Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api, type ProviderSlotItem, type ProviderBooking } from "@/lib/api";

/**
 * Real availability management against /me/provider/slots. No "off-duty" /
 * buffer-minutes / emergency-overtime controls — the backend has no such
 * concept yet (a slot either exists and is open, exists and is booked, or
 * doesn't exist), so this doesn't pretend those settings persist.
 */
export default function ProviderSlotsPage() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<ProviderSlotItem[]>([]);
  const [bookings, setBookings] = useState<ProviderBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("09:00 AM");
  const [saving, setSaving] = useState(false);

  async function refresh() {
    try {
      const [s, b] = await Promise.all([api.getMySlots(user?.id), api.getMyBookings(user?.id)]);
      setSlots(s);
      setBookings(b);
      setSelectedDate((cur) => cur ?? s[0]?.slot_date ?? null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const days = useMemo(() => Array.from(new Set(slots.map((s) => s.slot_date))).sort(), [slots]);
  const daySlots = useMemo(
    () => slots.filter((s) => s.slot_date === selectedDate).sort((a, b) => a.slot_time.localeCompare(b.slot_time)),
    [slots, selectedDate],
  );
  const customerBySlot = useMemo(() => {
    const map = new Map<string, ProviderBooking>();
    for (const b of bookings) if (b.slot_id) map.set(b.slot_id, b);
    return map;
  }, [bookings]);

  async function handleAddSlot(e: React.FormEvent) {
    e.preventDefault();
    if (!newDate || !newTime) return;
    setSaving(true);
    try {
      await api.createMySlot(newDate, newTime, user?.id);
      toast.success(`Slot added for ${newDate} at ${newTime}.`);
      setSelectedDate(newDate);
      await refresh();
    } catch {
      toast.error("Could not add that slot.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteSlot(slot: ProviderSlotItem) {
    if (slot.is_booked) {
      toast.error("This slot is booked and can't be removed.");
      return;
    }
    try {
      await api.deleteMySlot(slot.id, user?.id);
      toast.info(`Slot ${slot.slot_time} removed.`);
      await refresh();
    } catch {
      toast.error("Could not remove that slot.");
    }
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/dashboard/provider"
              className="inline-flex items-center gap-1 text-xs font-code text-ink-muted hover:text-accent transition-colors"
            >
              <ChevronLeft size={14} /> Dashboard
            </Link>
            <span className="text-ink-muted">/</span>
            <span className="text-xs font-code text-status-warn uppercase tracking-wider">Availability</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink tracking-tight">
            Appointment Slots
          </h1>
        </div>
      </div>

      {/* Add slot */}
      <form onSubmit={handleAddSlot} className="flex flex-wrap items-end gap-3 rounded-2xl bg-surface-raised border border-hairline p-4">
        <div>
          <label className="block text-[11px] font-semibold text-ink-muted uppercase tracking-wider mb-1">Date</label>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            required
            className="h-10 px-3 rounded-xl bg-surface border border-hairline text-xs text-ink outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink-muted uppercase tracking-wider mb-1">Time</label>
          <input
            type="text"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            placeholder="09:00 AM"
            required
            className="h-10 px-3 rounded-xl bg-surface border border-hairline text-xs text-ink outline-none focus:border-accent"
          />
        </div>
        <Button type="submit" disabled={saving} className="h-10 bg-primary hover:bg-[var(--accent-strong-hover)] text-accent-ink text-xs font-display font-bold flex items-center gap-1.5">
          <Plus size={14} /> Add Slot
        </Button>
      </form>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-xs text-ink-muted">
          <Loader2 size={14} className="animate-spin" /> Loading your availability…
        </div>
      ) : days.length === 0 ? (
        <div className="py-10 text-center text-xs text-ink-muted">No slots yet — add one above.</div>
      ) : (
        <>
          {/* Day selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {days.map((date) => {
              const count = slots.filter((s) => s.slot_date === date).length;
              const bookedCount = slots.filter((s) => s.slot_date === date && s.is_booked).length;
              const isSelected = date === selectedDate;
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-1 min-w-[110px] p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    isSelected ? "bg-accent-tint border-status-live-line" : "bg-surface-raised border-hairline hover:border-ink-muted"
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5 text-xs font-display font-bold text-ink">
                    <Calendar size={12} /> {date}
                  </span>
                  <span className="mt-1 block text-[10px] text-ink-muted">
                    {count} slot{count === 1 ? "" : "s"} · {bookedCount} booked
                  </span>
                </button>
              );
            })}
          </div>

          {/* Slots for selected day */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {daySlots.map((slot) => {
              const booking = customerBySlot.get(slot.id);
              return (
                <div
                  key={slot.id}
                  className={`rounded-2xl border p-4 ${
                    slot.is_booked ? "bg-status-warn-tint border-status-warn-line" : "bg-surface-raised border-hairline"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                      <Clock size={13} /> {slot.slot_time}
                    </span>
                    {!slot.is_booked && (
                      <button
                        onClick={() => void handleDeleteSlot(slot)}
                        title="Remove slot"
                        className="text-ink-muted hover:text-status-stop transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-ink-muted">
                    {slot.is_booked ? `Booked — ${booking?.customer?.name ?? "customer"}` : "Open"}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
