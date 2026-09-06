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
  UserCheck,
  Wrench,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomerLoginPage() {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, "customer");
  };

  return (
    <div className="min-h-screen bg-[#090E0C] text-[#F2F7F4] flex flex-col justify-between relative overflow-hidden font-body selection:bg-[#34D399] selection:text-[#090E0C]">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#34D399]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#162D23]/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navigation Strip */}
      <header className="relative z-10 px-6 sm:px-12 py-6 flex items-center justify-between border-b border-[#1C2C24]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#162D23] border border-[#2A493A] text-[#34D399] flex items-center justify-center font-display font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            A
          </div>
          <div>
            <span className="font-display font-bold text-base text-[#F2F7F4] block leading-none">
              ATELIER AI
            </span>
            <span className="font-code text-[10px] text-[#6B877B] block mt-0.5">
              Customer Concierge Network
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#8EAAA0] hover:text-[#34D399] transition-colors font-medium px-3 py-1.5 rounded-xl border border-transparent hover:border-[#1E3328]"
        >
          <ChevronLeft size={14} />
          <span>Back to Landing</span>
        </Link>
      </header>

      {/* Main Form Center */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#0D1612]/90 border border-[#1F3329] rounded-3xl p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#162920] border border-[#254234] text-[#34D399] text-[11px] font-code font-semibold mb-3">
              <Sparkles size={12} />
              <span>CLIENT CONCIERGE ACCESS</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F2F7F4] tracking-tight">
              Customer Sign In
            </h1>
            <p className="font-body text-xs sm:text-sm text-[#A3B8AF] mt-1.5">
              Track your active bookings, view verified artisans, and manage premises.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-code uppercase text-[#8EAAA0] mb-1.5 font-semibold">
                Email or Mobile Number *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. zubair.k@gmail.com"
                  className="w-full bg-[#090E0C] border border-[#1E3026] rounded-2xl px-4 py-3 pl-11 text-sm text-[#F2F7F4] placeholder-[#577063] focus:outline-none focus:border-[#34D399] transition-colors"
                />
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#577063]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-code uppercase text-[#8EAAA0] font-semibold">
                  Password *
                </label>
                <a href="#" className="text-[11px] text-[#8EAAA0] hover:text-[#34D399] transition-colors font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#090E0C] border border-[#1E3026] rounded-2xl px-4 py-3 pl-11 text-sm text-[#F2F7F4] placeholder-[#577063] focus:outline-none focus:border-[#34D399] transition-colors"
                />
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#577063]" />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#34D399] hover:bg-[#2BB380] text-[#090E0C] font-display font-extrabold text-sm rounded-2xl shadow-[0_4px_20px_rgba(52,211,153,0.3)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 mt-2"
            >
              <span>Sign In to Concierge Hub</span>
              <ArrowRight size={16} />
            </Button>
          </form>

          {/* 1-Click Fast Login for Testing */}
          <div className="mt-6 pt-5 border-t border-[#1C2C24]">
            <span className="text-[10px] font-code uppercase text-[#8EAAA0] block text-center mb-2.5">
              1-Click Demo Homeowner Access
            </span>
            <button
              onClick={() => loginAsDemo("customer")}
              className="w-full p-3 rounded-2xl bg-[#111A15] border border-[#1E3026] hover:border-[#34D399] text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#182B22] text-[#34D399] flex items-center justify-center font-bold text-xs">
                  ZK
                </div>
                <div>
                  <div className="text-xs font-display font-bold text-[#F2F7F4] group-hover:text-[#34D399]">
                    Zubair Khan (Homeowner)
                  </div>
                  <div className="text-[10px] text-[#8EAAA0] font-code">
                    Gulshan-e-Iqbal, Karachi • Emerald Club
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-code text-[#34D399] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Sign In →
              </span>
            </button>
          </div>

          {/* Create Customer Account Link */}
          <div className="mt-6 text-center text-xs text-[#8EAAA0]">
            Don't have a customer account?{" "}
            <Link href="/signup" className="text-[#34D399] font-bold hover:underline">
              Create one now →
            </Link>
          </div>

          {/* Separate Persona Navigation Footer */}
          <div className="mt-5 pt-4 border-t border-[#182620] space-y-2 text-center text-[11px] text-[#8EAAA0]">
            <div>
              Are you a service provider?{" "}
              <Link href="/provider/login" className="text-[#D4A843] font-semibold hover:underline inline-flex items-center gap-1">
                <Wrench size={11} />
                <span>Artisan Supply Login (/provider/login)</span>
              </Link>
            </div>
            <div>
              Platform Operations Staff?{" "}
              <Link href="/admin/login" className="text-[#8EAAA0] hover:text-[#34D399] font-code hover:underline inline-flex items-center gap-1">
                <Terminal size={11} />
                <span>Admin Terminal (/admin/login)</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center text-xs font-code text-[#516E61] border-t border-[#14221A]">
        Atelier AI Service Marketplace • End-to-End Escrow & Verification
      </footer>
    </div>
  );
}
