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
    <div className="min-h-screen bg-[#060A08] text-[#F2F7F4] flex flex-col justify-between relative overflow-hidden font-body selection:bg-[#34D399] selection:text-[#090E0C]">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#34D399]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#0E281C]/50 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navigation Strip */}
      <header className="relative z-10 px-6 sm:px-12 py-6 flex items-center justify-between border-b border-[#14231B]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#14291F] border border-[#234B38] text-[#34D399] flex items-center justify-center font-display font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            <Terminal size={16} />
          </div>
          <div>
            <span className="font-display font-bold text-base text-[#F2F7F4] block leading-none">
              ATELIER COMMAND
            </span>
            <span className="font-code text-[10px] text-[#34D399] block mt-0.5 font-bold tracking-wider uppercase">
              Operations Terminal
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#8EAAA0] hover:text-[#34D399] transition-colors font-medium px-3 py-1.5 rounded-xl border border-transparent hover:border-[#1C3627]"
        >
          <ChevronLeft size={14} />
          <span>Exit to Main Platform</span>
        </Link>
      </header>

      {/* Main Form Center */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#0A130E]/95 border-2 border-[#1E3A2B] rounded-3xl p-6 sm:p-8 shadow-[0_24px_70px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#34D399]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1214] border border-[#472227] text-[#EF4444] text-[10px] font-code font-bold mb-3 tracking-wider uppercase">
              <AlertTriangle size={11} />
              <span>Restricted // Authorized Staff Only</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F2F7F4] tracking-tight">
              Executive Console Sign In
            </h1>
            <p className="font-body text-xs sm:text-sm text-[#8EAAA0] mt-1.5">
              Access marketplace telemetry, high-active leaderboards, customer CRUD, and agent traces.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-code uppercase text-[#8EAAA0] mb-1.5 font-semibold">
                Admin Work Identity *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@atelier.ai"
                  className="w-full bg-[#070D09] border border-[#172E21] rounded-2xl px-4 py-3 pl-11 text-sm text-[#F2F7F4] placeholder-[#405C4E] focus:outline-none focus:border-[#34D399] transition-colors"
                />
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#405C4E]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-code uppercase text-[#8EAAA0] font-semibold">
                  Master Security Key *
                </label>
                <span className="text-[10px] text-[#34D399] font-code">
                  Hardware 2FA Active
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#070D09] border border-[#172E21] rounded-2xl px-4 py-3 pl-11 text-sm text-[#F2F7F4] placeholder-[#405C4E] focus:outline-none focus:border-[#34D399] transition-colors"
                />
                <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#405C4E]" />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#34D399] hover:bg-[#2BB380] text-[#090E0C] font-display font-extrabold text-sm rounded-2xl shadow-[0_4px_25px_rgba(52,211,153,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 mt-2"
            >
              <span>Authenticate & Enter Operations Console</span>
              <ArrowRight size={16} />
            </Button>
          </form>

          {/* 1-Click Fast Login for Testing */}
          <div className="mt-6 pt-5 border-t border-[#172E21]">
            <span className="text-[10px] font-code uppercase text-[#8EAAA0] block text-center mb-2.5">
              1-Click Fast Executive Access
            </span>
            <button
              onClick={() => loginAsDemo("admin")}
              className="w-full p-3 rounded-2xl bg-[#0E1D15] border border-[#1C3B2A] hover:border-[#34D399] text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#163324] text-[#34D399] flex items-center justify-center font-bold text-xs">
                  AM
                </div>
                <div>
                  <div className="text-xs font-display font-bold text-[#F2F7F4] group-hover:text-[#34D399]">
                    Ayesha Malik (Command Officer)
                  </div>
                  <div className="text-[10px] text-[#8EAAA0] font-code">
                    admin@atelier.ai • Super Admin Role
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-code text-[#34D399] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Enter →
              </span>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-[#132319] text-center text-[11px] text-[#607D70]">
            Atelier AI Platform Security Subsystem • v2.4 Enterprise
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center text-xs font-code text-[#3C574B] border-t border-[#101D16]">
        Internal System Audit Log active • All IP traces recorded
      </footer>
    </div>
  );
}
