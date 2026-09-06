"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Sparkles,
  MapPin,
  CalendarCheck,
  Clock,
  ShieldCheck,
  Phone,
  ArrowUpRight,
  Star,
  Zap,
  Bot,
  Mic,
  CheckCircle2,
  ChevronRight,
  Search,
  User,
  AlertCircle,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/Toaster";

interface ActiveBooking {
  id: string;
  token: string;
  artisanName: string;
  artisanAvatar: string;
  artisanPhone: string;
  serviceTitle: string;
  status: "dispatched" | "en_route" | "arrived" | "completed";
  eta: string;
  scheduledTime: string;
  totalPKR: number;
}

const SAMPLE_ACTIVE_BOOKING: ActiveBooking = {
  id: "bk-8011",
  token: "BK-8011",
  artisanName: "Tariq Mehmood",
  artisanAvatar: "TM",
  artisanPhone: "+92 301 5554321",
  serviceTitle: "Master Inverter AC Diagnostic & Leak Check",
  status: "en_route",
  eta: "18 mins away",
  scheduledTime: "Today at 02:00 PM",
  totalPKR: 3500,
};

const FEATURED_ARTISANS = [
  {
    id: "art-isb-01",
    name: "Tariq Mehmood",
    trade: "AC Technician & HVAC",
    area: "Sector G-13, Islamabad",
    rating: 4.96,
    reviewsCount: 142,
    startingPrice: 3500,
    avatar: "TM",
    verified: true,
  },
  {
    id: "art-khi-01",
    name: "Kashif Siddiqui",
    trade: "Master Electrician & UPS",
    area: "Gulshan-e-Iqbal, Karachi",
    rating: 4.92,
    reviewsCount: 118,
    startingPrice: 2800,
    avatar: "KS",
    verified: true,
  },
  {
    id: "art-lhe-01",
    name: "Muhammad Usman",
    trade: "Plumber & Hydro Pressure",
    area: "DHA Phase 5, Lahore",
    rating: 4.88,
    reviewsCount: 95,
    startingPrice: 3000,
    avatar: "MU",
    verified: true,
  },
];

export default function CustomerConciergePage() {
  const { user } = useAuth();
  const [activeBooking, setActiveBooking] = useState<ActiveBooking | null>(SAMPLE_ACTIVE_BOOKING);
  const [searchQuery, setSearchQuery] = useState("");

  const steps = [
    { label: "Assigned", key: "dispatched", done: true },
    { label: "Artisan En Route", key: "en_route", done: true },
    { label: "Arrived at Home", key: "arrived", done: activeBooking?.status === "arrived" || activeBooking?.status === "completed" },
    { label: "Completed", key: "completed", done: activeBooking?.status === "completed" },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* 1. WELCOME CONCIERGE BANNER */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#0C1A14] via-[#10241B] to-[#0A1610] border border-[#1E3B2C] shadow-[0_16px_40px_rgba(0,0,0,0.4)] overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#34D399]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#162D23] border border-[#244C39] text-[#34D399] flex items-center justify-center font-display font-black text-2xl shrink-0 shadow-inner">
              {user?.avatar || "ZK"}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#162D23] border border-[#244C39] text-[#34D399] text-xs font-code font-bold">
                  CLIENT CONCIERGE
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-code text-[#D4A843] bg-[#241E11] px-2 py-0.5 rounded border border-[#42371E]">
                  <Sparkles size={11} />
                  <span>Emerald Member</span>
                </span>
              </div>

              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F2F7F4] tracking-tight">
                Assalam-o-Alaikum, {user?.name || "Zubair Khan"}
              </h1>
              <p className="font-body text-xs text-[#A3B8AF] mt-1 flex items-center gap-2">
                <span>Verified Homeowner</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-[#34D399]" />
                  {user?.area || "Gulshan-e-Iqbal, Karachi"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/services">
              <Button className="bg-[#34D399] hover:bg-[#2BB380] text-[#090E0C] font-display font-bold px-5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95">
                <Bot size={16} />
                <span>AI Voice & Chat Sandbox</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. ACTIVE LIVE BOOKING TRACKER */}
      {activeBooking && (
        <div className="rounded-3xl p-6 sm:p-8 bg-[#111A15] border-2 border-[#34D399]/40 shadow-[0_12px_40px_rgba(0,0,0,0.5)] space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#34D399]/5 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C2C24] pb-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#34D399] animate-ping" />
              <div>
                <span className="text-xs font-code uppercase text-[#34D399] font-bold">
                  Active Dispatch in Progress
                </span>
                <h2 className="font-display font-bold text-lg text-[#F2F7F4]">
                  {activeBooking.serviceTitle}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-code text-[#8EAAA0] uppercase block">Security Token</span>
                <span className="font-code font-bold text-sm text-[#D4A843] bg-[#241E11] px-2.5 py-1 rounded-lg border border-[#42371E]">
                  {activeBooking.token}
                </span>
              </div>
            </div>
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {steps.map((step, idx) => (
              <div
                key={step.key}
                className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
                  step.done
                    ? "bg-[#162D23] border-[#34D399]/50 text-[#F2F7F4]"
                    : "bg-[#0C120F] border-[#1C2C24] text-[#8EAAA0]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-code text-[#8EAAA0]">0{idx + 1}</span>
                  {step.done ? (
                    <CheckCircle2 size={16} className="text-[#34D399]" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-[#2D3F35]" />
                  )}
                </div>
                <span className="font-display font-bold text-xs">{step.label}</span>
              </div>
            ))}
          </div>

          {/* Artisan & ETA Details */}
          <div className="p-4 rounded-2xl bg-[#0B120E] border border-[#1C2C24] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#292212] border border-[#473B1F] text-[#D4A843] flex items-center justify-center font-display font-black text-base shrink-0">
                {activeBooking.artisanAvatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-bold text-sm text-[#F2F7F4]">
                    {activeBooking.artisanName}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-[10px] font-code text-[#34D399] bg-[#12241B] px-1.5 py-0.5 rounded border border-[#1F3D2E]">
                    <ShieldCheck size={10} /> Verified
                  </span>
                </div>
                <p className="font-body text-xs text-[#8EAAA0] flex items-center gap-2 mt-0.5">
                  <span className="text-[#34D399] font-semibold flex items-center gap-1">
                    <Navigation size={11} /> {activeBooking.eta}
                  </span>
                  <span>·</span>
                  <span>{activeBooking.scheduledTime}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`tel:${activeBooking.artisanPhone}`}
                className="h-10 px-4 rounded-xl bg-[#182820] hover:bg-[#20362B] border border-[#284435] text-[#34D399] font-code text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Phone size={14} />
                <span>Call Artisan</span>
              </a>
              <Link href="/dashboard/customer/bookings">
                <Button variant="outline" className="h-10 border-[#1C2C24] text-[#F2F7F4] hover:bg-white/5 text-xs font-display">
                  Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. AI QUICK DISPATCH BAR */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121E18] to-[#0E1612] border border-[#1F382B] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#34D399]" />
            <h3 className="font-display font-bold text-base text-[#F2F7F4]">
              Instant AI Service Concierge
            </h3>
          </div>
          <span className="text-xs font-code text-[#8EAAA0]">Multi-Agent Urdu & English</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="e.g. Mere ghar ka AC pani leak kar raha hai aur cooling nahi kar raha..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#090E0C] border border-[#1C2C24] rounded-2xl px-4 py-3.5 pl-11 text-sm text-[#F2F7F4] placeholder-[#5A7367] focus:outline-none focus:border-[#34D399]"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A7367]" />
          </div>

          <Link href={`/services?query=${encodeURIComponent(searchQuery)}`} className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-[#34D399] hover:bg-[#2BB380] text-[#090E0C] font-display font-bold px-6 py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2">
              <Zap size={16} />
              <span>Dispatch via AI</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4. VERIFIED ARTISANS PREVIEW CAROUSEL */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-[#F2F7F4] flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#34D399]" />
              <span>Top Rated Master Artisans in Your Metro</span>
            </h2>
            <p className="font-body text-xs text-[#8EAAA0] mt-0.5">
              100% NADRA verified with guaranteed warranty and emergency dispatch availability.
            </p>
          </div>
          <Link
            href="/dashboard/customer/providers"
            className="text-xs font-code text-[#34D399] hover:underline flex items-center gap-1"
          >
            <span>View All Directory</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURED_ARTISANS.map((artisan) => (
            <div
              key={artisan.id}
              className="p-5 rounded-3xl bg-[#111A15] border border-[#1C2C24] hover:border-[#34D399]/40 transition-all space-y-4 shadow-lg group"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1C2C24] border border-[#2D3F35] text-[#34D399] flex items-center justify-center font-display font-bold text-lg shrink-0">
                  {artisan.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-sm text-[#F2F7F4] truncate">
                      {artisan.name}
                    </h3>
                    <ShieldCheck size={14} className="text-[#34D399] shrink-0" />
                  </div>
                  <p className="font-body text-xs text-[#D4A843] font-semibold truncate">
                    {artisan.trade}
                  </p>
                  <p className="font-body text-[11px] text-[#8EAAA0] flex items-center gap-1 mt-0.5">
                    <MapPin size={10} className="text-[#34D399]" />
                    {artisan.area}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#1C2C24] text-xs">
                <div className="flex items-center gap-1 text-[#D4A843] font-code font-bold">
                  <Star size={13} fill="#D4A843" />
                  <span>{artisan.rating}</span>
                  <span className="text-[#8EAAA0] font-normal">({artisan.reviewsCount})</span>
                </div>

                <span className="font-code font-bold text-[#F2F7F4]">
                  from PKR {artisan.startingPrice.toLocaleString()}
                </span>
              </div>

              <Link href="/dashboard/customer/providers">
                <Button className="w-full bg-[#182820] hover:bg-[#34D399] text-[#34D399] hover:text-[#090E0C] font-display font-bold text-xs py-2 rounded-xl transition-all">
                  Book Artisan
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
