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
      <div className="relative rounded-[2rem] p-6 sm:p-8 bg-[#111118] border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#0054F9]/15 blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0054F9]/20 border border-[#0054F9]/30 text-[#0054F9] flex items-center justify-center font-display font-black text-2xl shrink-0 shadow-[0_0_20px_rgba(0,84,249,0.25)]">
              {user?.avatar || "ZK"}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="catalis-badge text-[10px]">
                  CLIENT CONCIERGE
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-code text-[#D4A843] bg-[#D4A843]/10 px-2 py-0.5 rounded-full border border-[#D4A843]/30">
                  <Sparkles size={11} />
                  <span>Titanium Member</span>
                </span>
              </div>

              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                Assalam-o-Alaikum, {user?.name || "Zubair Khan"}
              </h1>
              <p className="font-body text-xs text-zinc-400 mt-1 flex items-center gap-2">
                <MapPin size={12} className="text-[#0054F9]" />
                <span>{user?.area || "Sector F-10, Islamabad"}</span>
                <span>·</span>
                <span className="text-[#0054F9] font-medium">Smart Concierge Active</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/services"
              className="catalis-btn catalis-btn-primary h-10 px-4 text-xs font-display font-bold shadow-[0_0_20px_rgba(0,84,249,0.3)] flex items-center gap-2"
            >
              <Bot size={14} />
              <span>Voice / Chat Dispatch</span>
            </Link>
            <Link
              href="/dashboard/customer/providers"
              className="h-10 px-4 rounded-full bg-[#141420] hover:bg-[#1A1A28] text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <ShieldCheck size={14} className="text-[#0054F9]" />
              <span>Browse Artisans</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. ACTIVE DISPATCH REAL-TIME PROGRESS TRACKER */}
      {activeBooking && (
        <div className="rounded-[2rem] bg-[#111118] border border-white/8 p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.4)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0054F9] animate-ping" />
                <span className="text-xs font-code uppercase font-bold text-[#0054F9] tracking-wider">
                  Live Dispatch Status
                </span>
              </div>
              <h3 className="font-display font-extrabold text-xl text-white">
                {activeBooking.serviceTitle}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-code uppercase text-zinc-400 block">
                  Security OTP Token
                </span>
                <span className="font-code font-black text-base text-[#0054F9] tracking-widest bg-[#0054F9]/10 px-2.5 py-0.5 rounded-md border border-[#0054F9]/30">
                  {activeBooking.token}
                </span>
              </div>
            </div>
          </div>

          {/* Stepper Visual */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
            {steps.map((step, idx) => (
              <div
                key={step.key}
                className={`p-4 rounded-2xl border transition-all ${
                  step.done
                    ? "bg-[#141424] border-[#0054F9]/50 shadow-[0_0_15px_rgba(0,84,249,0.15)]"
                    : "bg-[#141420] border-white/5 opacity-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-code uppercase text-zinc-400 font-bold">
                    Phase 0{idx + 1}
                  </span>
                  {step.done ? (
                    <CheckCircle2 size={15} className="text-[#0054F9]" />
                  ) : (
                    <Clock size={15} className="text-zinc-600" />
                  )}
                </div>
                <span className="font-display font-bold text-xs text-white block">
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Artisan & ETA Details */}
          <div className="p-4 rounded-2xl bg-[#141420] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#D4A843]/15 border border-[#D4A843]/30 text-[#D4A843] flex items-center justify-center font-display font-black text-base shrink-0">
                {activeBooking.artisanAvatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-bold text-sm text-white">
                    {activeBooking.artisanName}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-[10px] font-code text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                    <ShieldCheck size={10} /> Verified
                  </span>
                </div>
                <p className="font-body text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                  <span className="text-[#0054F9] font-semibold flex items-center gap-1">
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
                className="h-10 px-4 rounded-full bg-[#1A1A28] hover:bg-[#222234] border border-white/10 text-white font-code text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Phone size={14} className="text-[#0054F9]" />
                <span>Call Artisan</span>
              </a>
              <Link href="/dashboard/customer/bookings">
                <button className="catalis-btn catalis-btn-secondary h-10 px-4 text-xs font-display">
                  Details
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. AI QUICK DISPATCH BAR */}
      <div className="p-6 rounded-[2rem] bg-[#111118] border border-white/8 space-y-4 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#0054F9]" />
            <h3 className="font-display font-bold text-base text-white">
              Instant AI Service Concierge
            </h3>
          </div>
          <span className="text-xs font-code text-zinc-400">Multi-Agent Roman Urdu & English</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="e.g. Mere ghar ka AC pani leak kar raha hai aur cooling nahi kar raha..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-4 py-3.5 pl-11 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#0054F9]"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          </div>

          <Link href={`/services?query=${encodeURIComponent(searchQuery)}`} className="w-full sm:w-auto">
            <button className="catalis-btn catalis-btn-primary w-full sm:w-auto px-6 py-3.5 text-xs font-display font-bold shadow-[0_0_20px_rgba(0,84,249,0.3)] flex items-center justify-center gap-2">
              <Zap size={16} />
              <span>Dispatch via AI</span>
            </button>
          </Link>
        </div>
      </div>

      {/* 4. VERIFIED ARTISANS PREVIEW CAROUSEL */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#0054F9]" />
              <span>Top Rated Master Artisans in Your Metro</span>
            </h2>
            <p className="font-body text-xs text-zinc-400 mt-0.5">
              100% NADRA verified with guaranteed warranty and emergency dispatch availability.
            </p>
          </div>
          <Link
            href="/dashboard/customer/providers"
            className="text-xs font-code text-[#0054F9] hover:underline flex items-center gap-1"
          >
            <span>View All Directory</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURED_ARTISANS.map((artisan) => (
            <div
              key={artisan.id}
              className="p-5 rounded-[2rem] bg-[#111118] border border-white/8 hover:border-[#0054F9]/40 transition-all space-y-4 shadow-lg group"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0054F9]/10 border border-[#0054F9]/30 text-[#0054F9] flex items-center justify-center font-display font-bold text-lg shrink-0">
                  {artisan.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-sm text-white truncate">
                      {artisan.name}
                    </h3>
                    <ShieldCheck size={14} className="text-[#0054F9] shrink-0" />
                  </div>
                  <p className="font-body text-xs text-[#D4A843] font-semibold truncate">
                    {artisan.trade}
                  </p>
                  <p className="font-body text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} className="text-[#0054F9]" />
                    {artisan.area}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                <div className="flex items-center gap-1 text-[#D4A843] font-code font-bold">
                  <Star size={13} fill="#D4A843" />
                  <span>{artisan.rating}</span>
                  <span className="text-zinc-500 font-normal">({artisan.reviewsCount})</span>
                </div>

                <span className="font-code font-bold text-white">
                  from PKR {artisan.startingPrice.toLocaleString()}
                </span>
              </div>

              <Link href="/dashboard/customer/providers" className="block">
                <button className="catalis-btn catalis-btn-secondary w-full py-2.5 text-xs font-display font-bold">
                  Book Artisan
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
