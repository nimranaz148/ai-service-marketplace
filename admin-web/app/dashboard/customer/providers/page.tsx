"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Users,
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronLeft,
  Filter,
  Sparkles,
  Phone,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/Toaster";

interface ArtisanProfile {
  id: string;
  name: string;
  avatar: string;
  trade: string;
  category: string;
  city: "Islamabad" | "Karachi" | "Lahore";
  area: string;
  phone: string;
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  startingPrice: number;
  responseTime: string;
  services: { title: string; pricePKR: number; duration: string }[];
}

const ARTISANS_ROSTER: ArtisanProfile[] = [
  {
    id: "art-isb-01",
    name: "Tariq Mehmood",
    avatar: "TM",
    trade: "AC Technician & HVAC",
    category: "HVAC",
    city: "Islamabad",
    area: "Sector G-13, Islamabad",
    phone: "+92 301 5554321",
    rating: 4.96,
    reviewsCount: 142,
    completedJobs: 184,
    startingPrice: 3500,
    responseTime: "15-30 mins",
    services: [
      { title: "Master Inverter AC Diagnostic", pricePKR: 3500, duration: "45 mins" },
      { title: "Dual Jet Foam Coil Wash", pricePKR: 4500, duration: "60 mins" },
      { title: "Inverter PCB Logic Soldering", pricePKR: 6500, duration: "90 mins" },
      { title: "R410A / R32 High Purity Gas Refill", pricePKR: 7000, duration: "60 mins" },
    ],
  },
  {
    id: "art-khi-01",
    name: "Kashif Siddiqui",
    avatar: "KS",
    trade: "Master Electrician & Solar UPS",
    category: "Electrician",
    city: "Karachi",
    area: "Gulshan-e-Iqbal, Karachi",
    phone: "+92 321 8887766",
    rating: 4.92,
    reviewsCount: 118,
    completedJobs: 215,
    startingPrice: 2800,
    responseTime: "20-40 mins",
    services: [
      { title: "Main Distribution Board & Breaker Overhaul", pricePKR: 2800, duration: "45 mins" },
      { title: "Hybrid Solar Inverter Calibration & Wiring", pricePKR: 5500, duration: "90 mins" },
      { title: "Short Circuit Ground Fault Tracing", pricePKR: 3800, duration: "60 mins" },
    ],
  },
  {
    id: "art-lhe-01",
    name: "Muhammad Usman",
    avatar: "MU",
    trade: "Plumber & Hydro Pressure",
    category: "Plumbing",
    city: "Lahore",
    area: "DHA Phase 5, Lahore",
    phone: "+92 333 4443322",
    rating: 4.88,
    reviewsCount: 95,
    completedJobs: 130,
    startingPrice: 3000,
    responseTime: "25-45 mins",
    services: [
      { title: "Concealed Ultrasonic Pipe Leak Detection", pricePKR: 4000, duration: "60 mins" },
      { title: "Automatic Water Booster Pump Installation", pricePKR: 3000, duration: "45 mins" },
      { title: "Geyser Thermostat & Burner Jet Clean", pricePKR: 2500, duration: "40 mins" },
    ],
  },
  {
    id: "art-isb-02",
    name: "Zafar Iqbal",
    avatar: "ZI",
    trade: "Master Carpenter & Wood Restoration",
    category: "Carpentry",
    city: "Islamabad",
    area: "Sector F-10, Islamabad",
    phone: "+92 300 7776655",
    rating: 4.91,
    reviewsCount: 76,
    completedJobs: 98,
    startingPrice: 3200,
    responseTime: "30-60 mins",
    services: [
      { title: "Precision Door Lock & Hinge Realignment", pricePKR: 2200, duration: "30 mins" },
      { title: "Custom Kitchen Cabinet Hydraulic Fitting", pricePKR: 4500, duration: "90 mins" },
      { title: "Solid Wood Polish & Surface Restoration", pricePKR: 6000, duration: "120 mins" },
    ],
  },
  {
    id: "art-khi-02",
    name: "Naveed Alam",
    avatar: "NA",
    trade: "Smart CCTV & Access Control",
    category: "Security",
    city: "Karachi",
    area: "Clifton Block 4, Karachi",
    phone: "+92 312 3332211",
    rating: 4.95,
    reviewsCount: 88,
    completedJobs: 112,
    startingPrice: 4000,
    responseTime: "20-35 mins",
    services: [
      { title: "4-Channel NVR & IP Camera Cloud Setup", pricePKR: 5000, duration: "90 mins" },
      { title: "Smart Biometric Video Doorbell Integration", pricePKR: 3500, duration: "45 mins" },
      { title: "Network Cat6 Trunking & Signal Diagnostics", pricePKR: 4000, duration: "60 mins" },
    ],
  },
  {
    id: "art-lhe-02",
    name: "Bilal Sheikh",
    avatar: "BS",
    trade: "Industrial HVAC & Chiller Specialist",
    category: "HVAC",
    city: "Lahore",
    area: "Gulberg III, Lahore",
    phone: "+92 302 9998877",
    rating: 4.94,
    reviewsCount: 160,
    completedJobs: 240,
    startingPrice: 4200,
    responseTime: "20-40 mins",
    services: [
      { title: "Multi-Split VRF System Diagnostics", pricePKR: 6000, duration: "90 mins" },
      { title: "Duct Sanitization & Fogging Service", pricePKR: 7500, duration: "120 mins" },
      { title: "Heavy Duty Compressor Bearing Replacement", pricePKR: 8500, duration: "150 mins" },
    ],
  },
];

export default function CustomerProvidersDirectoryPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Booking Modal State
  const [selectedArtisan, setSelectedArtisan] = useState<ArtisanProfile | null>(null);
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);
  const [scheduledDate, setScheduledDate] = useState("Today, Sep 5");
  const [scheduledSlot, setScheduledSlot] = useState("02:00 PM – 03:30 PM");
  const [address, setAddress] = useState(user?.area || "House 14, St 2, Sector G-13/2, Islamabad");
  const [notes, setNotes] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");

  const filteredArtisans = ARTISANS_ROSTER.filter((art) => {
    const matchesSearch =
      art.name.toLowerCase().includes(search.toLowerCase()) ||
      art.trade.toLowerCase().includes(search.toLowerCase()) ||
      art.area.toLowerCase().includes(search.toLowerCase());

    const matchesCity = selectedCity === "all" || art.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesCat = selectedCategory === "all" || art.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCity && matchesCat;
  });

  const openBookingModal = (artisan: ArtisanProfile) => {
    setSelectedArtisan(artisan);
    setSelectedServiceIndex(0);
    setBookingConfirmed(false);
    setGeneratedToken("");
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArtisan) return;

    const token = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedToken(token);
    setBookingConfirmed(true);

    toast.success(`Booking Confirmed! Token: ${token}`);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C2C24] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/dashboard/customer"
              className="inline-flex items-center gap-1 text-xs font-code text-[#8EAAA0] hover:text-[#34D399] transition-colors"
            >
              <ChevronLeft size={14} /> Back to Concierge
            </Link>
            <span className="text-[#3D5245]">/</span>
            <span className="text-xs font-code text-[#34D399] uppercase tracking-wider">Directory</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F2F7F4] tracking-tight">
            Verified Master Artisans Directory
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#A3B8AF] mt-1">
            Browse NADRA-verified service professionals across Islamabad, Karachi, and Lahore. Book directly with transparent pricing.
          </p>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search by artisan name, trade, or sector..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#111A15] border border-[#1C2C24] rounded-2xl px-4 py-3 pl-11 text-sm text-[#F2F7F4] placeholder-[#5A7367] focus:outline-none focus:border-[#34D399]"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A7367]" />
          </div>

          {/* City Filter Pills */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
            {["all", "Islamabad", "Karachi", "Lahore"].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3.5 py-2 rounded-xl text-xs font-code font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                  selectedCity === city
                    ? "bg-[#34D399] text-[#090E0C] shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                    : "bg-[#111A15] border border-[#1C2C24] text-[#8EAAA0] hover:text-[#F2F7F4]"
                }`}
              >
                {city === "all" ? "All Metros" : city}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { key: "all", label: "All Trades" },
            { key: "hvac", label: "HVAC & AC" },
            { key: "electrician", label: "Electricians" },
            { key: "plumbing", label: "Plumbing" },
            { key: "carpentry", label: "Carpentry" },
            { key: "security", label: "Smart Security" },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-body font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.key
                  ? "bg-[#162D23] border border-[#34D399] text-[#34D399]"
                  : "bg-[#0B120E] border border-[#1C2C24] text-[#8EAAA0] hover:text-[#F2F7F4]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Artisans Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtisans.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-3xl bg-[#111A15] border border-[#1C2C24]">
            <p className="text-sm text-[#8EAAA0]">No master artisans matched your current filter criteria.</p>
          </div>
        ) : (
          filteredArtisans.map((artisan) => (
            <div
              key={artisan.id}
              className="rounded-3xl bg-[#111A15] border border-[#1C2C24] hover:border-[#34D399]/40 p-6 flex flex-col justify-between space-y-5 transition-all shadow-lg group relative overflow-hidden"
            >
              <div className="space-y-4">
                {/* Header Profile */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#292212] border border-[#473B1F] text-[#D4A843] flex items-center justify-center font-display font-black text-xl shrink-0 shadow-inner">
                    {artisan.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-bold text-base text-[#F2F7F4] truncate">
                        {artisan.name}
                      </h3>
                      <ShieldCheck size={16} className="text-[#34D399] shrink-0" />
                    </div>
                    <p className="font-body text-xs text-[#D4A843] font-semibold truncate mt-0.5">
                      {artisan.trade}
                    </p>
                    <p className="font-body text-[11px] text-[#8EAAA0] flex items-center gap-1 mt-1 truncate">
                      <MapPin size={11} className="text-[#34D399]" />
                      {artisan.area}
                    </p>
                  </div>
                </div>

                {/* Rating & Stats Strip */}
                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-[#0B120E] border border-[#1C2C24] text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-[#D4A843] font-display font-bold text-xs">
                      <Star size={12} fill="#D4A843" />
                      <span>{artisan.rating}</span>
                    </div>
                    <div className="text-[9px] font-code text-[#8EAAA0]">{artisan.reviewsCount} Reviews</div>
                  </div>
                  <div className="border-x border-[#1C2C24]">
                    <div className="font-display font-bold text-xs text-[#34D399]">{artisan.completedJobs}</div>
                    <div className="text-[9px] font-code text-[#8EAAA0]">Jobs Done</div>
                  </div>
                  <div>
                    <div className="font-display font-bold text-xs text-[#F2F7F4]">{artisan.responseTime}</div>
                    <div className="text-[9px] font-code text-[#8EAAA0]">Arrival ETA</div>
                  </div>
                </div>

                {/* Services List Preview */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-code uppercase text-[#8EAAA0] font-bold">
                    Featured Services
                  </div>
                  <div className="space-y-1">
                    {artisan.services.slice(0, 2).map((srv, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-[#16251E] text-[#A3B8AF]"
                      >
                        <span className="truncate pr-2">{srv.title}</span>
                        <span className="font-code font-bold text-[#D4A843] shrink-0">
                          PKR {srv.pricePKR.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="pt-4 border-t border-[#1C2C24] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-code text-[#8EAAA0] uppercase block">Starting</span>
                  <span className="font-display font-bold text-sm text-[#34D399]">
                    PKR {artisan.startingPrice.toLocaleString()}
                  </span>
                </div>

                <Button
                  onClick={() => openBookingModal(artisan)}
                  className="bg-[#34D399] hover:bg-[#2BB380] text-[#090E0C] font-display font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Book Artisan
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* BOOKING MODAL */}
      {selectedArtisan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111A15] border border-[#21352A] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1C2C24] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#292212] border border-[#473B1F] text-[#D4A843] flex items-center justify-center font-display font-black text-sm">
                  {selectedArtisan.avatar}
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-[#F2F7F4]">
                    Book {selectedArtisan.name}
                  </h2>
                  <p className="text-xs text-[#D4A843] font-semibold">{selectedArtisan.trade}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedArtisan(null)}
                className="text-[#8EAAA0] hover:text-[#F2F7F4] font-code text-sm"
              >
                ✕
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#132A1F] border-2 border-[#34D399] text-[#34D399] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-display font-black text-xl text-[#F2F7F4]">
                  Appointment Dispatched!
                </h3>
                <p className="font-body text-xs text-[#8EAAA0] max-w-xs mx-auto">
                  {selectedArtisan.name} has been notified and scheduled for your appointment.
                </p>

                <div className="p-4 rounded-2xl bg-[#0C120F] border border-[#1C2C24] max-w-xs mx-auto space-y-2">
                  <span className="text-[10px] font-code uppercase text-[#8EAAA0] block">Your Security Token</span>
                  <div className="font-code font-black text-2xl text-[#34D399] tracking-widest">
                    {generatedToken}
                  </div>
                  <p className="text-[10px] text-[#A3B8AF]">
                    Show this 4-digit code to the artisan when the service is completed.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-4">
                  <Link href="/dashboard/customer/bookings">
                    <Button className="bg-[#34D399] text-[#090E0C] font-display font-bold text-xs px-6 py-2.5 rounded-xl">
                      View in My Bookings Ledger →
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div>
                  <label className="block text-xs font-code uppercase text-[#8EAAA0] mb-2">
                    Select Service Offering *
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {selectedArtisan.services.map((srv, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedServiceIndex(idx)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                          selectedServiceIndex === idx
                            ? "bg-[#162D23] border-[#34D399] text-[#F2F7F4]"
                            : "bg-[#0C120F] border-[#1C2C24] text-[#8EAAA0] hover:border-[#2F4A3B]"
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{srv.title}</div>
                          <div className="text-[10px] text-[#8EAAA0] flex items-center gap-1">
                            <Clock size={10} /> ~{srv.duration}
                          </div>
                        </div>
                        <span className="font-display font-bold text-[#D4A843]">
                          PKR {srv.pricePKR.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-code uppercase text-[#8EAAA0] mb-1.5">
                      Preferred Date
                    </label>
                    <select
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full bg-[#0C120F] border border-[#1C2C24] rounded-xl px-3 py-2 text-xs text-[#F2F7F4] focus:outline-none focus:border-[#34D399]"
                    >
                      <option value="Today, Sep 5">Today, Sep 5</option>
                      <option value="Tomorrow, Sep 6">Tomorrow, Sep 6</option>
                      <option value="Monday, Sep 7">Monday, Sep 7</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-code uppercase text-[#8EAAA0] mb-1.5">
                      Available Slot
                    </label>
                    <select
                      value={scheduledSlot}
                      onChange={(e) => setScheduledSlot(e.target.value)}
                      className="w-full bg-[#0C120F] border border-[#1C2C24] rounded-xl px-3 py-2 text-xs text-[#F2F7F4] focus:outline-none focus:border-[#34D399]"
                    >
                      <option value="09:00 AM – 10:30 AM">09:00 AM – 10:30 AM</option>
                      <option value="11:00 AM – 12:30 PM">11:00 AM – 12:30 PM</option>
                      <option value="02:00 PM – 03:30 PM">02:00 PM – 03:30 PM</option>
                      <option value="04:30 PM – 06:00 PM">04:30 PM – 06:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-code uppercase text-[#8EAAA0] mb-1.5">
                    Premises Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#0C120F] border border-[#1C2C24] rounded-xl px-3 py-2 text-xs text-[#F2F7F4] focus:outline-none focus:border-[#34D399]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-code uppercase text-[#8EAAA0] mb-1.5">
                    Problem Description / Special Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Please bring extra ladder and manifold gauge..."
                    className="w-full bg-[#0C120F] border border-[#1C2C24] rounded-xl px-3 py-2 text-xs text-[#F2F7F4] focus:outline-none focus:border-[#34D399]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#0B120E] border border-[#1C2C24] flex items-center justify-between text-xs">
                  <span className="text-[#8EAAA0]">Estimated Total:</span>
                  <span className="font-display font-black text-sm text-[#34D399]">
                    PKR {selectedArtisan.services[selectedServiceIndex]?.pricePKR.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1C2C24]">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedArtisan(null)}
                    className="border-[#1C2C24] text-[#8EAAA0] hover:bg-white/5 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#34D399] hover:bg-[#2BB380] text-[#090E0C] font-display font-bold text-xs px-5"
                  >
                    Confirm & Dispatch
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
