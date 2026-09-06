"use client";

import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Wrench } from "lucide-react";
import Link from "next/link";

export function JoinCTASection() {
  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="rounded-[2.5rem] bg-gradient-to-b from-[#10101C] to-[#0A0A10] border-2 border-[#0054F9]/30 p-8 sm:p-20 relative overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.9)] text-center">
        {/* Radial Spotlight Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#0054F9]/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="catalis-badge">
            <Sparkles size={12} className="text-[#0054F9]" />
            <span>Join The Network</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            Achieve operational excellence with{" "}
            <span className="font-serif italic font-normal text-[#0054F9]">
              Atelier Concierge.
            </span>
          </h2>

          <p className="font-body text-base text-zinc-300 max-w-xl mx-auto leading-relaxed">
            Founded by AI and systems engineers, we create cutting-edge autonomous dispatch infrastructure 
            tailored for homes and enterprises across Pakistan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <button className="catalis-btn catalis-btn-primary px-8 py-4 text-sm font-bold font-display shadow-[0_0_30px_rgba(0,84,249,0.5)]">
                <span>Get Started as Client</span>
                <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/provider/signup">
              <button className="catalis-btn catalis-btn-secondary px-8 py-4 text-sm font-semibold flex items-center gap-2">
                <Wrench size={14} className="text-[#D4A843]" />
                <span>Register as Master Artisan</span>
              </button>
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-body">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#0054F9]" />
              <span>100% NADRA Biometric Clearance</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#0054F9]" />
              <span>Sub-second Bilingual Urdu Intelligence</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
