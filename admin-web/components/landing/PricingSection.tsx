"use client";

import React from "react";
import { Sparkles, Check, ArrowRight } from "lucide-react";
import Link from "next/link";

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="space-y-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="catalis-badge">
            <Sparkles size={12} className="text-[#0054F9]" />
            <span>Transparent Pricing</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            Simple, transparent pricing{" "}
            <span className="font-serif italic font-normal text-[#0054F9]">
              with zero hidden markups.
            </span>
          </h2>

          <p className="font-body text-sm sm:text-base text-zinc-300 max-w-xl mx-auto">
            Choose a plan that fits your household maintenance needs. No unexpected labor surprises.
          </p>
        </div>

        {/* Catalis pricing_grid (3-card layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Card 1: Starter */}
          <div className="p-8 rounded-[2.5rem] bg-[#11111A] border border-white/8 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="text-sm font-display font-bold text-zinc-300">
                On-Demand Plan
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-black text-4xl text-white">PKR 3,500</span>
                <span className="text-xs text-zinc-400 font-body">/ per visit</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-body">
                Ideal for homeowners needing instant resolution for single electrical, HVAC, or plumbing breakdowns.
              </p>

              <div className="pt-6 border-t border-white/8 space-y-3 text-xs font-body text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-[#0054F9] shrink-0" />
                  <span>Immediate AI voice & chat dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-[#0054F9] shrink-0" />
                  <span>NADRA biometrically verified artisan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-[#0054F9] shrink-0" />
                  <span>30-Day workmanship warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-[#0054F9] shrink-0" />
                  <span>Escrow hold released via 4-digit token</span>
                </div>
              </div>
            </div>

            <Link href="/services" className="w-full">
              <button className="catalis-btn catalis-btn-secondary w-full py-3 text-xs font-bold font-display">
                <span>Book On-Demand</span>
                <ArrowRight size={14} />
              </button>
            </Link>
          </div>

          {/* Card 2: Growth (Featured Catalis Blue Plan) */}
          <div className="p-8 rounded-[2.5rem] bg-[#141424] border-2 border-[#0054F9] flex flex-col justify-between space-y-8 shadow-[0_20px_60px_rgba(0,84,249,0.25)] relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#0054F9] text-white text-[10px] font-code font-bold rounded-bl-2xl uppercase tracking-wider">
              MOST POPULAR
            </div>

            <div className="space-y-4">
              <div className="text-sm font-display font-bold text-[#0054F9]">
                Emerald Concierge Club
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-black text-4xl text-white">PKR 8,500</span>
                <span className="text-xs text-zinc-400 font-body">/ month</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-body">
                Complete household coverage with prioritized dispatch and dedicated hotline access.
              </p>

              <div className="pt-6 border-t border-white/8 space-y-3 text-xs font-body text-zinc-200">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-[#0054F9] shrink-0" />
                  <span>Priority dispatch in under 20 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-[#0054F9] shrink-0" />
                  <span>2 Free comprehensive quarterly checkups</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-[#0054F9] shrink-0" />
                  <span>0% Emergency surge fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-[#0054F9] shrink-0" />
                  <span>45-Day extended part & labor guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-[#0054F9] shrink-0" />
                  <span>Direct VIP Voice Concierge line</span>
                </div>
              </div>
            </div>

            <Link href="/signup" className="w-full">
              <button className="catalis-btn catalis-btn-primary w-full py-3 text-xs font-extrabold font-display shadow-lg">
                <span>Join Emerald Club</span>
                <ArrowRight size={14} />
              </button>
            </Link>
          </div>

          {/* Card 3: Scale Corporate */}
          <div className="p-8 rounded-[2.5rem] bg-[#11111A] border border-white/8 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="text-sm font-display font-bold text-zinc-300">
                Commercial Facility Plan
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-black text-4xl text-white">PKR 25,000</span>
                <span className="text-xs text-zinc-400 font-body">/ month</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-body">
                For offices, retail outlets, and residential complexes requiring dedicated master contractor fleets.
              </p>

              <div className="pt-6 border-t border-white/8 space-y-3 text-xs font-body text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-[#0054F9] shrink-0" />
                  <span>Dedicated Master Artisan squad</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-[#0054F9] shrink-0" />
                  <span>Custom Service Level Agreement (SLA)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-[#0054F9] shrink-0" />
                  <span>Monthly consolidated corporate billing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-[#0054F9] shrink-0" />
                  <span>90-Day industrial parts guarantee</span>
                </div>
              </div>
            </div>

            <Link href="/dashboard/admin" className="w-full">
              <button className="catalis-btn catalis-btn-secondary w-full py-3 text-xs font-bold font-display">
                <span>Contact Enterprise Team</span>
                <ArrowRight size={14} />
              </button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
