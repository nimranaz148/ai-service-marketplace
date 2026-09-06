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
    <div className="min-h-screen bg-[#090E0C] text-[#F2F7F4] flex flex-col justify-between relative overflow-hidden font-body selection:bg-[#D4A843] selection:text-[#090E0C]">
      {/* Background ambient lighting with Warm Brass / Obsidian glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D4A843]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#3D3017]/30 rounded-full blur-[130px] pointer-events-none" />

      {/* Top Navigation Strip */}
      <header className="relative z-10 px-6 sm:px-12 py-6 flex items-center justify-between border-b border-[#292212]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#292212] border border-[#473B1F] text-[#D4A843] flex items-center justify-center font-display font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            <Wrench size={16} />
          </div>
          <div>
            <span className="font-display font-bold text-base text-[#F2F7F4] block leading-none">
              ATELIER ARTISAN
            </span>
            <span className="font-code text-[10px] text-[#D4A843] block mt-0.5 font-semibold">
              Master Supply Command
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#8EAAA0] hover:text-[#D4A843] transition-colors font-medium px-3 py-1.5 rounded-xl border border-transparent hover:border-[#3D3017]"
        >
          <ChevronLeft size={14} />
          <span>Back to Landing</span>
        </Link>
      </header>

      {/* Main Form Center */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#120F0A]/90 border border-[#3D3017] rounded-3xl p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#292212] border border-[#473B1F] text-[#D4A843] text-[11px] font-code font-bold mb-3">
              <ShieldCheck size={12} />
              <span>VERIFIED ARTISAN SUPPLY PORTAL</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F2F7F4] tracking-tight">
              Master Artisan Sign In
            </h1>
            <p className="font-body text-xs sm:text-sm text-[#A3B8AF] mt-1.5">
              Access your field dispatch HUD, incoming appointments, and service rate catalog.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-code uppercase text-[#D4A843] mb-1.5 font-semibold">
                Artisan Email / Mobile ID
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. tariq.hvac@artisan.atelier.ai"
                  className="w-full bg-[#0A0805] border border-[#2B2313] rounded-2xl px-4 py-3 pl-11 text-sm text-[#F2F7F4] placeholder-[#57492D] focus:outline-none focus:border-[#D4A843] transition-colors"
                />
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#57492D]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-code uppercase text-[#D4A843] font-semibold">
                  Password / PIN
                </label>
                <a href="#" className="text-[11px] text-[#A3B8AF] hover:text-[#D4A843] transition-colors font-medium">
                  Forgot PIN?
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0A0805] border border-[#2B2313] rounded-2xl px-4 py-3 pl-11 text-sm text-[#F2F7F4] placeholder-[#57492D] focus:outline-none focus:border-[#D4A843] transition-colors"
                />
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#57492D]" />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#D4A843] hover:bg-[#C29633] text-[#090E0C] font-display font-extrabold text-sm rounded-2xl shadow-[0_4px_20px_rgba(212,168,67,0.3)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 mt-2"
            >
              <span>Enter Artisan Command HUD</span>
              <ArrowRight size={16} />
            </Button>
          </form>

          {/* 1-Click Fast Login for Testing */}
          <div className="mt-6 pt-5 border-t border-[#292212]">
            <span className="text-[10px] font-code uppercase text-[#8EAAA0] block text-center mb-2.5">
              1-Click Demo Supply Access
            </span>
            <button
              onClick={() => loginAsDemo("provider")}
              className="w-full p-3 rounded-2xl bg-[#1D170D] border border-[#3D3017] hover:border-[#D4A843]/60 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#2E2412] text-[#D4A843] flex items-center justify-center font-bold text-xs">
                  TM
                </div>
                <div>
                  <div className="text-xs font-display font-bold text-[#F2F7F4] group-hover:text-[#D4A843]">
                    Tariq Mehmood (HVAC Specialist)
                  </div>
                  <div className="text-[10px] text-[#A3B8AF] font-code">
                    Islamabad Sector G-13 • 4.96 ★
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-code text-[#D4A843] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Sign In →
              </span>
            </button>
          </div>

          {/* New Artisan Registration Link */}
          <div className="mt-6 text-center text-xs text-[#8EAAA0]">
            Are you a skilled technician or contractor?{" "}
            <Link href="/provider/signup" className="text-[#D4A843] font-bold hover:underline">
              Register Your Trade →
            </Link>
          </div>

          {/* Customer Portal Link */}
          <div className="mt-3 pt-3 border-t border-[#1C160B] text-center text-[11px] text-[#8EAAA0]">
            Looking to book service for your home?{" "}
            <Link href="/login" className="text-[#34D399] font-medium hover:underline">
              Go to Customer Login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center text-xs font-code text-[#5E5136] border-t border-[#1F190C]">
        Atelier AI Artisan Supply Network • NADRA Identity Verification Standard
      </footer>
    </div>
  );
}
