"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api, AdminStats } from "@/lib/api";
import {
  ShieldCheck,
  Users,
  Wrench,
  CalendarCheck,
  Bot,
  Activity,
  Award,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Seeded Pakistani High-Active Customers Leaderboard
const CUSTOMER_LEADERBOARD = [
  {
    id: "c-01",
    name: "Dr. Ayesha Siddiqui",
    email: "ayesha.siddiqui@aku.edu.pk",
    metro: "Clifton, Karachi",
    totalBookings: 24,
    lifetimeSpend: "PKR 98,500",
    tier: "Titanium",
    tierColor: "bg-[#34D399]/15 text-[#34D399] border-[#34D399]/40",
    favoriteTrade: "AC Technician & Detailing",
    lastActive: "Today at 02:30 PM",
  },
  {
    id: "c-02",
    name: "Hamza Tariq",
    email: "hamza.tariq@systems.ltd",
    metro: "Sector F-10, Islamabad",
    totalBookings: 19,
    lifetimeSpend: "PKR 76,200",
    tier: "Platinum",
    tierColor: "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/40",
    favoriteTrade: "Solar & Inverter Engineer",
    lastActive: "Yesterday",
  },
  {
    id: "c-03",
    name: "Bilal Cheema",
    email: "b.cheema@descon.pk",
    metro: "DHA Phase 5, Lahore",
    totalBookings: 16,
    lifetimeSpend: "PKR 64,800",
    tier: "Platinum",
    tierColor: "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/40",
    favoriteTrade: "Hydro Plumbing & Sanitary",
    lastActive: "3 days ago",
  },
  {
    id: "c-04",
    name: "Zainab Bokhari",
    email: "zainab.b@lums.edu.pk",
    metro: "Gulberg, Lahore",
    totalBookings: 12,
    lifetimeSpend: "PKR 49,000",
    tier: "Gold",
    tierColor: "bg-[#D4A843]/15 text-[#D4A843] border-[#D4A843]/40",
    favoriteTrade: "STEM Mentorship & Tutoring",
    lastActive: "1 week ago",
  },
  {
    id: "c-05",
    name: "Saad Farooqi",
    email: "saad.f@engro.com",
    metro: "PECHS Block 2, Karachi",
    totalBookings: 11,
    lifetimeSpend: "PKR 42,500",
    tier: "Gold",
    tierColor: "bg-[#D4A843]/15 text-[#D4A843] border-[#D4A843]/40",
    favoriteTrade: "Deep Sanitization & Steam",
    lastActive: "2 weeks ago",
  },
];

// Seeded Top Provider Master Artisans Leaderboard
const PROVIDER_LEADERBOARD = [
  {
    id: "p-01",
    name: "Tariq Mehmood",
    category: "AC Technician & HVAC",
    metro: "Sector G-13, Islamabad",
    rating: 4.96,
    completedJobs: 142,
    onTimeRate: "99.4%",
    grossRevenue: "PKR 355,000",
    rankBadge: "🥇 Rank #1",
    badgeColor: "bg-[#D4A843]/20 text-[#D4A843] border-[#D4A843]/40",
  },
  {
    id: "p-02",
    name: "Bilal Ahmed",
    category: "Solar & Electrical Systems",
    metro: "DHA Phase 5, Lahore",
    rating: 4.98,
    completedJobs: 128,
    onTimeRate: "98.8%",
    grossRevenue: "PKR 410,000",
    rankBadge: "🥈 Rank #2",
    badgeColor: "bg-[#94A3B8]/20 text-[#E2E8F0] border-[#94A3B8]/40",
  },
  {
    id: "p-03",
    name: "Arshad Hussain",
    category: "Hydro & Sanitary Engineering",
    metro: "Gulshan Block 4, Karachi",
    rating: 4.94,
    completedJobs: 119,
    onTimeRate: "97.5%",
    grossRevenue: "PKR 238,000",
    rankBadge: "🥉 Rank #3",
    badgeColor: "bg-[#B45309]/20 text-[#F59E0B] border-[#B45309]/40",
  },
  {
    id: "p-04",
    name: "Dr. Usman Farooq",
    category: "Academic STEM Mentorship",
    metro: "Johar Town, Lahore",
    rating: 4.99,
    completedJobs: 89,
    onTimeRate: "100%",
    grossRevenue: "PKR 445,000",
    rankBadge: "Top STEM",
    badgeColor: "bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40",
  },
  {
    id: "p-05",
    name: "Kamran Rafiq",
    category: "Automotive ECU & OBD2",
    metro: "Sector F-10, Islamabad",
    rating: 4.92,
    completedJobs: 116,
    onTimeRate: "96.9%",
    grossRevenue: "PKR 324,800",
    rankBadge: "Top Auto",
    badgeColor: "bg-[#34D399]/20 text-[#34D399] border-[#34D399]/40",
  },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getStats();
        setStats(data);
      } catch (e) {
        console.error("Failed to load stats", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. TOP HEADER BANNER */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#111C17] via-[#14231D] to-[#0D1813] border border-[#20332B] shadow-[0_16px_40px_rgba(0,0,0,0.4)] overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#34D399]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A2D25] border border-[#2B473A] text-[#34D399] text-xs font-semibold font-code mb-3">
              <ShieldCheck size={13} />
              <span>SUPER ADMIN COMMAND DECK</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-[#F2F7F4] tracking-tight">
              Executive Telemetry & Observability
            </h1>
            <p className="font-body text-xs sm:text-sm text-[#A3B8AF] mt-2 max-w-2xl leading-relaxed">
              Global governance view across Islamabad, Karachi, and Lahore clusters. Monitor active customer spend, provider performance rankings, and 5-agent orchestrator traces.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/dashboard/admin/customers"
              className="h-10 px-4 rounded-xl bg-[#162920] hover:bg-[#1E3B2E] text-[#F2F7F4] border border-[#254234] text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Users size={14} className="text-[#38BDF8]" />
              <span>Customer CRUD</span>
            </Link>
            <Link
              href="/dashboard/admin/providers"
              className="h-10 px-4 rounded-xl bg-[#162920] hover:bg-[#1E3B2E] text-[#F2F7F4] border border-[#254234] text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Wrench size={14} className="text-[#D4A843]" />
              <span>Provider Roster</span>
            </Link>
            <Link
              href="/traces"
              className="h-10 px-4 rounded-xl bg-[#34D399] hover:bg-[#2EB885] text-[#090E0C] font-display font-bold text-xs flex items-center gap-2 transition-all"
            >
              <Activity size={14} />
              <span>Live Traces</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. FIVE TELEMETRY KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {[
          {
            title: "Total GMV Volume",
            value: "PKR 1,482,000",
            sub: "Cumulative verified jobs",
            badge: "+18.4% WoW",
            icon: TrendingUp,
            badgeColor: "text-[#34D399] bg-[#162D23]",
          },
          {
            title: "Active Bookings",
            value: stats?.total_bookings ?? 34,
            sub: "Atomic PostgreSQL slots",
            badge: "0 Lock Conflicts",
            icon: CalendarCheck,
            badgeColor: "text-[#38BDF8] bg-[#0E202B]",
          },
          {
            title: "Agent Sessions",
            value: stats?.total_sessions ?? 48,
            sub: "Multi-lingual Vapi/Chat",
            badge: "99.4% Accuracy",
            icon: Bot,
            badgeColor: "text-[#34D399] bg-[#162D23]",
          },
          {
            title: "Vetted Master Artisans",
            value: stats?.active_providers ?? 24,
            sub: "NADRA Biometric verified",
            badge: "3 Metros Online",
            icon: Wrench,
            badgeColor: "text-[#D4A843] bg-[#292212]",
          },
          {
            title: "Median Agent Latency",
            value: "840ms",
            sub: "Sub-second 5-agent hop",
            badge: "< 1.2s SLA",
            icon: Clock,
            badgeColor: "text-[#34D399] bg-[#162D23]",
          },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#111C17] border border-[#20332B] hover:border-[#34D399]/40 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.25)] flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-bold text-[11px] uppercase tracking-wider text-[#8BA499]">
                  {kpi.title}
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#162D23] border border-[#263F34] flex items-center justify-center text-[#34D399]">
                  <Icon size={14} />
                </div>
              </div>

              <div className="my-1.5">
                <span className="font-display font-extrabold text-xl sm:text-2xl text-[#F2F7F4] tracking-tight group-hover:text-[#34D399] transition-colors">
                  {kpi.value}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1C2E25] text-[10px]">
                <span className="font-body text-[#6B8579] truncate">{kpi.sub}</span>
                <span className={`font-code px-1.5 py-0.5 rounded font-semibold shrink-0 ml-1 ${kpi.badgeColor}`}>
                  {kpi.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. TWO LEADERBOARDS SIDE-BY-SIDE (User Requested) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Top Customers Leaderboard */}
        <div className="rounded-3xl bg-[#111C17] border border-[#20332B] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.3)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1C2E25]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0E202B] border border-[#18394D] text-[#38BDF8] flex items-center justify-center">
                  <Award size={16} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#F2F7F4]">
                    High-Active Customers Leaderboard
                  </h3>
                  <p className="text-[11px] text-[#8BA499]">
                    Top clients by booking frequency & marketplace expenditure
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/admin/customers"
                className="text-xs text-[#38BDF8] hover:underline font-semibold flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="space-y-2.5">
              {CUSTOMER_LEADERBOARD.map((cust, idx) => (
                <div
                  key={cust.id}
                  className="p-3.5 rounded-2xl bg-[#0B1310] border border-[#1F3329] hover:border-[#38BDF8]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#14221B] border border-[#233B2F] text-[#F2F7F4] flex items-center justify-center font-display font-bold text-xs shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-xs text-[#F2F7F4]">
                          {cust.name}
                        </span>
                        <span className={`px-2 py-0.2 rounded-full border text-[9px] font-code font-bold ${cust.tierColor}`}>
                          {cust.tier}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6B8579] block">
                        {cust.metro} · <span className="text-[#8EAAA0]">{cust.favoriteTrade}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#1A2C23]">
                    <span className="font-display font-bold text-xs text-[#34D399]">
                      {cust.lifetimeSpend}
                    </span>
                    <span className="font-code text-[10px] text-[#8BA499]">
                      {cust.totalBookings} Completed Jobs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Top Provider Master Artisans Leaderboard */}
        <div className="rounded-3xl bg-[#111C17] border border-[#20332B] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.3)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1C2E25]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#292212] border border-[#473B1F] text-[#D4A843] flex items-center justify-center">
                  <Award size={16} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#F2F7F4]">
                    Top Master Artisans Leaderboard
                  </h3>
                  <p className="text-[11px] text-[#8BA499]">
                    Highest customer rating, on-time arrivals & completion velocity
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/admin/providers"
                className="text-xs text-[#D4A843] hover:underline font-semibold flex items-center gap-1"
              >
                <span>View Roster</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="space-y-2.5">
              {PROVIDER_LEADERBOARD.map((artisan) => (
                <div
                  key={artisan.id}
                  className="p-3.5 rounded-2xl bg-[#0B1310] border border-[#1F3329] hover:border-[#D4A843]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#162D23] border border-[#2B493B] text-[#34D399] flex items-center justify-center font-display font-bold text-xs shrink-0">
                      {artisan.rating}★
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-xs text-[#F2F7F4]">
                          {artisan.name}
                        </span>
                        <span className={`px-2 py-0.2 rounded-full border text-[9px] font-code font-bold ${artisan.badgeColor}`}>
                          {artisan.rankBadge}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6B8579] block">
                        {artisan.category} · <span className="text-[#8EAAA0]">{artisan.metro}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#1A2C23]">
                    <span className="font-display font-bold text-xs text-[#F2F7F4]">
                      {artisan.completedJobs} Jobs ({artisan.onTimeRate})
                    </span>
                    <span className="font-code text-[10px] text-[#D4A843]">
                      {artisan.grossRevenue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. FAST SHORTCUT TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/dashboard/admin/customers"
          className="p-5 rounded-2xl bg-[#111C17] border border-[#20332B] hover:border-[#34D399]/40 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#162D23] text-[#34D399] flex items-center justify-center">
              <Users size={18} />
            </div>
            <div>
              <span className="font-display font-bold text-sm text-[#F2F7F4] block">
                Manage Customers
              </span>
              <span className="text-xs text-[#8EAAA0]">Search, edit, suspend & create accounts</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#5E796F] group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/dashboard/admin/providers"
          className="p-5 rounded-2xl bg-[#111C17] border border-[#20332B] hover:border-[#34D399]/40 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#292212] text-[#D4A843] flex items-center justify-center">
              <Wrench size={18} />
            </div>
            <div>
              <span className="font-display font-bold text-sm text-[#F2F7F4] block">
                Provider Roster CRUD
              </span>
              <span className="text-xs text-[#8EAAA0]">NADRA vetting, pricing & specialties</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#5E796F] group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/dashboard/admin/settings"
          className="p-5 rounded-2xl bg-[#111C17] border border-[#20332B] hover:border-[#34D399]/40 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#122119] text-[#38BDF8] flex items-center justify-center">
              <Activity size={18} />
            </div>
            <div>
              <span className="font-display font-bold text-sm text-[#F2F7F4] block">
                Platform Settings
              </span>
              <span className="text-xs text-[#8EAAA0]">Cluster configs, commissions & Vapi</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#5E796F] group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
