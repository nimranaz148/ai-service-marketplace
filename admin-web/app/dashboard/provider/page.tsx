"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { CalendarCheck, Clock, MapPin, Star, Layers, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, type MyProviderProfile, type ProviderBooking } from "@/lib/api";
import { cn } from "@/lib/utils";

/**
 * Real provider dashboard: profile, KPIs and the next booking all come from
 * /me/provider and /me/provider/bookings — no fabricated earnings, no fake
 * "NADRA Verified" badge, no scripted job card.
 */
export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = React.useState<MyProviderProfile | null>(null);
  const [bookings, setBookings] = React.useState<ProviderBooking[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [savingActive, setSavingActive] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [p, b] = await Promise.all([api.getMyProvider(user?.id), api.getMyBookings(user?.id)]);
        if (!cancelled) {
          setProfile(p);
          setBookings(b);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load your provider profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  async function toggleActive() {
    if (!profile || savingActive) return;
    setSavingActive(true);
    try {
      const updated = await api.updateMyProvider({ is_active: !profile.is_active }, user?.id);
      setProfile((prev) => (prev ? { ...prev, is_active: updated.is_active } : prev));
    } catch {
      // Leave state as-is; the toggle simply doesn't flip if the write failed.
    } finally {
      setSavingActive(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-ink-muted">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading your profile…
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="rounded-lg border border-hairline bg-surface-raised p-6 text-sm text-ink-muted">
        {error ?? "No provider profile is linked to this account yet."}
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const todaysBookings = bookings.filter((b) => b.slot?.slot_date === today);
  const openSlots = (profile.slots ?? []).filter((s) => !s.is_booked && s.slot_date >= today);
  const nextBooking = [...bookings]
    .filter((b) => b.status !== "cancelled")
    .sort((a, b) => (a.slot?.slot_date ?? "").localeCompare(b.slot?.slot_date ?? ""))[0];

  const kpis = [
    { title: "Today's Appointments", value: String(todaysBookings.length), icon: CalendarCheck },
    { title: "Rating", value: `${profile.rating.toFixed(1)} ★`, icon: Star },
    { title: "Jobs Completed", value: String(profile.jobs_completed), icon: CalendarCheck },
    { title: "Open Slots", value: String(openSlots.length), icon: Clock },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Profile banner */}
      <div className="rounded-lg border border-hairline bg-surface-raised p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-muted">Provider profile</p>
            <h1 className="font-display mt-1 text-2xl font-semibold text-ink">
              Welcome back, {profile.name}
            </h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
              <span>{profile.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin size={13} /> {profile.area}
              </span>
            </p>
          </div>
          <Button variant={profile.is_active ? "default" : "outline"} onClick={toggleActive} disabled={savingActive}>
            {profile.is_active ? "Online — accepting jobs" : "Offline"}
          </Button>
        </div>
      </div>

      {/* KPIs — every number here has a real backing field */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className="rounded-lg border border-hairline bg-surface-raised p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">{kpi.title}</span>
                <Icon size={16} className="text-accent" />
              </div>
              <p className="font-display mt-2 text-2xl font-semibold text-ink">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Next booking */}
        <div className="rounded-lg border border-hairline bg-surface-raised p-5 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h2 className="font-display text-base font-semibold text-ink">Next booking</h2>
            <Link href="/dashboard/provider/bookings" className="text-xs font-medium text-accent hover:underline">
              View all bookings
            </Link>
          </div>
          {nextBooking ? (
            <div className="mt-4 flex flex-col justify-between gap-3 rounded-md border border-hairline bg-surface p-4 sm:flex-row sm:items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink">{nextBooking.customer?.name ?? "Customer"}</span>
                  <span className="rounded-md bg-accent-tint px-2 py-0.5 font-mono text-xs text-ink">
                    {nextBooking.confirmation_code}
                  </span>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-ink-muted">
                  <MapPin size={12} /> {nextBooking.customer?.area ?? "—"}
                  {nextBooking.slot ? ` · ${nextBooking.slot.slot_date} ${nextBooking.slot.slot_time}` : ""}
                </p>
              </div>
              <Link
                href="/dashboard/provider/bookings"
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-[var(--accent-strong-hover)]"
              >
                Manage <ChevronRight size={14} />
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink-muted">No upcoming bookings.</p>
          )}
        </div>

        {/* Quick nav */}
        <div className="rounded-lg border border-hairline bg-surface-raised p-5">
          <h2 className="font-display text-base font-semibold text-ink">Operations</h2>
          <div className="mt-3 space-y-2">
            <Link
              href="/dashboard/provider/services"
              className={cn(
                "flex items-center justify-between rounded-md border border-hairline bg-surface p-3 transition-colors hover:bg-surface-sunken",
              )}
            >
              <span className="flex items-center gap-2 text-sm text-ink">
                <Layers size={16} className="text-accent" /> Manage listing
              </span>
              <ChevronRight size={14} className="text-ink-muted" />
            </Link>
            <Link
              href="/dashboard/provider/slots"
              className={cn(
                "flex items-center justify-between rounded-md border border-hairline bg-surface p-3 transition-colors hover:bg-surface-sunken",
              )}
            >
              <span className="flex items-center gap-2 text-sm text-ink">
                <Clock size={16} className="text-accent" /> Availability
              </span>
              <ChevronRight size={14} className="text-ink-muted" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
