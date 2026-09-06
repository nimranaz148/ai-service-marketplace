"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/lib/auth-context";
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
  Wrench,
  UserCheck,
  LogOut,
  Sparkles,
  ChevronDown,
  Layers,
  Settings,
  MapPin,
  Lock,
  ArrowRight,
  CheckCircle2,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon | React.ComponentType<{ size?: number | string; className?: string }>;
}

const ADMIN_NAV: NavItem[] = [
  { href: "/dashboard/admin", label: "Operations Executive", icon: LayoutDashboard },
  { href: "/dashboard/admin/customers", label: "Customer Management", icon: Users },
  { href: "/dashboard/admin/providers", label: "Provider Roster", icon: Wrench },
  { href: "/traces", label: "5-Agent Traces", icon: Activity },
  { href: "/bookings", label: "Live Bookings", icon: CalendarCheck },
  { href: "/services", label: "Agent Sandbox", icon: Cpu },
  { href: "/dashboard/admin/settings", label: "Platform Governance", icon: Settings },
];

const PROVIDER_NAV: NavItem[] = [
  { href: "/dashboard/provider", label: "Artisan Command HUD", icon: LayoutDashboard },
  { href: "/dashboard/provider/bookings", label: "Assigned Customers", icon: CalendarCheck },
  { href: "/dashboard/provider/services", label: "Services & Preview", icon: Layers },
  { href: "/dashboard/provider/slots", label: "Calendar & Slots", icon: Activity },
];

const CUSTOMER_NAV: NavItem[] = [
  { href: "/dashboard/customer", label: "Concierge Hub", icon: LayoutDashboard },
  { href: "/dashboard/customer/providers", label: "Verified Artisans", icon: Users },
  { href: "/dashboard/customer/bookings", label: "My Bookings Ledger", icon: CalendarCheck },
  { href: "/services", label: "AI Voice & Chat Sandbox", icon: Cpu },
  { href: "/dashboard/customer/profile", label: "Saved Addresses", icon: MapPin },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, switchRole, loginAsDemo } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  // Allow landing page and auth pages without sidebar
  if (
    pathname === "/" ||
    pathname === "" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/provider/login") ||
    pathname.startsWith("/provider/signup") ||
    pathname.startsWith("/admin/login")
  ) {
    return <>{children}</>;
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-[#0054F9] flex items-center justify-center font-display">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0054F9]/10 border border-[#0054F9] animate-spin shadow-[0_0_20px_rgba(0,84,249,0.3)]" />
          <span className="text-xs font-code tracking-wider uppercase text-zinc-400">
            Validating Persona Credentials...
          </span>
        </div>
      </div>
    );
  }

  // Auth Gatekeeper: if not authenticated, display login interception screen
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-[#F4F4F6] flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden font-body selection:bg-[#0054F9] selection:text-white">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0054F9]/15 rounded-full blur-[140px] pointer-events-none" />

        <header className="flex items-center justify-between border-b border-white/8 pb-5 relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-[#0054F9] text-white flex items-center justify-center font-display font-bold text-sm shadow-[0_0_15px_rgba(0,84,249,0.4)] group-hover:scale-105 transition-transform">
              C
            </div>
            <div>
              <span className="font-display font-bold text-base text-white block leading-none">
                CATALIS ATELIER
              </span>
              <span className="font-code text-[10px] text-zinc-400 block mt-0.5">
                Role Gatekeeper
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="text-xs text-zinc-400 hover:text-white font-medium transition-colors"
          >
            ← Return to Landing
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center my-8 relative z-10">
          <div className="w-full max-w-lg p-7 sm:p-9 rounded-[2rem] bg-[#111118]/95 border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.8)] text-center backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-[#0054F9]/10 border border-[#0054F9]/30 text-[#0054F9] flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(0,84,249,0.2)]">
              <Lock size={24} />
            </div>

            <h2 className="font-display font-bold text-2xl text-white tracking-tight">
              Authentication Required
            </h2>
            <p className="font-body text-xs text-zinc-400 mt-2 max-w-sm mx-auto leading-relaxed">
              You must sign in to your Atelier profile to access role-governed operations, telemetry, and bookings.
            </p>

            {/* Quick Demo Login Option */}
            <div className="mt-6 p-4 rounded-2xl bg-[#0A0A0F] border border-white/8 text-left">
              <span className="font-code text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-3 text-center">
                ⚡ 1-Click Instant Demo Login:
              </span>
              <div className="space-y-2">
                <button
                  onClick={() => loginAsDemo("admin")}
                  className="w-full p-3 rounded-xl bg-[#14141E] hover:bg-[#1A1A28] border border-white/5 hover:border-[#0054F9]/50 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className="text-[#0054F9]" />
                    <div>
                      <span className="font-display font-bold text-xs text-white block">
                        Super Admin Console
                      </span>
                      <span className="text-[10px] text-zinc-400 block font-code">
                        CRUDs · Leaderboards · Latency Telemetry
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={13} className="text-[#0054F9] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => loginAsDemo("provider")}
                  className="w-full p-3 rounded-xl bg-[#14141E] hover:bg-[#1A1A28] border border-white/5 hover:border-[#D4A843]/50 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Wrench size={16} className="text-[#D4A843]" />
                    <div>
                      <span className="font-display font-bold text-xs text-white block">
                        Master Artisan (Tariq Mehmood)
                      </span>
                      <span className="text-[10px] text-zinc-400 block font-code">
                        Assigned Jobs · Services CRUD · Live Preview Card
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={13} className="text-[#D4A843] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => loginAsDemo("customer")}
                  className="w-full p-3 rounded-xl bg-[#14141E] hover:bg-[#1A1A28] border border-white/5 hover:border-[#38BDF8]/50 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <UserCheck size={16} className="text-[#38BDF8]" />
                    <div>
                      <span className="font-display font-bold text-xs text-white block">
                        Customer (Zubair Khan)
                      </span>
                      <span className="text-[10px] text-zinc-400 block font-code">
                        Voice & Chat Booking · Artisan Directory · Ledger
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={13} className="text-[#38BDF8] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                href="/login"
                className="catalis-btn catalis-btn-primary px-6 py-2.5 text-xs font-display font-bold shadow-[0_0_20px_rgba(0,84,249,0.3)]"
              >
                Sign In With Credentials
              </Link>
              <Link
                href="/signup"
                className="catalis-btn catalis-btn-secondary px-6 py-2.5 text-xs font-display font-semibold"
              >
                Create Account
              </Link>
            </div>
          </div>
        </main>

        <footer className="text-center text-[11px] font-code text-zinc-500 border-t border-white/8 pt-4 relative z-10">
          Catalis Atelier AI Multi-Agent Marketplace &copy; 2026. Pakistan Clusters (ISB · KHI · LHE).
        </footer>
      </div>
    );
  }

  // Active role-dependent navigation menu
  const currentNav =
    user.role === "admin"
      ? ADMIN_NAV
      : user.role === "provider"
      ? PROVIDER_NAV
      : CUSTOMER_NAV;

  const roleLabel =
    user.role === "admin"
      ? "Super Admin"
      : user.role === "provider"
      ? "Master Artisan"
      : "Customer";

  const roleBadgeColor =
    user.role === "admin"
      ? "bg-[#0054F9]/15 text-[#0054F9] border-[#0054F9]/30"
      : user.role === "provider"
      ? "bg-[#D4A843]/15 text-[#D4A843] border-[#D4A843]/30"
      : "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30";

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <div className="flex min-h-screen bg-[#0A0A0F] font-body text-[#F4F4F6] selection:bg-[#0054F9] selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#0D0D14] border-r border-white/8 flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
        <div>
          {/* Logo Bar */}
          <div className="p-5 border-b border-white/8">
            <Link href="/" className="flex items-center gap-3 text-decoration-none group">
              <div className="w-8 h-8 rounded-xl bg-[#0054F9] text-white flex items-center justify-center font-display font-bold text-sm shadow-[0_0_15px_rgba(0,84,249,0.4)] group-hover:scale-105 transition-transform">
                C
              </div>
              <div>
                <span className="font-display font-bold text-base text-white block leading-none">
                  CATALIS ATELIER
                </span>
                <span className="font-code text-[10px] text-zinc-400 block mt-0.5">
                  {roleLabel} Console
                </span>
              </div>
            </Link>
          </div>

          {/* User Profile Card in Sidebar */}
          <div className="p-3.5 mx-3 mt-3 rounded-2xl bg-[#11111A] border border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-[#0054F9]/20 border border-[#0054F9]/30 text-[#0054F9] flex items-center justify-center font-display font-bold text-xs shrink-0">
                {user.avatar || user.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <span className="font-display font-bold text-xs text-white block truncate">
                  {user.name}
                </span>
                <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-code font-bold uppercase border ${roleBadgeColor}`}>
                  {user.role}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="text-zinc-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <LogOut size={14} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 mt-2">
            <Link
              href="/"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors mb-2 border border-transparent hover:border-white/5"
            >
              <span className="flex items-center gap-2">
                <Home size={15} />
                <span>Landing Page</span>
              </span>
              <ArrowUpRight size={13} />
            </Link>

            <div className="font-code text-[10px] uppercase font-bold text-zinc-500 tracking-wider px-3 py-1.5">
              {roleLabel} Menu
            </div>

            {currentNav.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-[#0054F9]/15 text-[#0054F9] border border-[#0054F9]/40 shadow-[0_0_15px_rgba(0,84,249,0.15)]"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent"
                  }`}
                >
                  <Icon size={15} className={active ? "text-[#0054F9]" : "text-zinc-500"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* System Health Card */}
        <div className="p-3 m-3 rounded-2xl bg-[#0B0B10] border border-white/8">
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/5">
            <span className="font-code text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
              Gateway Health
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-code text-[9px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>

          <div className="space-y-1.5 font-code text-[10px]">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1">
                <Database size={11} className="text-[#D4A843]" />
                <span>Supabase</span>
              </span>
              <span className="font-semibold text-white">Active Pool</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1">
                <Cpu size={11} className="text-[#0054F9]" />
                <span>Orchestrator</span>
              </span>
              <span className="font-semibold text-white">5 Agents</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1">
                <Radio size={11} className="text-[#0054F9]" />
                <span>Voice RTC</span>
              </span>
              <span className="font-semibold text-white">Vapi 16kHz</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0A0A0F]">
        {/* Top Header */}
        <header className="h-14 px-6 sm:px-8 bg-[#0D0D14]/90 backdrop-blur-md border-b border-white/8 flex items-center justify-between sticky top-0 z-30 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full bg-[#141420] border border-white/10 text-zinc-300 font-code font-bold text-[11px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ISB · KHI · LHE Clustered</span>
            </span>

            <span className="hidden sm:inline-flex text-xs text-zinc-400 font-code">
              Active Persona: <strong className="text-white ml-1">{roleLabel}</strong>
            </span>
          </div>

          {/* Quick Role Switcher Interactive Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="h-8 px-3 rounded-full bg-[#141420] hover:bg-[#1A1A28] border border-white/10 text-xs font-semibold text-white flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Sparkles size={13} className="text-[#0054F9]" />
              <span className="hidden md:inline text-[11px] text-zinc-400">Switch Role:</span>
              <span className="font-bold text-[11px] capitalize text-[#0054F9]">{user.role}</span>
              <ChevronDown size={13} className="text-zinc-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#11111A] border border-white/10 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <span className="block px-3 py-1.5 text-[10px] font-code uppercase font-bold text-zinc-400">
                  Change Active Persona:
                </span>
                {(["admin", "provider", "customer"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold capitalize flex items-center justify-between transition-colors cursor-pointer ${
                      user.role === r
                        ? "bg-[#0054F9]/15 text-[#0054F9] font-bold"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {r === "admin" && <ShieldCheck size={14} className="text-[#0054F9]" />}
                      {r === "provider" && <Wrench size={14} className="text-[#D4A843]" />}
                      {r === "customer" && <UserCheck size={14} className="text-[#38BDF8]" />}
                      <span>{r === "admin" ? "Super Admin" : r === "provider" ? "Master Artisan" : "Customer"}</span>
                    </div>
                    {user.role === r && <CheckCircle2 size={13} className="text-[#0054F9]" />}
                  </button>
                ))}

                <div className="border-t border-white/8 my-1 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setRoleMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Child Views */}
        <main className="flex-1 p-5 sm:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
