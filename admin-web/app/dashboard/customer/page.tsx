"use client";

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
    icon: Wind,
    query: "AC Technician",
  },
  {
    id: "electrician",
    name: "Electrician / UPS",
    urdu: "الیکٹریشن اور یو پی ایس",
    desc: "Short circuits, wiring, solar & breaker overhaul",
    icon: Zap,
    query: "Electrician",
  },
  {
    id: "plumber",
    name: "Plumber & Sanitary",
    urdu: "پلمبر اور سینیٹری",
    desc: "Concealed leaks, water motor, tap replacements",
    icon: Droplets,
    query: "Plumber",
  },
  {
    id: "carpenter",
    name: "Carpenter & Locks",
    urdu: "کارپینٹر اور تالے",
    desc: "Door locks, furniture repair, kitchen cabinets",
    icon: Hammer,
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

    fetch(`/api-backend/providers?area=${encodeURIComponent(selectedCity)}`)
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
        fetch(`http://127.0.0.1:8000/providers?area=${encodeURIComponent(selectedCity)}`)
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-code text-zinc-400">Welcome,</span>
            <span className="font-display font-bold text-base text-white">
              {user?.name || "Zubair Khan"}
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Verified Homeowner Concierge · Live Instant Dispatch
          </p>
        </div>

        {/* City Switcher Pill */}
        <div className="flex items-center gap-2 bg-[#111118] border border-white/10 rounded-2xl p-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 px-3 py-1 text-xs text-zinc-400">
            <MapPin size={14} className="text-[#0054F9]" />
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
                  ? "bg-[#0054F9] text-white shadow-[0_0_15px_rgba(0,84,249,0.35)]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* ─── SECTION 1: HERO CATEGORY GRID & VOICE ORDER ──────────────── */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-[#111118] border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#0054F9]/15 blur-[120px] pointer-events-none" />

        <div className="space-y-6 relative z-10">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Aaj kya theek karwana hai?
            </h1>
            <p className="font-body text-xs sm:text-sm text-zinc-400 mt-1">
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
                className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-4 py-3.5 pl-11 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#0054F9]"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            </div>

            {/* Voice Mic Order Button */}
            <button
              onClick={handleVoiceOrder}
              className={`h-12 px-5 rounded-2xl font-display font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg w-full sm:w-auto shrink-0 ${
                isListening
                  ? "bg-rose-600 text-white animate-pulse shadow-[0_0_20px_rgba(225,29,72,0.5)]"
                  : "bg-[#0054F9] hover:bg-[#0043C7] text-white shadow-[0_0_20px_rgba(0,84,249,0.35)]"
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
                  className="p-5 rounded-2xl bg-[#0E0E17] hover:bg-[#121220] border border-[#0054F9]/30 hover:border-[#0054F9] transition-all hover:scale-[1.02] active:scale-[0.98] group flex flex-col justify-between space-y-3 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(0,84,249,0.25)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#0054F9]/15 border border-[#0054F9]/30 text-[#38BDF8] flex items-center justify-center group-hover:bg-[#0054F9] group-hover:text-white group-hover:shadow-[0_0_15px_rgba(0,84,249,0.4)] transition-all">
                      <Icon size={22} />
                    </div>
                    <span className="text-[11px] font-code text-[#38BDF8]/70 group-hover:text-[#38BDF8] transition-colors">{cat.urdu}</span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base text-white group-hover:text-[#38BDF8] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="flex items-center text-xs font-semibold text-[#38BDF8] group-hover:text-white pt-1 transition-colors">
                    <span>Book Technician</span>
                    <ChevronRight size={14} className="ml-1 text-[#0054F9] group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: ACTIVE ORDER TRACKER (CAREEM-STYLE) ──────────── */}
      {activeOrder && (
        <div className="rounded-3xl bg-[#111118] border-2 border-[#0054F9]/40 p-6 sm:p-7 shadow-[0_16px_40px_rgba(0,84,249,0.15)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0054F9] animate-ping" />
                <span className="text-xs font-code font-bold uppercase text-[#38BDF8] tracking-wider">
                  Active Dispatch · {selectedCity}
                </span>
              </div>
              <h2 className="font-display font-bold text-xl text-white">
                {activeOrder.trade}
              </h2>
            </div>

            {/* Clear OTP Token Badge */}
            <div className="flex items-center gap-3 bg-[#0A0A0F] border border-white/10 p-3 rounded-2xl">
              <div>
                <span className="text-[10px] font-code uppercase text-zinc-400 block">Security Code</span>
                <div className="font-code font-black text-2xl text-[#38BDF8] tracking-widest leading-none">
                  {activeOrder.token}
                </div>
              </div>
              <p className="text-[10px] text-zinc-400 max-w-[130px] leading-tight">
                Kaam khatam hone par technician ko yeh code dein.
              </p>
            </div>
          </div>

          {/* Technician Profile & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0054F9]/20 border border-[#0054F9]/40 text-[#38BDF8] flex items-center justify-center font-display font-black text-xl shrink-0">
                {activeOrder.artisanName.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-base text-white">
                    {activeOrder.artisanName}
                  </h3>
                  <span className="text-[10px] font-code text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    ● {activeOrder.status === "en_route" ? "On The Way" : "Confirmed"}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 flex items-center gap-2 mt-1">
                  <span className="text-[#38BDF8] font-bold flex items-center gap-1">
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
                className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Phone size={14} />
                <span>Call Artisan</span>
              </a>

              <Link
                href="/dashboard/customer/bookings"
                className="h-10 px-4 rounded-xl bg-[#141420] hover:bg-[#1A1A28] border border-white/10 text-zinc-300 font-display text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Order Details</span>
                <ChevronRight size={14} />
              </Link>

              <button
                onClick={() => {
                  setActiveOrder(null);
                  toast.success("Order marked as completed!");
                }}
                className="text-xs font-code text-zinc-500 hover:text-zinc-300 px-2 cursor-pointer"
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
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <ShieldCheck size={20} className="text-[#0054F9]" />
              <span>Verified Service Providers in {selectedCity}</span>
            </h2>
            <p className="font-body text-xs text-zinc-400 mt-0.5">
              Live database records · Background checked with guaranteed warranty.
            </p>
          </div>

          <Link
            href="/dashboard/customer/providers"
            className="text-xs font-code text-[#38BDF8] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>View All Providers</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Live Database Cards */}
        {isLoadingProviders ? (
          <div className="p-12 text-center rounded-3xl bg-[#111118] border border-white/8 space-y-3">
            <Loader2 className="animate-spin mx-auto text-[#0054F9]" size={28} />
            <p className="text-xs font-code text-zinc-400">Loading verified providers from {selectedCity} database...</p>
          </div>
        ) : providers.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-[#111118] border border-white/8">
            <p className="text-sm text-zinc-400">No active providers found in {selectedCity}. Try switching city.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {providers.slice(0, 3).map((provider) => (
              <div
                key={provider.id}
                className="p-5 rounded-3xl bg-[#111118] border border-white/8 hover:border-[#0054F9]/40 transition-all flex flex-col justify-between space-y-4 shadow-lg group relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#0054F9]/15 border border-[#0054F9]/30 text-[#38BDF8] flex items-center justify-center font-display font-bold text-base shrink-0">
                      {provider.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display font-bold text-sm text-white truncate">
                          {provider.name}
                        </h3>
                        <ShieldCheck size={14} className="text-[#38BDF8] shrink-0" />
                      </div>
                      <p className="font-body text-xs text-[#D4A843] font-semibold truncate mt-0.5">
                        {provider.category}
                      </p>
                      <p className="font-body text-[11px] text-zinc-400 flex items-center gap-1 mt-1 truncate">
                        <MapPin size={10} className="text-[#38BDF8]" />
                        {provider.area}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                    <div className="flex items-center gap-1 text-[#D4A843] font-code font-bold">
                      <Star size={13} fill="#D4A843" />
                      <span>{provider.rating}</span>
                      <span className="text-zinc-500 font-normal">({provider.jobs_completed} jobs)</span>
                    </div>

                    <span className="font-code font-bold text-white">
                      {provider.price_range}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setBookingProvider(provider)}
                  className="w-full bg-[#0054F9] hover:bg-[#0043C7] text-white shadow-[0_0_20px_rgba(0,84,249,0.25)] font-display font-bold text-xs py-2.5 rounded-xl cursor-pointer transition-all active:scale-95"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111118] border border-white/10 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/8 pb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Book Technician
                </h3>
                <p className="text-xs text-[#38BDF8] font-semibold">{bookingProvider.name}</p>
              </div>
              <button
                onClick={() => setBookingProvider(null)}
                className="text-zinc-400 hover:text-white font-code text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
              <div>
                <label className="block font-code uppercase text-zinc-400 mb-1.5 font-semibold">
                  Premises Address *
                </label>
                <input
                  type="text"
                  required
                  value={bookingAddress}
                  onChange={(e) => setBookingAddress(e.target.value)}
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#0054F9]"
                />
              </div>

              <div>
                <label className="block font-code uppercase text-zinc-400 mb-1.5 font-semibold">
                  Preferred Time Slot
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
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
                  placeholder="e.g. Bring inverter diagnostic meter..."
                  value={bookingNote}
                  onChange={(e) => setBookingNote(e.target.value)}
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#0054F9]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0A0A0F] border border-white/10 flex items-center justify-between">
                <span className="text-zinc-400">Rate / Starting:</span>
                <span className="font-display font-bold text-sm text-[#38BDF8]">
                  {bookingProvider.price_range}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setBookingProvider(null)}
                  className="border-white/10 text-zinc-400 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingBooking}
                  className="bg-[#0054F9] hover:bg-[#0043C7] text-white font-display font-bold text-xs px-5 shadow-[0_0_15px_rgba(0,84,249,0.3)]"
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
