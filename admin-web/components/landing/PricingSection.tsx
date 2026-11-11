"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Check, ArrowRight } from "lucide-react";
import Link from "next/link";

export function PricingSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 26,
      },
    },
  };

  return (
    <section id="pricing" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="space-y-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-pill border border-hairline bg-surface-sunken px-3 py-1 text-xs font-medium text-ink-muted">
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

        {/* Catalis pricing_grid (3-card layout) with Staggered Motion */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"
        >
          
          {/* Card 1: Starter */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 25 } }}
            whileTap={{ scale: 0.98 }}
            className="p-8 rounded-[2.5rem] bg-[#11111A] border border-white/8 hover:border-[#0054F9]/50 hover:shadow-[0_20px_50px_rgba(0,84,249,0.15)] flex flex-col justify-between space-y-8 transition-colors duration-200"
          >
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
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-hairline bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-sunken w-full py-3 text-xs font-bold font-display"
              >
                <span>Book On-Demand</span>
                <ArrowRight size={14} />
              </motion.button>
            </Link>
          </motion.div>

          {/* Card 2: Growth (Featured Catalis Blue Plan) */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -12, scale: 1.035, transition: { type: "spring", stiffness: 400, damping: 25 } }}
            whileTap={{ scale: 0.98 }}
            className="p-8 rounded-[2.5rem] bg-[#141424] border-2 border-[#0054F9] flex flex-col justify-between space-y-8 shadow-[0_25px_70px_rgba(0,84,249,0.35)] hover:shadow-[0_35px_90px_rgba(0,84,249,0.5)] relative overflow-hidden transition-all duration-300"
          >
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#0054F9] text-white text-[10px] font-code font-bold rounded-bl-2xl uppercase tracking-wider shadow-md">
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
              <motion.button 
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover w-full py-3 text-xs font-extrabold font-display shadow-lg"
              >
                <span>Join Emerald Club</span>
                <ArrowRight size={14} />
              </motion.button>
            </Link>
          </motion.div>

          {/* Card 3: Scale Corporate */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 25 } }}
            whileTap={{ scale: 0.98 }}
            className="p-8 rounded-[2.5rem] bg-[#11111A] border border-white/8 hover:border-[#0054F9]/50 hover:shadow-[0_20px_50px_rgba(0,84,249,0.15)] flex flex-col justify-between space-y-8 transition-colors duration-200"
          >
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
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-hairline bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-sunken w-full py-3 text-xs font-bold font-display"
              >
                <span>Scale Operations</span>
                <ArrowRight size={14} />
              </motion.button>
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
