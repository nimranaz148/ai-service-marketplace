"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Wrench,
  CalendarCheck,
  Star,
  TrendingUp,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Layers,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/Toaster";

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(true);

  const toggleOnline = () => {
    const next = !isOnline;
    setIsOnline(next);
    toast.info(`Dispatch Status: ${next ? "ONLINE — Ready for New Jobs" : "IN FIELD — Busy with Job"}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. ARTISAN COMMAND BANNER */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#17130B] via-[#1E190E] to-[#120F08] border border-[#3D3017] shadow-[0_16px_40px_rgba(0,0,0,0.4)] overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#D4A843]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#292212] border border-[#473B1F] text-[#D4A843] flex items-center justify-center font-display font-black text-2xl shrink-0 shadow-inner">
              {user?.avatar || "TM"}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#292212] border border-[#473B1F] text-[#D4A843] text-xs font-code font-bold">
                  MASTER ARTISAN CONSOLE
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-code text-[#34D399] bg-[#132A1F] px-2 py-0.5 rounded border border-[#214735]">
                  <ShieldCheck size={11} />
                  <span>NADRA Verified</span>
                </span>
              </div>

              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F2F7F4] tracking-tight">
                Welcome back, {user?.name || "Tariq Mehmood"}
              </h1>
              <p className="font-body text-xs text-[#A3B8AF] mt-1 flex items-center gap-2">
                <span className="text-[#D4A843] font-semibold">{user?.category || "AC Technician & HVAC"}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><MapPin size={12} className="text-[#34D399]" /> {user?.area || "Sector G-13, Islamabad"}</span>
              </p>
            </div>
          </div>

          {/* Dispatch Readiness Toggle Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={toggleOnline}
              className={`h-12 px-5 rounded-2xl border font-display font-bold text-xs flex items-center gap-2.5 transition-all cursor-pointer shadow-lg active:scale-95 ${
                isOnline
                  ? "bg-[#132A1F] border-[#34D399] text-[#34D399] shadow-[0_0_20px_rgba(52,211,153,0.2)]"
                  : "bg-[#291316] border-[#EF4444] text-[#EF4444]"
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-[#34D399] animate-pulse" : "bg-[#EF4444]"}`} />
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
            color: "text-[#D4A843] bg-[#292212]",
          },
          {
            title: "Monthly Earnings",
            value: "PKR 142,500",
            sub: "Escrow payments deposited",
            badge: "+22% vs Last Month",
            icon: TrendingUp,
            color: "text-[#34D399] bg-[#162D23]",
          },
          {
            title: "Artisan Rating",
            value: "4.96 ★",
            sub: "Based on 142 client reviews",
            badge: "Top 1% Tier",
            icon: Star,
            color: "text-[#D4A843] bg-[#292212]",
          },
          {
            title: "On-Time Arrival Rate",
            value: "99.4%",
            sub: "Average ETA: 18 mins",
            badge: "Zero Delays",
            icon: Clock,
            color: "text-[#38BDF8] bg-[#0E202B]",
          },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#111C17] border border-[#20332B] hover:border-[#D4A843]/40 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.25)] flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-display font-bold text-xs uppercase tracking-wider text-[#8BA499]">
                  {kpi.title}
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${kpi.color}`}>
                  <Icon size={15} />
                </div>
              </div>

              <div className="mb-2">
                <span className="font-display font-extrabold text-2xl text-[#F2F7F4] tracking-tight group-hover:text-[#D4A843] transition-colors">
                  {kpi.value}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#1C2E25] text-xs">
                <span className="font-body text-[11px] text-[#6B8579] truncate">{kpi.sub}</span>
                <span className="font-code text-[10px] px-2 py-0.5 rounded bg-[#162920] text-[#34D399] font-semibold shrink-0 ml-1">
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
        <div className="lg:col-span-2 rounded-3xl bg-[#111C17] border border-[#20332B] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.3)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1C2E25]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] animate-ping" />
              <h3 className="font-display font-bold text-base text-[#F2F7F4]">
                Next Scheduled Job in Queue
              </h3>
            </div>
            <Link
              href="/dashboard/provider/bookings"
              className="text-xs text-[#34D399] hover:underline font-semibold flex items-center gap-1"
            >
              <span>View All Bookings</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1813] border border-[#243B30] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-[#F2F7F4]">
                  Dr. Ayesha Siddiqui
                </span>
                <span className="px-2 py-0.2 rounded-full bg-[#162D23] text-[#34D399] text-[10px] font-code font-bold">
                  Token: BK-8011
                </span>
              </div>
              <p className="text-xs text-[#8EAAA0] flex items-center gap-1.5">
                <MapPin size={13} className="text-[#34D399]" />
                <span>Sector G-13/2, Islamabad · 1.2 km away</span>
              </p>
              <p className="text-xs text-[#D1E0D9] italic">
                &ldquo;Inverter AC cooling trip ho rahi hai, continuous E6 error display.&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/dashboard/provider/bookings"
                className="h-10 px-4 rounded-xl bg-[#34D399] hover:bg-[#2EB885] text-[#090E0C] font-display font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>Manage Job</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Hub Navigation Links */}
        <div className="rounded-3xl bg-[#111C17] border border-[#20332B] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.3)] flex flex-col justify-between space-y-3">
          <div className="pb-3 border-b border-[#1C2E25]">
            <h3 className="font-display font-bold text-base text-[#F2F7F4]">
              Artisan Operations
            </h3>
            <p className="text-xs text-[#8EAAA0] mt-0.5">Quick access to services and scheduling</p>
          </div>

          <div className="space-y-2.5">
            <Link
              href="/dashboard/provider/services"
              className="p-3.5 rounded-2xl bg-[#090E0C] border border-[#1C2C24] hover:border-[#D4A843]/50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#292212] text-[#D4A843] flex items-center justify-center">
                  <Layers size={16} />
                </div>
                <div>
                  <span className="font-display font-bold text-xs text-[#F2F7F4] block">
                    Services CRUD & Preview
                  </span>
                  <span className="text-[10px] text-[#8EAAA0]">Live client card preview</span>
                </div>
              </div>
              <ChevronRight size={14} className="text-[#5E796F] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/dashboard/provider/slots"
              className="p-3.5 rounded-2xl bg-[#090E0C] border border-[#1C2C24] hover:border-[#34D399]/50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#162D23] text-[#34D399] flex items-center justify-center">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="font-display font-bold text-xs text-[#F2F7F4] block">
                    Availability & Open Slots
                  </span>
                  <span className="text-[10px] text-[#8EAAA0]">Manage appointment times</span>
                </div>
              </div>
              <ChevronRight size={14} className="text-[#5E796F] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
