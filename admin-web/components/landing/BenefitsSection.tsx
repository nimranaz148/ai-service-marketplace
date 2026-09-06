"use client";

import React from "react";
import { Sparkles, ShieldCheck, Zap, Bot, Lock, ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="rounded-[2.5rem] bg-[#0E0E16]/80 border border-white/8 p-8 sm:p-16 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#0054F9]/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="catalis-badge">
            <Sparkles size={12} className="text-[#0054F9]" />
            <span>Core Benefits</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            Make service dispatch easy,{" "}
            <span className="font-serif italic font-normal text-[#0054F9]">
              simplify your maintenance.
            </span>
          </h2>

          <p className="font-body text-sm sm:text-base text-zinc-300 max-w-xl mx-auto">
            Easily adapt to household breakdowns and scale facility operations with our flexible multi-agent infrastructure.
          </p>
        </div>

        {/* Catalis benefits_grid (Bento 4-card layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#13131D]/80 border border-white/8 hover:border-[#0054F9]/40 transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0054F9]/10 border border-[#0054F9]/30 text-[#0054F9] flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                <Bot size={22} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Intuitive User Interface
              </h3>
              <p className="font-body text-xs text-zinc-400 leading-relaxed">
                Describe problems naturally in Roman Urdu, Urdu, or English. Our LLM pipeline extracts trade, urgency, and location instantly.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-code text-zinc-400">
              <span>Natural Speech</span>
              <span className="text-[#0054F9]">Vapi Engine →</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#13131D]/80 border border-white/8 hover:border-[#0054F9]/40 transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0054F9]/10 border border-[#0054F9]/30 text-[#0054F9] flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                <Zap size={22} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Automated Processes
              </h3>
              <p className="font-body text-xs text-zinc-400 leading-relaxed">
                5 coordinated micro-agents automate discovery, score provider ratings, reserve calendar slots, and issue OTP verification tokens.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-code text-zinc-400">
              <span>Zero Delay</span>
              <span className="text-[#0054F9]">&lt; 300ms Match →</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#13131D]/80 border border-white/8 hover:border-[#0054F9]/40 transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0054F9]/10 border border-[#0054F9]/30 text-[#0054F9] flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                <Lock size={22} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Secure Transactions
              </h3>
              <p className="font-body text-xs text-zinc-400 leading-relaxed">
                Eliminate cash haggling. Payment is held in secure escrow and released to the artisan only after your satisfactory OTP verification.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-code text-zinc-400">
              <span>100% Escrow</span>
              <span className="text-[#0054F9]">Guaranteed →</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#13131D]/80 border border-white/8 hover:border-[#0054F9]/40 transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0054F9]/10 border border-[#0054F9]/30 text-[#0054F9] flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                <ShieldCheck size={22} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">
                Advanced Security
              </h3>
              <p className="font-body text-xs text-zinc-400 leading-relaxed">
                Every technician is screened against NADRA databases with criminal background clearance and 30-day workmanship warranties.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-code text-zinc-400">
              <span>NADRA Verified</span>
              <span className="text-[#0054F9]">Biometric →</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
