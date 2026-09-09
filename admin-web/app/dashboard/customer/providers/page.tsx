"use client";

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
import { toast } from "@/components/ui/Toaster";

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

    fetch(url)
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
        fetch(`http://127.0.0.1:8000/providers?area=${encodeURIComponent(selectedCity)}`)
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/8 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/dashboard/customer"
              className="inline-flex items-center gap-1 text-xs font-code text-zinc-400 hover:text-[#0054F9] transition-colors"
            >
              <ChevronLeft size={14} /> Back to Home
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-code text-[#38BDF8] uppercase tracking-wider">
              {selectedCity} Directory
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            Verified Service Providers in {selectedCity}
          </h1>
          <p className="font-body text-xs sm:text-sm text-zinc-400 mt-1">
            Real live verified artisans in {selectedCity}. Book directly with guaranteed transparent pricing.
          </p>
        </div>

        {/* City Toggle Pills */}
        <div className="flex items-center gap-2 bg-[#111118] border border-white/10 rounded-2xl p-1.5 shadow-sm self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 text-xs text-zinc-400">
            <MapPin size={14} className="text-[#0054F9]" />
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
                  ? "bg-[#0054F9] text-white shadow-[0_0_15px_rgba(0,84,249,0.35)]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
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
              className="w-full bg-[#111118] border border-white/8 rounded-2xl px-4 py-3 pl-11 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#0054F9]"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
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
                  ? "bg-[#0054F9] text-white shadow-[0_0_15px_rgba(0,84,249,0.3)]"
                  : "bg-[#111118] border border-white/8 text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Artisans Cards Grid */}
      {isLoading ? (
        <div className="p-16 text-center rounded-3xl bg-[#111118] border border-white/8 space-y-3">
          <Loader2 className="animate-spin mx-auto text-[#0054F9]" size={32} />
          <p className="text-xs font-code text-zinc-400">Fetching live database records for {selectedCity}...</p>
        </div>
      ) : filteredProviders.length === 0 ? (
        <div className="col-span-full p-12 text-center rounded-3xl bg-[#111118] border border-white/8">
          <p className="text-sm text-zinc-400">
            No service providers matched "{search || selectedCategory}" in {selectedCity}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="rounded-3xl bg-[#111118] border border-white/8 hover:border-[#0054F9]/40 p-6 flex flex-col justify-between space-y-5 transition-all shadow-lg group relative overflow-hidden"
            >
              <div className="space-y-4">
                {/* Header Profile */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#0054F9]/15 border border-[#0054F9]/30 text-[#38BDF8] flex items-center justify-center font-display font-black text-xl shrink-0">
                    {provider.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-bold text-base text-white truncate">
                        {provider.name}
                      </h3>
                      <ShieldCheck size={16} className="text-[#38BDF8] shrink-0" />
                    </div>
                    <p className="font-body text-xs text-[#D4A843] font-semibold truncate mt-0.5">
                      {provider.category}
                    </p>
                    <p className="font-body text-[11px] text-zinc-400 flex items-center gap-1 mt-1 truncate">
                      <MapPin size={11} className="text-[#38BDF8]" />
                      {provider.area}
                    </p>
                  </div>
                </div>

                {/* Rating & Stats Strip */}
                <div className="grid grid-cols-2 gap-2 py-2.5 px-3 rounded-xl bg-[#0A0A0F] border border-white/8 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-[#D4A843] font-display font-bold text-xs">
                      <Star size={12} fill="#D4A843" />
                      <span>{provider.rating}</span>
                    </div>
                    <div className="text-[9px] font-code text-zinc-400">Customer Rating</div>
                  </div>
                  <div className="border-l border-white/8">
                    <div className="font-display font-bold text-xs text-[#38BDF8]">
                      {provider.jobs_completed}
                    </div>
                    <div className="text-[9px] font-code text-zinc-400">Jobs Completed</div>
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="pt-4 border-t border-white/8 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-code text-zinc-400 uppercase block">Starting</span>
                  <span className="font-display font-bold text-sm text-[#38BDF8]">
                    {provider.price_range}
                  </span>
                </div>

                <Button
                  onClick={() => openBookingModal(provider)}
                  className="bg-[#0054F9] hover:bg-[#0043C7] text-white shadow-[0_0_20px_rgba(0,84,249,0.3)] font-display font-bold text-xs px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111118] border border-white/10 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/8 pb-4">
              <div>
                <h2 className="font-display font-bold text-lg text-white">
                  Book Technician
                </h2>
                <p className="text-xs text-[#38BDF8] font-semibold">{selectedProvider.name}</p>
              </div>

              <button
                onClick={() => setSelectedProvider(null)}
                className="text-zinc-400 hover:text-white font-code text-sm"
              >
                ✕
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#0054F9]/15 border-2 border-[#0054F9] text-[#38BDF8] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,84,249,0.3)]">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-display font-black text-xl text-white">
                  Appointment Dispatched!
                </h3>
                <p className="font-body text-xs text-zinc-400 max-w-xs mx-auto">
                  {selectedProvider.name} has been notified and is scheduled for your service in {selectedCity}.
                </p>

                <div className="p-4 rounded-2xl bg-[#0A0A0F] border border-white/8 max-w-xs mx-auto space-y-2">
                  <span className="text-[10px] font-code uppercase text-zinc-400 block">Security Code</span>
                  <div className="font-code font-black text-2xl text-[#38BDF8] tracking-widest">
                    {generatedToken}
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Give this 4-digit code to the technician once service is completed.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-4">
                  <Link href="/dashboard/customer/bookings">
                    <Button className="bg-[#0054F9] hover:bg-[#0043C7] text-white shadow-[0_0_20px_rgba(0,84,249,0.3)] font-display font-bold text-xs px-6 py-2.5 rounded-xl">
                      View in My Bookings →
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
                <div>
                  <label className="block font-code uppercase text-zinc-400 mb-1.5 font-semibold">
                    Premises Address in {selectedCity} *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#0054F9]"
                  />
                </div>

                <div>
                  <label className="block font-code uppercase text-zinc-400 mb-1.5 font-semibold">
                    Preferred Time Slot
                  </label>
                  <select
                    value={scheduledSlot}
                    onChange={(e) => setScheduledSlot(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#0054F9]"
                  >
                    <option value="Urgent (Within 45 mins)">⚡ Urgent (Within 45 mins)</option>
                    <option value="Today (02:00 PM – 04:00 PM)">Today (02:00 PM – 04:00 PM)</option>
                    <option value="Today (05:00 PM – 07:00 PM)">Today (05:00 PM – 07:00 PM)</option>
                    <option value="Tomorrow Morning (10:00 AM)">Tomorrow Morning (10:00 AM)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-code uppercase text-zinc-400 mb-1.5 font-semibold">
                    Problem Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Please bring extra capacitor or diagnostic meter..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#0054F9]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#0A0A0F] border border-white/10 flex items-center justify-between">
                  <span className="text-zinc-400">Estimated Starting Rate:</span>
                  <span className="font-display font-bold text-sm text-[#38BDF8]">
                    {selectedProvider.price_range}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedProvider(null)}
                    className="border-white/10 text-zinc-400 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#0054F9] hover:bg-[#0043C7] text-white font-display font-bold text-xs px-5 shadow-[0_0_15px_rgba(0,84,249,0.3)]"
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
