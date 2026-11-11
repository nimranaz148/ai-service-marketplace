"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Cpu, Mic, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="space-y-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-pill border border-hairline bg-surface-sunken px-3 py-1 text-xs font-medium text-ink-muted">
            <Sparkles size={12} className="text-[#0054F9]" />
            <span>Platform Features</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            Empowering and strengthening your{" "}
            <span className="font-serif italic font-normal text-[#0054F9]">
              service operations.
            </span>
          </h2>

          <p className="font-body text-sm sm:text-base text-zinc-300 max-w-xl mx-auto">
            Our platform provides state-of-the-art tools and telemetry to help you dispatch, monitor, and guarantee every household repair.
          </p>
        </div>

        {/* Sticky Stacking Cards Container (Catalis card_sticky-wrap pattern) with Physics Motion */}
        <div className="space-y-8 relative">
          
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="sticky top-24 p-8 sm:p-12 rounded-[2.5rem] bg-[#11111A] border-2 border-white/10 hover:border-[#0054F9]/50 shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_60px_rgba(0,84,249,0.2)] backdrop-blur-2xl transition-all duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-code uppercase text-[#0054F9] font-bold tracking-wider">
                  01 // AUTONOMOUS ORCHESTRATION
                </span>
                <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-white leading-snug">
                  5-Agent Neural Pipeline
                </h3>
                <p className="font-body text-sm text-zinc-300 leading-relaxed">
                  Every request passes through Intent Extraction, Artisan Discovery, Dynamic Weighted Ranking, 
                  Slot Booking, and Automated Follow-up for a completely hands-off experience.
                </p>
                <div className="space-y-2 pt-2 text-xs font-body text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#0054F9]" />
                    <span>Gemini 2.5 Flash + Pro dual-tier routing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#0054F9]" />
                    <span>Real-time geo-spatial distance calculation</span>
                  </div>
                </div>
              </div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="lg:col-span-6 p-6 rounded-3xl bg-[#09090E] border border-white/8 hover:border-[#0054F9]/40 space-y-3 font-code text-xs text-zinc-300 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-2 border-b border-white/5">
                  <span>pipeline_trace.json</span>
                  <span className="text-[#0054F9]">status: 200 OK</span>
                </div>
                <div className="text-emerald-400">⚡ IntentAgent: extracted "AC PCB Repair" (0.98 confidence)</div>
                <div className="text-blue-400">🔍 DiscoveryAgent: found 14 active HVAC artisans in ISB</div>
                <div className="text-purple-400">⭐ RankingAgent: Tariq Mehmood scored 98.4 (NADRA + 4.96 rating)</div>
                <div className="text-amber-400">📅 BookingAgent: reserved slot 10:30 AM • Token BK-8011 generated</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="sticky top-32 p-8 sm:p-12 rounded-[2.5rem] bg-[#141420] border-2 border-white/10 hover:border-[#0054F9]/50 shadow-[0_25px_60px_rgba(0,0,0,0.85)] hover:shadow-[0_30px_70px_rgba(0,84,249,0.22)] backdrop-blur-2xl transition-all duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-code uppercase text-[#0054F9] font-bold tracking-wider">
                  02 // NATURAL VOICE SYNTHESIS
                </span>
                <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-white leading-snug">
                  Bilingual Roman Urdu Engine
                </h3>
                <p className="font-body text-sm text-zinc-300 leading-relaxed">
                  Call our concierge hotline and speak naturally in Roman Urdu or English. 
                  Vapi integration delivers sub-500ms voice response with native Pakistani inflection.
                </p>
                <div className="space-y-2 pt-2 text-xs font-body text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#0054F9]" />
                    <span>Real-time voice turn detection & interruption handling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#0054F9]" />
                    <span>Direct phone call scheduling without opening an app</span>
                  </div>
                </div>
              </div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="lg:col-span-6 p-6 rounded-3xl bg-[#0A0A10] border border-white/8 hover:border-[#0054F9]/40 space-y-4 text-center transition-colors"
              >
                <motion.div 
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="w-16 h-16 rounded-full bg-[#0054F9]/20 text-[#0054F9] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,84,249,0.3)] cursor-pointer"
                >
                  <Mic size={28} />
                </motion.div>
                <div className="space-y-1">
                  <div className="font-display font-bold text-sm text-white">Live Voice Call Engine</div>
                  <div className="font-body text-xs text-zinc-400 italic">"G bilkul, Tariq Mehmood ko 25 minute mein rawana kar diya hai."</div>
                </div>
                <div className="flex items-center justify-center gap-1.5 h-8">
                  {[40, 75, 100, 60, 85, 30, 95, 70, 45, 90, 65, 35].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [`${h}%`, `${Math.min(100, h * 1.3)}%`, `${Math.max(20, h * 0.7)}%`, `${h}%`] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
                      className="w-1 bg-[#0054F9] rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="sticky top-40 p-8 sm:p-12 rounded-[2.5rem] bg-[#171724] border-2 border-white/10 hover:border-[#0054F9]/50 shadow-[0_30px_70px_rgba(0,0,0,0.9)] hover:shadow-[0_35px_80px_rgba(0,84,249,0.25)] backdrop-blur-2xl transition-all duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-code uppercase text-[#0054F9] font-bold tracking-wider">
                  03 // AUDIT & OBSERVABILITY
                </span>
                <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-white leading-snug">
                  Immutable Escrow & Trace Ledger
                </h3>
                <p className="font-body text-sm text-zinc-300 leading-relaxed">
                  Every booking generates a unique 4-digit security token and transparent audit log. 
                  Inspect exact token issuance, execution latency, and customer review scores.
                </p>
                <div className="space-y-2 pt-2 text-xs font-body text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#0054F9]" />
                    <span>Real-time session replay with LLM token usage tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#0054F9]" />
                    <span>100% Escrow release security with automated dispute refund</span>
                  </div>
                </div>
              </div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="lg:col-span-6 p-6 rounded-3xl bg-[#09090E] border border-white/8 hover:border-[#0054F9]/40 space-y-3 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-display font-bold text-white">Security Token Security</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-code text-[10px]">
                    VERIFIED PASS
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#12121A] border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-code text-zinc-400 uppercase block">OTP Completion Token</span>
                    <span className="font-code font-black text-xl text-[#0054F9]">BK-8011</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-code text-zinc-400 uppercase block">Escrow Status</span>
                    <span className="font-display font-bold text-sm text-emerald-400">Locked in Vault</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
