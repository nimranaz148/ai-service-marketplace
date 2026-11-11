"use client";

import { authedFetch } from "@/lib/api";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Users,
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  Sparkles,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface RealProvider {
  id: string;
  name: string;
  category: string;
  area: string;
  lat: number;
  lng: number;
  rating: number;
  jobs_completed: number;
  price_range: string;
  is_active: boolean;
}

export default function CustomerProvidersPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("Karachi");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [providers, setProviders] = useState<RealProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Booking Modal State
  const [selectedProvider, setSelectedProvider] = useState<RealProvider | null>(null);
  const [scheduledSlot, setScheduledSlot] = useState("Urgent (Within 45 mins)");
  const [address, setAddress] = useState("House 42, Block 13-D, Gulshan-e-Iqbal, Karachi");
  const [notes, setNotes] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch real providers from backend API
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const url = `/api-backend/providers?area=${encodeURIComponent(selectedCity)}`;

    authedFetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data: RealProvider[]) => {
        if (isMounted) {
          setProviders(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Proxy fetch failed, trying direct 8000:", err);
        authedFetch(`/api-backend/providers?area=${encodeURIComponent(selectedCity)}`)
          .then((r) => r.json())
          .then((d) => {
            if (isMounted) {
              setProviders(d);
              setIsLoading(false);
            }
          })
          .catch(() => {
            if (isMounted) setIsLoading(false);
          });
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCity]);

  const filteredProviders = providers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.area.toLowerCase().includes(search.toLowerCase());

    const matchesCat =
      selectedCategory === "all" ||
      p.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCat;
  });

  const openBookingModal = (provider: RealProvider) => {
    setSelectedProvider(provider);
    setBookingConfirmed(false);
    setGeneratedToken("");
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const token = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedToken(token);
      setBookingConfirmed(true);
      setIsSubmitting(false);
      toast.success(`Technician Dispatched! OTP Security Code: ${token}`);
    }, 500);
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/dashboard/customer"
              className="inline-flex items-center gap-1 text-xs font-code text-ink-muted hover:text-accent transition-colors"
            >
              <ChevronLeft size={14} /> Back to Home
            </Link>
            <span className="text-ink-muted">/</span>
            <span className="text-xs font-code text-accent uppercase tracking-wider">
              {selectedCity} Directory
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink tracking-tight">
            Verified Service Providers in {selectedCity}
          </h1>
          <p className="font-body text-xs sm:text-sm text-ink-muted mt-1">
            Real live verified artisans in {selectedCity}. Book directly with guaranteed transparent pricing.
          </p>
        </div>

        {/* City Toggle Pills */}
        <div className="flex items-center gap-2 bg-surface-raised border border-hairline rounded-2xl p-1.5 shadow-sm self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 text-xs text-ink-muted">
            <MapPin size={14} className="text-accent" />
            <span className="font-medium">Metro:</span>
          </div>
          {(["Karachi", "Islamabad", "Lahore"] as const).map((city) => (
            <button
              key={city}
              onClick={() => {
                setSelectedCity(city);
                toast.info(`Loaded verified providers in ${city}`);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-bold transition-all cursor-pointer ${
                selectedCity === city
                  ? "bg-primary text-accent-ink shadow-raised"
                  : "text-ink-muted hover:text-ink hover:bg-surface-sunken"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder={`Search by provider name, trade, or area in ${selectedCity}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-raised border border-hairline rounded-2xl px-4 py-3 pl-11 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { key: "all", label: "All Services" },
            { key: "AC", label: "❄️ AC & Cooling" },
            { key: "Electrician", label: "⚡ Electrician / UPS" },
            { key: "Plumber", label: "🔧 Plumber & Sanitary" },
            { key: "Cleaner", label: "🧹 Deep Cleaning" },
            { key: "Tutor", label: "📚 Home Tutors" },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-display font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.key
                  ? "bg-primary text-accent-ink shadow-raised"
                  : "bg-surface-raised border border-hairline text-ink-muted hover:text-ink hover:bg-surface-sunken"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Artisans Cards Grid */}
      {isLoading ? (
        <div className="p-16 text-center rounded-3xl bg-surface-raised border border-hairline space-y-3">
          <Loader2 className="animate-spin mx-auto text-accent" size={32} />
          <p className="text-xs font-code text-ink-muted">Fetching live database records for {selectedCity}...</p>
        </div>
      ) : filteredProviders.length === 0 ? (
        <div className="col-span-full p-12 text-center rounded-3xl bg-surface-raised border border-hairline">
          <p className="text-sm text-ink-muted">
            No service providers matched "{search || selectedCategory}" in {selectedCity}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="rounded-3xl bg-surface-raised border border-hairline hover:border-status-live-line p-6 flex flex-col justify-between space-y-5 transition-all shadow-lg group relative overflow-hidden"
            >
              <div className="space-y-4">
                {/* Header Profile */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent-tint border border-status-live-line text-accent flex items-center justify-center font-display font-black text-xl shrink-0">
                    {provider.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-bold text-base text-ink truncate">
                        {provider.name}
                      </h3>
                      <ShieldCheck size={16} className="text-accent shrink-0" />
                    </div>
                    <p className="font-body text-xs text-status-warn font-semibold truncate mt-0.5">
                      {provider.category}
                    </p>
                    <p className="font-body text-[11px] text-ink-muted flex items-center gap-1 mt-1 truncate">
                      <MapPin size={11} className="text-accent" />
                      {provider.area}
                    </p>
                  </div>
                </div>

                {/* Rating & Stats Strip */}
                <div className="grid grid-cols-2 gap-2 py-2.5 px-3 rounded-xl bg-surface border border-hairline text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-status-warn font-display font-bold text-xs">
                      <Star size={12} fill="var(--status-warn)" />
                      <span>{provider.rating}</span>
                    </div>
                    <div className="text-[9px] font-code text-ink-muted">Customer Rating</div>
                  </div>
                  <div className="border-l border-hairline">
                    <div className="font-display font-bold text-xs text-accent">
                      {provider.jobs_completed}
                    </div>
                    <div className="text-[9px] font-code text-ink-muted">Jobs Completed</div>
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="pt-4 border-t border-hairline flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-code text-ink-muted uppercase block">Starting</span>
                  <span className="font-display font-bold text-sm text-accent">
                    {provider.price_range}
                  </span>
                </div>

                <Button
                  onClick={() => openBookingModal(provider)}
                  className="bg-primary hover:bg-[var(--accent-strong-hover)] text-accent-ink shadow-raised font-display font-bold text-xs px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer"
                >
                  Book Artisan
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── BOOKING MODAL ────────────────────────────────────────────── */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 bg-scrim flex items-center justify-center p-4">
          <div className="bg-surface-raised border border-hairline rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-hairline pb-4">
              <div>
                <h2 className="font-display font-bold text-lg text-ink">
                  Book Technician
                </h2>
                <p className="text-xs text-accent font-semibold">{selectedProvider.name}</p>
              </div>

              <button
                onClick={() => setSelectedProvider(null)}
                className="text-ink-muted hover:text-ink font-code text-sm"
              >
                ✕
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent-tint border-2 border-accent text-accent flex items-center justify-center mx-auto shadow-raised">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-display font-black text-xl text-ink">
                  Appointment Dispatched!
                </h3>
                <p className="font-body text-xs text-ink-muted max-w-xs mx-auto">
                  {selectedProvider.name} has been notified and is scheduled for your service in {selectedCity}.
                </p>

                <div className="p-4 rounded-2xl bg-surface border border-hairline max-w-xs mx-auto space-y-2">
                  <span className="text-[10px] font-code uppercase text-ink-muted block">Security Code</span>
                  <div className="font-code font-black text-2xl text-accent tracking-widest">
                    {generatedToken}
                  </div>
                  <p className="text-[10px] text-ink-muted">
                    Give this 4-digit code to the technician once service is completed.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-4">
                  <Link href="/dashboard/customer/bookings">
                    <Button className="bg-primary hover:bg-[var(--accent-strong-hover)] text-accent-ink shadow-raised font-display font-bold text-xs px-6 py-2.5 rounded-xl">
                      View in My Bookings →
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
                <div>
                  <label className="block font-code uppercase text-ink-muted mb-1.5 font-semibold">
                    Premises Address in {selectedCity} *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-surface border border-hairline rounded-xl px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block font-code uppercase text-ink-muted mb-1.5 font-semibold">
                    Preferred Time Slot
                  </label>
                  <select
                    value={scheduledSlot}
                    onChange={(e) => setScheduledSlot(e.target.value)}
                    className="w-full bg-surface border border-hairline rounded-xl px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-accent"
                  >
                    <option value="Urgent (Within 45 mins)">⚡ Urgent (Within 45 mins)</option>
                    <option value="Today (02:00 PM – 04:00 PM)">Today (02:00 PM – 04:00 PM)</option>
                    <option value="Today (05:00 PM – 07:00 PM)">Today (05:00 PM – 07:00 PM)</option>
                    <option value="Tomorrow Morning (10:00 AM)">Tomorrow Morning (10:00 AM)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-code uppercase text-ink-muted mb-1.5 font-semibold">
                    Problem Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Please bring extra capacitor or diagnostic meter..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-surface border border-hairline rounded-xl px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="p-3 rounded-xl bg-surface border border-hairline flex items-center justify-between">
                  <span className="text-ink-muted">Estimated Starting Rate:</span>
                  <span className="font-display font-bold text-sm text-accent">
                    {selectedProvider.price_range}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-hairline">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedProvider(null)}
                    className="border-hairline text-ink-muted text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-[var(--accent-strong-hover)] text-accent-ink font-display font-bold text-xs px-5 shadow-raised"
                  >
                    {isSubmitting ? "Dispatching..." : "Confirm & Dispatch"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
