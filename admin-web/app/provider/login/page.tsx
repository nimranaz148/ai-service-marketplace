"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Wrench,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  ChevronLeft,
  Award,
  Phone,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProviderLoginPage() {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, "provider");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F4F4F6] flex flex-col justify-between relative overflow-hidden font-body selection:bg-[#D4A843] selection:text-black">
      {/* Background ambient lighting with Warm Brass / Obsidian glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D4A843]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#0054F9]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navigation Strip */}
      <header className="relative z-10 px-6 sm:px-12 py-6 flex items-center justify-between border-b border-white/8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-[#D4A843]/20 border border-[#D4A843]/40 text-[#D4A843] flex items-center justify-center font-display font-bold text-sm shadow-[0_0_15px_rgba(212,168,67,0.3)] group-hover:scale-105 transition-transform">
            <Wrench size={16} />
          </div>
          <div>
            <span className="font-display font-bold text-base text-white block leading-none">
              CATALIS ARTISAN
            </span>
            <span className="font-code text-[10px] text-[#D4A843] block mt-0.5 font-semibold">
              Master Supply Command
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors font-medium px-3 py-1.5 rounded-full border border-white/5 hover:border-white/10"
        >
          <ChevronLeft size={14} />
          <span>Back to Landing</span>
        </Link>
      </header>

      {/* Main Form Center */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#111118]/90 border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A843]/15 border border-[#D4A843]/30 text-[#D4A843] text-[11px] font-code font-semibold mb-3">
              <Award size={12} />
              <span>LICENSED TRADESPERSON ACCESS</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Artisan Partner Sign In
            </h1>
            <p className="font-body text-xs sm:text-sm text-zinc-400 mt-1.5">
              Manage your assigned household dispatch requests, update catalog, and view customer previews.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-code uppercase text-zinc-400 mb-1.5 font-semibold">
                Registered Mobile or Email *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. tariq.m@artisan.pk or 03015554321"
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-4 py-3 pl-11 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4A843] transition-colors"
                />
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-code uppercase text-zinc-400 font-semibold">
                  Secret PIN / Password *
                </label>
                <a href="#" className="text-xs text-[#D4A843] hover:underline font-body">
                  Forgot PIN?
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-4 py-3 pl-11 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4A843] transition-colors"
                />
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors w-full py-3.5 text-sm font-display font-bold bg-[#D4A843] text-black hover:bg-[#c49a38] mt-2 flex items-center justify-center gap-2"
            >
              <span>Open Artisan HUD</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-6 pt-5 border-t border-white/8">
            <span className="font-code text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-2 text-center">
              ⚡ Quick 1-Click Persona Login:
            </span>
            <button
              type="button"
              onClick={() => loginAsDemo("provider")}
              className="w-full p-3 rounded-2xl bg-[#141420] hover:bg-[#1A1A28] border border-white/5 hover:border-[#D4A843]/50 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#D4A843]/20 text-[#D4A843] flex items-center justify-center font-bold text-xs">
                  TM
                </div>
                <div>
                  <span className="font-display font-bold text-xs text-white block">
                    Instant Demo: Tariq Mehmood (Provider)
                  </span>
                  <span className="text-[10px] text-zinc-400 block font-code">
                    Master HVAC · 142 Jobs · 4.96 Rating
                  </span>
                </div>
              </div>
              <ArrowRight size={14} className="text-[#D4A843] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          <div className="text-center mt-5 text-xs text-zinc-400 font-body">
            Want to offer your craft on Catalis?{" "}
            <Link href="/provider/signup" className="text-[#D4A843] hover:underline font-semibold">
              Register as Artisan
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center text-xs font-code text-zinc-500 border-t border-white/8">
        Catalis Artisan Guild &copy; 2026. Empowering Pakistan's domestic master technicians.
      </footer>
    </div>
  );
}
