"use client";

import { authedFetch } from "@/lib/api";
import { Snowflake, Lightning, Drop, Hammer as PhHammer } from "@phosphor-icons/react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  MapPin,
  Clock,
  ShieldCheck,
  Phone,
  Star,
  Zap,
  Mic,
  MicOff,
  CheckCircle2,
  ChevronRight,
  Search,
  Wrench,
  Wind,
  Droplets,
  Hammer,
  ChevronDown,
  Loader2,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface RealProvider {
  id: string;
  name: string;
  category: string;
  area: string;
  rating: number;
  jobs_completed: number;
  price_range: string;
  is_active: boolean;
}

interface ActiveOrder {
  id: string;
  token: string;
  artisanName: string;
  trade: string;
  phone: string;
  area: string;
  status: "confirmed" | "en_route" | "arrived" | "completed";
  eta: string;
  pricePKR: number;
}

const CATEGORIES = [
  {
    id: "ac",
    name: "AC & Refrigerator",
    urdu: "اے سی اور فریج",
    desc: "Cooling diagnostics, foam wash, gas refill",
    icon: Snowflake,
    query: "AC Technician",
  },
  {
    id: "electrician",
    name: "Electrician / UPS",
    urdu: "الیکٹریشن اور یو پی ایس",
    desc: "Short circuits, wiring, solar & breaker overhaul",
    icon: Lightning,
    query: "Electrician",
  },
  {
    id: "plumber",
    name: "Plumber & Sanitary",
    urdu: "پلمبر اور سینیٹری",
    desc: "Concealed leaks, water motor, tap replacements",
    icon: Drop,
    query: "Plumber",
  },
  {
    id: "carpenter",
    name: "Carpenter & Locks",
    urdu: "کارپینٹر اور تالے",
    desc: "Door locks, furniture repair, kitchen cabinets",
    icon: PhHammer,
    query: "Carpenter",
  },
];

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string>("Karachi");
  const [searchQuery, setSearchQuery] = useState("");
  const [providers, setProviders] = useState<RealProvider[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");

  // Active Order state (Careem-style live tracker)
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>({
    id: "ord-8011",
    token: "8011",
    artisanName: "Kashif Siddiqui",
    trade: "Master Electrician & UPS",
    phone: "+92 321 8887766",
    area: "Gulshan-e-Iqbal, Karachi",
    status: "en_route",
    eta: "15 mins away",
    pricePKR: 2800,
  });

  // Booking Modal State
  const [bookingProvider, setBookingProvider] = useState<RealProvider | null>(null);
  const [bookingAddress, setBookingAddress] = useState("House 42, Block 13-D, Gulshan-e-Iqbal, Karachi");
  const [bookingTime, setBookingTime] = useState("Urgent (Within 45 mins)");
  const [bookingNote, setBookingNote] = useState("");
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Fetch real providers from backend database based on city
  useEffect(() => {
    let isMounted = true;
    setIsLoadingProviders(true);

    authedFetch(`/api-backend/providers?area=${encodeURIComponent(selectedCity)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: RealProvider[]) => {
        if (isMounted) {
          setProviders(data);
          setIsLoadingProviders(false);
        }
      })
      .catch((err) => {
        console.warn("Backend API fetch failed, retrying direct:", err);
        authedFetch(`/api-backend/providers?area=${encodeURIComponent(selectedCity)}`)
          .then((r) => r.json())
          .then((d) => {
            if (isMounted) {
              setProviders(d);
              setIsLoadingProviders(false);
            }
          })
          .catch(() => {
            if (isMounted) setIsLoadingProviders(false);
          });
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCity]);

  // Voice recording simulation / Web Speech API
  const handleVoiceOrder = () => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "ur-PK";
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        toast.info("Bolna shuru karein... (e.g. 'Mere AC ka compressor check karna hai')");
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setSearchQuery(text);
        setVoiceTranscript(text);
        setIsListening(false);
        toast.success(`Voice captured: "${text}"`);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error("Voice capture nahi ho saka. Barah-e-karam masla type karein.");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      const sample = prompt("Apna masla Roman Urdu mein likhein:", "Mera AC cooling nahi kar raha, pani leak ho raha hai");
      if (sample) {
        setSearchQuery(sample);
        toast.success(`Search set to: "${sample}"`);
      }
    }
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingProvider) return;

    setIsSubmittingBooking(true);
    setTimeout(() => {
      const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
      setActiveOrder({
        id: `ord-${randomCode}`,
        token: randomCode,
        artisanName: bookingProvider.name,
        trade: bookingProvider.category,
        phone: "+92 300 1234567",
        area: bookingAddress,
        status: "confirmed",
        eta: "25 mins away",
        pricePKR: parseInt(bookingProvider.price_range.replace(/\D/g, "")) || 2500,
      });

      setIsSubmittingBooking(false);
      setBookingProvider(null);
      toast.success(`Booking Confirmed! OTP Security Code: ${randomCode}`);
    }, 600);
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* ─── HEADER & CITY SELECTOR ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-hairline">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-code text-ink-muted">Welcome,</span>
            <span className="font-display font-bold text-base text-ink">
              {user?.name || "Zubair Khan"}
            </span>
          </div>
          <p className="text-xs text-ink-muted">
            Verified Homeowner Concierge · Live Instant Dispatch
          </p>
        </div>

        {/* City Switcher Pill */}
        <div className="flex items-center gap-2 bg-surface-raised border border-hairline rounded-2xl p-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 px-3 py-1 text-xs text-ink-muted">
            <MapPin size={14} className="text-accent" />
            <span className="font-medium">City:</span>
          </div>
          {(["Karachi", "Islamabad", "Lahore"] as const).map((city) => (
            <button
              key={city}
              onClick={() => {
                setSelectedCity(city);
                toast.info(`Switched to ${city} providers`);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold transition-all cursor-pointer ${
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

      {/* ─── REAL CONCIERGE AGENT (Phase 2 backend) ───────────────────── */}
      <Link
        href="/dashboard/customer/request"
        className="flex items-center justify-between gap-4 rounded-2xl border border-hairline bg-surface-raised px-5 py-4 transition-colors hover:bg-surface-sunken"
      >
        <div>
          <p className="font-display text-sm font-bold text-ink">Talk to the concierge agent</p>
          <p className="mt-0.5 text-xs text-ink-muted">
            A real conversation — it asks what it needs to know and shows you every step it takes.
          </p>
        </div>
        <ChevronRight size={18} className="shrink-0 text-ink-muted" />
      </Link>

      {/* ─── SECTION 1: HERO CATEGORY GRID & VOICE ORDER ──────────────── */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-surface-raised border border-hairline shadow-raised overflow-hidden">

        <div className="space-y-6 relative z-10">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink tracking-tight">
              Aaj kya theek karwana hai?
            </h1>
            <p className="font-body text-xs sm:text-sm text-ink-muted mt-1">
              Select your service or tap the mic button to speak in Roman Urdu or English.
            </p>
          </div>

          {/* Quick Search & Voice Mic Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Maslan: AC cooling nahi kar raha, pani leak ho raha hai..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-hairline rounded-2xl px-4 py-3.5 pl-11 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
            </div>

            {/* Voice Mic Order Button */}
            <button
              onClick={handleVoiceOrder}
              className={`h-12 px-5 rounded-2xl font-display font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg w-full sm:w-auto shrink-0 ${
                isListening
                  ? "bg-rose-600 text-ink animate-pulse shadow-[0_0_20px_rgba(225,29,72,0.5)]"
                  : "bg-primary hover:bg-[var(--accent-strong-hover)] text-accent-ink shadow-raised"
              }`}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              <span>{isListening ? "Listening... (Sun raha hoon)" : "Bol kar order karein"}</span>
            </button>
          </div>

          {/* 4 Large Visual Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  href={`/dashboard/customer/providers?category=${encodeURIComponent(cat.query)}`}
                  className="p-5 rounded-2xl bg-surface-sunken hover:bg-surface-sunken border border-status-live-line hover:border-accent transition-all hover:scale-[1.02] active:scale-[0.98] group flex flex-col justify-between space-y-3 cursor-pointer shadow-raised hover:shadow-raised"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-accent-tint border border-status-live-line text-accent flex items-center justify-center group-hover:bg-primary group-hover:text-accent-ink group-hover:shadow-raised transition-all">
                      <Icon size={26} weight="duotone" />
                    </div>
                    <span className="text-[11px] font-code text-accent group-hover:text-accent transition-colors">{cat.urdu}</span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base text-ink group-hover:text-accent transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-ink-muted mt-1 line-clamp-2 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="flex items-center text-xs font-semibold text-accent group-hover:text-ink pt-1 transition-colors">
                    <span>Book Technician</span>
                    <ChevronRight size={14} className="ml-1 text-accent group-hover:text-ink group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: ACTIVE ORDER TRACKER (CAREEM-STYLE) ──────────── */}
      {activeOrder && (
        <div className="rounded-3xl bg-surface-raised border-2 border-status-live-line p-6 sm:p-7 shadow-raised space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-hairline">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                <span className="text-xs font-code font-bold uppercase text-accent tracking-wider">
                  Active Dispatch · {selectedCity}
                </span>
              </div>
              <h2 className="font-display font-bold text-xl text-ink">
                {activeOrder.trade}
              </h2>
            </div>

            {/* Clear OTP Token Badge */}
            <div className="flex items-center gap-3 bg-surface border border-hairline p-3 rounded-2xl">
              <div>
                <span className="text-[10px] font-code uppercase text-ink-muted block">Security Code</span>
                <div className="font-code font-black text-2xl text-accent tracking-widest leading-none">
                  {activeOrder.token}
                </div>
              </div>
              <p className="text-[10px] text-ink-muted max-w-[130px] leading-tight">
                Kaam khatam hone par technician ko yeh code dein.
              </p>
            </div>
          </div>

          {/* Technician Profile & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-accent-tint border border-status-live-line text-accent flex items-center justify-center font-display font-black text-xl shrink-0">
                {activeOrder.artisanName.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-base text-ink">
                    {activeOrder.artisanName}
                  </h3>
                  <span className="text-[10px] font-code text-status-go bg-status-go-tint px-2 py-0.5 rounded-full border border-status-go-line">
                    ● {activeOrder.status === "en_route" ? "On The Way" : "Confirmed"}
                  </span>
                </div>
                <p className="text-xs text-ink-muted flex items-center gap-2 mt-1">
                  <span className="text-accent font-bold flex items-center gap-1">
                    <Clock size={12} /> {activeOrder.eta}
                  </span>
                  <span>·</span>
                  <span>PKR {activeOrder.pricePKR.toLocaleString()}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <a
                href={`tel:${activeOrder.phone}`}
                className="h-10 px-5 rounded-xl bg-status-go hover:opacity-90 text-accent-ink font-display font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Phone size={14} />
                <span>Call Artisan</span>
              </a>

              <Link
                href="/dashboard/customer/bookings"
                className="h-10 px-4 rounded-xl bg-surface-raised hover:bg-surface-sunken border border-hairline text-ink font-display text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Order Details</span>
                <ChevronRight size={14} />
              </Link>

              <button
                onClick={() => {
                  setActiveOrder(null);
                  toast.success("Order marked as completed!");
                }}
                className="text-xs font-code text-ink-muted hover:text-ink px-2 cursor-pointer"
                title="Dismiss simulated order"
              >
                Done ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION 3: TOP VERIFIED ARTISANS IN CITY (LIVE DATABASE) ──── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-ink flex items-center gap-2">
              <ShieldCheck size={20} className="text-accent" />
              <span>Verified Service Providers in {selectedCity}</span>
            </h2>
            <p className="font-body text-xs text-ink-muted mt-0.5">
              Live database records · Background checked with guaranteed warranty.
            </p>
          </div>

          <Link
            href="/dashboard/customer/providers"
            className="text-xs font-code text-accent hover:underline flex items-center gap-1 font-semibold"
          >
            <span>View All Providers</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Live Database Cards */}
        {isLoadingProviders ? (
          <div className="p-12 text-center rounded-3xl bg-surface-raised border border-hairline space-y-3">
            <Loader2 className="animate-spin mx-auto text-accent" size={28} />
            <p className="text-xs font-code text-ink-muted">Loading verified providers from {selectedCity} database...</p>
          </div>
        ) : providers.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-surface-raised border border-hairline">
            <p className="text-sm text-ink-muted">No active providers found in {selectedCity}. Try switching city.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {providers.slice(0, 3).map((provider) => (
              <div
                key={provider.id}
                className="p-5 rounded-3xl bg-surface-raised border border-hairline hover:border-status-live-line transition-all flex flex-col justify-between space-y-4 shadow-lg group relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-accent-tint border border-status-live-line text-accent flex items-center justify-center font-display font-bold text-base shrink-0">
                      {provider.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display font-bold text-sm text-ink truncate">
                          {provider.name}
                        </h3>
                        <ShieldCheck size={14} className="text-accent shrink-0" />
                      </div>
                      <p className="font-body text-xs text-status-warn font-semibold truncate mt-0.5">
                        {provider.category}
                      </p>
                      <p className="font-body text-[11px] text-ink-muted flex items-center gap-1 mt-1 truncate">
                        <MapPin size={10} className="text-accent" />
                        {provider.area}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-hairline text-xs">
                    <div className="flex items-center gap-1 text-status-warn font-code font-bold">
                      <Star size={13} fill="var(--status-warn)" />
                      <span>{provider.rating}</span>
                      <span className="text-ink-muted font-normal">({provider.jobs_completed} jobs)</span>
                    </div>

                    <span className="font-code font-bold text-ink">
                      {provider.price_range}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setBookingProvider(provider)}
                  className="w-full bg-primary hover:bg-[var(--accent-strong-hover)] text-accent-ink shadow-raised font-display font-bold text-xs py-2.5 rounded-xl cursor-pointer transition-all active:scale-95"
                >
                  Book Now
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── 1-CLICK INSTANT BOOKING MODAL ────────────────────────────── */}
      {bookingProvider && (
        <div className="fixed inset-0 z-50 bg-scrim flex items-center justify-center p-4">
          <div className="bg-surface-raised border border-hairline rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-hairline pb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-ink">
                  Book Technician
                </h3>
                <p className="text-xs text-accent font-semibold">{bookingProvider.name}</p>
              </div>
              <button
                onClick={() => setBookingProvider(null)}
                className="text-ink-muted hover:text-ink font-code text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
              <div>
                <label className="block font-code uppercase text-ink-muted mb-1.5 font-semibold">
                  Premises Address *
                </label>
                <input
                  type="text"
                  required
                  value={bookingAddress}
                  onChange={(e) => setBookingAddress(e.target.value)}
                  className="w-full bg-surface border border-hairline rounded-xl px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-code uppercase text-ink-muted mb-1.5 font-semibold">
                  Preferred Time Slot
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
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
                  placeholder="e.g. Bring inverter diagnostic meter..."
                  value={bookingNote}
                  onChange={(e) => setBookingNote(e.target.value)}
                  className="w-full bg-surface border border-hairline rounded-xl px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-accent"
                />
              </div>

              <div className="p-3 rounded-xl bg-surface border border-hairline flex items-center justify-between">
                <span className="text-ink-muted">Rate / Starting:</span>
                <span className="font-display font-bold text-sm text-accent">
                  {bookingProvider.price_range}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-hairline">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setBookingProvider(null)}
                  className="border-hairline text-ink-muted text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingBooking}
                  className="bg-primary hover:bg-[var(--accent-strong-hover)] text-accent-ink font-display font-bold text-xs px-5 shadow-raised"
                >
                  {isSubmittingBooking ? "Confirming..." : "Confirm & Dispatch"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
