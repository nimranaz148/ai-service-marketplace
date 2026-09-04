"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  CalendarCheck,
  Users,
  Home,
  ArrowUpRight,
  Database,
  Cpu,
  Radio,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/services", label: "Agents & Services", icon: LayoutDashboard },
  { href: "/traces", label: "Diagnostic Traces", icon: Activity },
  { href: "/bookings", label: "Live Bookings", icon: CalendarCheck },
  { href: "/providers", label: "Verified Artisans", icon: Users },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "") {
    return <>{children}</>;
  }

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <div className="flex min-h-screen bg-[#090E0C] font-body text-[#F2F7F4]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#0D1612] border-r border-[#1C2C24] flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.4)]">
        <div>
          {/* Logo Bar */}
          <div className="p-5 border-b border-[#1C2C24]">
            <Link href="/" className="flex items-center gap-3 text-decoration-none group">
              <div className="w-8 h-8 rounded-lg bg-[#162D23] border border-[#2A493A] text-[#34D399] flex items-center justify-center font-display font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                A
              </div>
              <div>
                <span className="font-display font-bold text-base text-[#F2F7F4] block leading-none">
                  ATELIER AI
                </span>
                <span className="font-code text-[10px] text-[#6B877B] block mt-0.5">
                  Concierge Console
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <Link
              href="/"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#8EAAA0] hover:bg-[#14221B] hover:text-[#F2F7F4] transition-colors mb-2 border border-transparent hover:border-[#1E3328]"
            >
              <span className="flex items-center gap-2">
                <Home size={15} />
                <span>Return to Landing</span>
              </span>
              <ArrowUpRight size={13} />
            </Link>

            <div className="font-code text-[10px] uppercase font-bold text-[#5E796F] tracking-wider px-3 py-2">
              Operations
            </div>

            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-[#162920] text-[#34D399] border border-[#254234] shadow-sm"
                      : "text-[#8EAAA0] hover:bg-[#121E18] hover:text-[#F2F7F4] border border-transparent"
                  }`}
                >
                  <Icon size={15} className={active ? "text-[#34D399]" : "text-[#5E796F]"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System Health Card */}
        <div className="p-3 m-3 rounded-2xl bg-[#0A120E] border border-[#1A2C23]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1A2C23]">
            <span className="font-code text-[10px] uppercase tracking-wider text-[#6B877B] font-bold">
              Gateway Health
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#132A1F] border border-[#214735] text-[#34D399] font-code text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
              Live
            </span>
          </div>

          <div className="space-y-1.5 font-code text-[11px]">
            <div className="flex items-center justify-between text-[#8EAAA0]">
              <span className="flex items-center gap-1.5">
                <Database size={12} className="text-[#D4A843]" />
                <span>Supabase</span>
              </span>
              <span className="font-semibold text-[#F2F7F4]">Postgres 15</span>
            </div>
            <div className="flex items-center justify-between text-[#8EAAA0]">
              <span className="flex items-center gap-1.5">
                <Cpu size={12} className="text-[#34D399]" />
                <span>Orchestrator</span>
              </span>
              <span className="font-semibold text-[#F2F7F4]">5 Sub-Agents</span>
            </div>
            <div className="flex items-center justify-between text-[#8EAAA0]">
              <span className="flex items-center gap-1.5">
                <Radio size={12} className="text-[#34D399]" />
                <span>Voice RTC</span>
              </span>
              <span className="font-semibold text-[#F2F7F4]">Vapi 16kHz</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#090E0C]">
        {/* Top Header */}
        <header className="h-14 px-8 bg-[#0D1612]/90 backdrop-blur-md border-b border-[#1C2C24] flex items-center justify-between sticky top-0 z-30 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2 text-xs font-body text-[#8EAAA0]">
            <ShieldCheck size={15} className="text-[#34D399]" />
            <span>Active Operations Cluster:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#162920] border border-[#254234] text-[#34D399] font-code font-bold text-[11px]">
              Islamabad · Karachi · Lahore
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-code text-xs px-2.5 py-1 rounded-lg bg-[#0A120E] border border-[#1C2C24] text-[#A3B8AF] font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-ping" />
              Vapi WebRTC Mode: ONLINE
            </span>
          </div>
        </header>

        {/* Child Views */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
