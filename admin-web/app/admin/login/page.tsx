"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  ChevronLeft,
  Terminal,
  Cpu,
  AlertTriangle,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, "admin");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F4F4F6] flex flex-col justify-between relative overflow-hidden font-body selection:bg-[#0054F9] selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#0054F9]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#0054F9]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navigation Strip */}
      <header className="relative z-10 px-6 sm:px-12 py-6 flex items-center justify-between border-b border-white/8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-[#0054F9] text-white flex items-center justify-center font-display font-bold text-sm shadow-[0_0_15px_rgba(0,84,249,0.4)] group-hover:scale-105 transition-transform">
            <Terminal size={16} />
          </div>
          <div>
            <span className="font-display font-bold text-base text-white block leading-none">
              CATALIS COMMAND
            </span>
            <span className="font-code text-[10px] text-[#0054F9] block mt-0.5 font-bold tracking-wider uppercase">
              Operations Terminal
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors font-medium px-3 py-1.5 rounded-full border border-white/5 hover:border-white/10"
        >
          <ChevronLeft size={14} />
          <span>Exit to Main Platform</span>
        </Link>
      </header>

      {/* Main Form Center */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#111118]/90 border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0054F9]/10 border border-[#0054F9]/30 text-[#0054F9] text-[11px] font-code font-semibold mb-3">
              <ShieldCheck size={12} />
              <span>SUPERUSER ACCESS LEVEL 4</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Admin Operations Login
            </h1>
            <p className="font-body text-xs sm:text-sm text-zinc-400 mt-1.5">
              Restricted governance console for telemetry, customer/provider CRUD, and AI agents.
            </p>
          </div>

          <div className="mb-5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-300">
            <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-400" />
            <span className="font-body">
              This terminal is audited under SOC2 security standards. All CRUD mutations and trace inspections are logged with IP attribution.
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-code uppercase text-zinc-400 mb-1.5 font-semibold">
                Executive SSO / Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@catalis.ai"
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-4 py-3 pl-11 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#0054F9] transition-colors"
                />
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-code uppercase text-zinc-400 mb-1.5 font-semibold">
                Master Security Key / Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-4 py-3 pl-11 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#0054F9] transition-colors"
                />
                <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover w-full py-3.5 text-sm font-display font-bold mt-2"
            >
              <span>Authenticate Terminal</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-6 pt-5 border-t border-white/8">
            <span className="font-code text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-2 text-center">
              ⚡ 1-Click Sandbox Bypass:
            </span>
            <button
              type="button"
              onClick={() => loginAsDemo("admin")}
              className="w-full p-3 rounded-2xl bg-[#141420] hover:bg-[#1A1A28] border border-white/5 hover:border-[#0054F9]/50 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0054F9]/20 text-[#0054F9] flex items-center justify-center font-bold text-xs">
                  SA
                </div>
                <div>
                  <span className="font-display font-bold text-xs text-white block">
                    Instant Demo: Super Admin Root
                  </span>
                  <span className="text-[10px] text-zinc-400 block font-code">
                    Full CRUD · Telemetry · Agent Traces
                  </span>
                </div>
              </div>
              <ArrowRight size={14} className="text-[#0054F9] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          <div className="text-center mt-5 text-xs text-zinc-400 font-body">
            Not an admin? Return to{" "}
            <Link href="/login" className="text-[#0054F9] hover:underline font-semibold">
              Customer Login
            </Link>{" "}
            or{" "}
            <Link href="/provider/login" className="text-[#D4A843] hover:underline font-semibold">
              Artisan Login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center text-xs font-code text-zinc-500 border-t border-white/8">
        Catalis Command Kernel &copy; 2026. Microservices & multi-agent mesh controller.
      </footer>
    </div>
  );
}
