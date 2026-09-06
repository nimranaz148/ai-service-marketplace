"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Wrench,
  CalendarCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  TrendingUp,
  Star,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(true);

  const toggleOnline = () => {
    setIsOnline(!isOnline);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. TOP ARTISAN DISPATCH STATUS BANNER */}
      <div className="relative rounded-[2rem] p-6 sm:p-8 bg-[#111118] border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#D4A843]/15 blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#D4A843]/15 border border-[#D4A843]/30 text-[#D4A843] flex items-center justify-center font-display font-extrabold text-2xl shrink-0 shadow-[0_0_20px_rgba(212,168,67,0.2)]">
              {user?.avatar || "TM"}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-code uppercase font-bold text-[#D4A843] tracking-wider">
                  Master Artisan Profile
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-code text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <ShieldCheck size={11} />
                  <span>NADRA Verified</span>
                </span>
              </div>

              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                Welcome back, {user?.name || "Tariq Mehmood"}
              </h1>
              <p className="font-body text-xs text-zinc-400 mt-1 flex items-center gap-2">
                <span className="text-[#D4A843] font-semibold">{user?.category || "AC Technician & HVAC"}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><MapPin size={12} className="text-[#0054F9]" /> {user?.area || "Sector G-13, Islamabad"}</span>
              </p>
            </div>
          </div>

          {/* Dispatch Readiness Toggle Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={toggleOnline}
              className={`h-12 px-5 rounded-full border font-display font-bold text-xs flex items-center gap-2.5 transition-all cursor-pointer shadow-lg active:scale-95 ${
                isOnline
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.2)]"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
              <span>{isOnline ? "ONLINE — Ready for Dispatch" : "BUSY — In Field"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. ARTISAN TELEMETRY KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Today's Appointments",
            value: "3 Jobs",
            sub: "Next slot at 02:00 PM",
            badge: "2 Pending Confirmation",
            icon: CalendarCheck,
            color: "text-[#D4A843] bg-[#D4A843]/10",
          },
          {
            title: "Monthly Earnings",
            value: "PKR 142,500",
            sub: "Escrow payments deposited",
            badge: "+22% vs Last Month",
            icon: TrendingUp,
            color: "text-emerald-400 bg-emerald-500/10",
          },
          {
            title: "Artisan Rating",
            value: "4.96 ★",
            sub: "Based on 142 client reviews",
            badge: "Top 1% Tier",
            icon: Star,
            color: "text-[#D4A843] bg-[#D4A843]/10",
          },
          {
            title: "On-Time Arrival Rate",
            value: "99.4%",
            sub: "Average ETA: 18 mins",
            badge: "Zero Delays",
            icon: Clock,
            color: "text-[#0054F9] bg-[#0054F9]/10",
          },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#111118] border border-white/8 hover:border-[#D4A843]/40 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.3)] flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-display font-bold text-xs uppercase tracking-wider text-zinc-400">
                  {kpi.title}
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${kpi.color}`}>
                  <Icon size={15} />
                </div>
              </div>

              <div className="mb-2">
                <span className="font-display font-extrabold text-2xl text-white tracking-tight group-hover:text-[#D4A843] transition-colors">
                  {kpi.value}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                <span className="font-body text-[11px] text-zinc-400 truncate">{kpi.sub}</span>
                <span className="font-code text-[10px] px-2 py-0.5 rounded bg-[#141420] text-emerald-400 font-semibold shrink-0 ml-1">
                  {kpi.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. ACTIVE QUEUE & QUICK SHORTCUTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Assigned Job Alert Card */}
        <div className="lg:col-span-2 rounded-[2rem] bg-[#111118] border border-white/8 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.4)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0054F9] animate-ping" />
              <h3 className="font-display font-bold text-base text-white">
                Next Scheduled Job in Queue
              </h3>
            </div>
            <Link
              href="/dashboard/provider/bookings"
              className="text-xs text-[#0054F9] hover:underline font-semibold flex items-center gap-1"
            >
              <span>View All Bookings</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-[#141420] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-white">
                  Dr. Ayesha Siddiqui
                </span>
                <span className="px-2 py-0.2 rounded-full bg-[#0054F9]/20 text-[#0054F9] text-[10px] font-code font-bold">
                  Token: BK-8011
                </span>
              </div>
              <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                <MapPin size={13} className="text-[#0054F9]" />
                <span>Sector G-13/2, Islamabad · 1.2 km away</span>
              </p>
              <p className="text-xs text-zinc-300 italic">
                &ldquo;Inverter AC cooling trip ho rahi hai, continuous E6 error display.&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/dashboard/provider/bookings"
                className="catalis-btn catalis-btn-primary h-10 px-4 text-xs font-display font-bold shadow-[0_0_20px_rgba(0,84,249,0.3)] flex items-center gap-1.5"
              >
                <span>Manage Job</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Hub Navigation Links */}
        <div className="rounded-[2rem] bg-[#111118] border border-white/8 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.4)] flex flex-col justify-between space-y-3">
          <div className="pb-3 border-b border-white/5">
            <h3 className="font-display font-bold text-base text-white">
              Artisan Operations
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">Quick access to services and scheduling</p>
          </div>

          <div className="space-y-2.5">
            <Link
              href="/dashboard/provider/services"
              className="p-3.5 rounded-2xl bg-[#141420] border border-white/5 hover:border-[#D4A843]/50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#D4A843]/15 text-[#D4A843] flex items-center justify-center">
                  <Layers size={16} />
                </div>
                <div>
                  <span className="font-display font-bold text-xs text-white block">
                    Services CRUD & Preview
                  </span>
                  <span className="text-[10px] text-zinc-400">Live client card preview</span>
                </div>
              </div>
              <ChevronRight size={14} className="text-zinc-500 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/dashboard/provider/slots"
              className="p-3.5 rounded-2xl bg-[#141420] border border-white/5 hover:border-[#0054F9]/50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#0054F9]/15 text-[#0054F9] flex items-center justify-center">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="font-display font-bold text-xs text-white block">
                    Availability & Open Slots
                  </span>
                  <span className="text-[10px] text-zinc-400">Manage appointment times</span>
                </div>
              </div>
              <ChevronRight size={14} className="text-zinc-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
