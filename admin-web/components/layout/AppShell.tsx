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
      <div className="min-h-screen bg-[#090E0C] text-[#34D399] flex items-center justify-center font-display">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#162D23] border border-[#34D399] animate-spin" />
          <span className="text-xs font-code tracking-wider uppercase text-[#8EAAA0]">
            Validating Persona Credentials...
          </span>
        </div>
      </div>
    );
  }

  // Auth Gatekeeper: if not authenticated, display login interception screen
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#090E0C] text-[#F2F7F4] flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden font-body">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#34D399]/10 rounded-full blur-3xl pointer-events-none" />

        <header className="flex items-center justify-between border-b border-[#1C2C24] pb-5 relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-[#162D23] border border-[#2A493A] text-[#34D399] flex items-center justify-center font-display font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
              A
            </div>
            <div>
              <span className="font-display font-bold text-base text-[#F2F7F4] block leading-none">
                ATELIER AI
              </span>
              <span className="font-code text-[10px] text-[#6B877B] block mt-0.5">
                Role Gatekeeper
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="text-xs text-[#8EAAA0] hover:text-[#34D399] font-medium transition-colors"
          >
            ← Return to Landing
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center my-8 relative z-10">
          <div className="w-full max-w-lg p-7 sm:p-9 rounded-3xl bg-[#0D1612]/95 border border-[#1F3329] shadow-[0_24px_64px_rgba(0,0,0,0.7)] text-center backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-[#162D23] border border-[#2B493B] text-[#34D399] flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Lock size={26} />
            </div>

            <h2 className="font-display font-bold text-2xl text-[#F2F7F4] tracking-tight">
              Authentication Required
            </h2>
            <p className="font-body text-xs text-[#8EAAA0] mt-2 max-w-sm mx-auto leading-relaxed">
              You must sign in to your Atelier profile to access role-governed operations, telemetry, and bookings.
            </p>

            {/* Quick Demo Login Option */}
            <div className="mt-6 p-4 rounded-2xl bg-[#090E0C] border border-[#1C2C24] text-left">
              <span className="font-code text-[10px] uppercase font-bold text-[#6B877B] tracking-wider block mb-3 text-center">
                ⚡ 1-Click Instant Demo Login:
              </span>
              <div className="space-y-2">
                <button
                  onClick={() => loginAsDemo("admin")}
                  className="w-full p-2.5 rounded-xl bg-[#14221B] hover:bg-[#1A2E24] border border-[#233B2F] hover:border-[#34D399]/50 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className="text-[#34D399]" />
                    <div>
                      <span className="font-display font-bold text-xs text-[#F2F7F4] block">
                        Super Admin Console
                      </span>
                      <span className="text-[10px] text-[#6B877B] block font-code">
                        CRUDs · Leaderboards · Latency Telemetry
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={13} className="text-[#34D399] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => loginAsDemo("provider")}
                  className="w-full p-2.5 rounded-xl bg-[#14221B] hover:bg-[#1A2E24] border border-[#233B2F] hover:border-[#D4A843]/50 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Wrench size={16} className="text-[#D4A843]" />
                    <div>
                      <span className="font-display font-bold text-xs text-[#F2F7F4] block">
                        Master Artisan (Tariq Mehmood)
                      </span>
                      <span className="text-[10px] text-[#6B877B] block font-code">
                        Assigned Jobs · Services CRUD · Live Preview Card
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={13} className="text-[#D4A843] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <button
                  onClick={() => loginAsDemo("customer")}
                  className="w-full p-2.5 rounded-xl bg-[#14221B] hover:bg-[#1A2E24] border border-[#233B2F] hover:border-[#38BDF8]/50 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <UserCheck size={16} className="text-[#38BDF8]" />
                    <div>
                      <span className="font-display font-bold text-xs text-[#F2F7F4] block">
                        Customer (Zubair Khan)
                      </span>
                      <span className="text-[10px] text-[#6B877B] block font-code">
                        Voice & Chat Booking · Artisan Directory · Ledger
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={13} className="text-[#38BDF8] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-xl bg-[#34D399] hover:bg-[#2EB885] text-[#090E0C] font-display font-bold text-xs transition-all"
              >
                Sign In With Credentials
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 rounded-xl bg-[#162D23] hover:bg-[#1E3B2E] text-[#F2F7F4] font-display font-semibold text-xs border border-[#264434] transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>
        </main>

        <footer className="text-center text-[11px] font-code text-[#5E796F] border-t border-[#1C2C24] pt-4 relative z-10">
          Atelier AI Multi-Agent Marketplace &copy; 2026. Pakistan Clusters (ISB · KHI · LHE).
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
      ? "bg-[#132A1F] text-[#34D399] border-[#214735]"
      : user.role === "provider"
      ? "bg-[#292212] text-[#D4A843] border-[#473B1F]"
      : "bg-[#0E202B] text-[#38BDF8] border-[#18394D]";

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
                  {roleLabel} Console
                </span>
              </div>
            </Link>
          </div>

          {/* User Profile Card in Sidebar */}
          <div className="p-3.5 mx-3 mt-3 rounded-2xl bg-[#090E0C] border border-[#1A2C23] flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-[#162D23] border border-[#2B493B] text-[#34D399] flex items-center justify-center font-display font-bold text-xs shrink-0">
                {user.avatar || user.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <span className="font-display font-bold text-xs text-[#F2F7F4] block truncate">
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
              className="text-[#6B877B] hover:text-[#EF4444] transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <LogOut size={14} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 mt-2">
            <Link
              href="/"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#8EAAA0] hover:bg-[#14221B] hover:text-[#F2F7F4] transition-colors mb-2 border border-transparent hover:border-[#1E3328]"
            >
              <span className="flex items-center gap-2">
                <Home size={15} />
                <span>Landing Page</span>
              </span>
              <ArrowUpRight size={13} />
            </Link>

            <div className="font-code text-[10px] uppercase font-bold text-[#5E796F] tracking-wider px-3 py-1.5">
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
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#1A2C23]">
            <span className="font-code text-[10px] uppercase tracking-wider text-[#6B877B] font-bold">
              Gateway Health
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#132A1F] border border-[#214735] text-[#34D399] font-code text-[9px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
              Live
            </span>
          </div>

          <div className="space-y-1.5 font-code text-[10px]">
            <div className="flex items-center justify-between text-[#8EAAA0]">
              <span className="flex items-center gap-1">
                <Database size={11} className="text-[#D4A843]" />
                <span>Supabase</span>
              </span>
              <span className="font-semibold text-[#F2F7F4]">Active Pool</span>
            </div>
            <div className="flex items-center justify-between text-[#8EAAA0]">
              <span className="flex items-center gap-1">
                <Cpu size={11} className="text-[#34D399]" />
                <span>Orchestrator</span>
              </span>
              <span className="font-semibold text-[#F2F7F4]">5 Agents</span>
            </div>
            <div className="flex items-center justify-between text-[#8EAAA0]">
              <span className="flex items-center gap-1">
                <Radio size={11} className="text-[#34D399]" />
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
        <header className="h-14 px-6 sm:px-8 bg-[#0D1612]/90 backdrop-blur-md border-b border-[#1C2C24] flex items-center justify-between sticky top-0 z-30 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full bg-[#162920] border border-[#254234] text-[#34D399] font-code font-bold text-[11px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
              <span>ISB · KHI · LHE Clustered</span>
            </span>

            <span className="hidden sm:inline-flex text-xs text-[#6B877B] font-code">
              Active Persona: <strong className="text-[#F2F7F4] ml-1">{roleLabel}</strong>
            </span>
          </div>

          {/* Quick Role Switcher Interactive Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="h-8 px-3 rounded-xl bg-[#14221B] hover:bg-[#1A2E24] border border-[#233B2F] text-xs font-semibold text-[#F2F7F4] flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Sparkles size={13} className="text-[#34D399]" />
              <span className="hidden md:inline text-[11px] text-[#8EAAA0]">Switch Role:</span>
              <span className="font-bold text-[11px] capitalize text-[#34D399]">{user.role}</span>
              <ChevronDown size={13} className="text-[#8EAAA0]" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0D1612] border border-[#22382E] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <span className="block px-3 py-1.5 text-[10px] font-code uppercase font-bold text-[#6B877B]">
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
                        ? "bg-[#162D23] text-[#34D399] font-bold"
                        : "text-[#A3B8AF] hover:bg-[#13221A] hover:text-[#F2F7F4]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {r === "admin" && <ShieldCheck size={14} className="text-[#34D399]" />}
                      {r === "provider" && <Wrench size={14} className="text-[#D4A843]" />}
                      {r === "customer" && <UserCheck size={14} className="text-[#38BDF8]" />}
                      <span>{r === "admin" ? "Super Admin" : r === "provider" ? "Master Artisan" : "Customer"}</span>
                    </div>
                    {user.role === r && <CheckCircle2 size={13} className="text-[#34D399]" />}
                  </button>
                ))}

                <div className="border-t border-[#1C2C24] my-1 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setRoleMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium text-[#EF4444] hover:bg-[#201113] transition-colors flex items-center gap-2 cursor-pointer"
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
