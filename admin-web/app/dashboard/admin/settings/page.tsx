"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Settings, ShieldCheck, Radio, Cpu, Database, Save, ChevronLeft, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [commissionRate, setCommissionRate] = useState(10);
  const [isbActive, setIsbActive] = useState(true);
  const [khiActive, setKhiActive] = useState(true);
  const [lheActive, setLheActive] = useState(true);
  const [vapiUrduMode, setVapiUrduMode] = useState(true);
  const [autoEscrow, setAutoEscrow] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Platform Governance configuration updated successfully!");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="relative rounded-[2rem] p-6 sm:p-8 bg-[#111118] border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#0054F9]/15 blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-pill border border-hairline bg-surface-sunken px-3 py-1 text-xs font-medium text-ink-muted mb-3">
              <Settings size={13} className="text-[#0054F9]" />
              <span>SUPER ADMIN / PLATFORM GOVERNANCE</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Platform Governance & Controls
            </h1>
            <p className="font-body text-xs sm:text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
              Global marketplace economics, metro cluster activations, and acoustic voice engine parameters across Pakistani hubs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard/admin"
              className="h-10 px-4 rounded-xl bg-[#141420] hover:bg-[#1A1A28] text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <ChevronLeft size={14} className="text-[#38BDF8]" />
              <span>Admin Deck</span>
            </Link>
            <Button
              onClick={handleSave}
              className="h-10 px-4 rounded-xl bg-[#0054F9] hover:bg-[#0043C7] text-white shadow-[0_0_20px_rgba(0,84,249,0.3)] font-display font-bold text-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Save size={14} />
              <span>Save Settings</span>
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Metro Coverage Clusters */}
        <div className="p-6 rounded-3xl bg-[#111118] border border-white/8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/8">
            <div>
              <h3 className="font-display font-bold text-sm text-white">
                Active Pakistani Metro Clusters
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Toggle dispatch availability across hyper-local metropolitan hubs.
              </p>
            </div>
            <span className="font-code text-[10px] text-[#38BDF8] bg-[#0054F9]/10 px-2.5 py-0.5 rounded-full border border-[#0054F9]/30">
              3 Metros Online
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: "Islamabad Capital Territory", code: "ISB", state: isbActive, setter: setIsbActive },
              { name: "Karachi Megacity Cluster", code: "KHI", state: khiActive, setter: setKhiActive },
              { name: "Lahore Cultural Hub", code: "LHE", state: lheActive, setter: setLheActive },
            ].map((metro) => (
              <div
                key={metro.code}
                onClick={() => metro.setter(!metro.state)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  metro.state
                    ? "bg-[#141420] border-[#0054F9]/60 shadow-[0_0_20px_rgba(0,84,249,0.15)]"
                    : "bg-[#0A0A0F] border-white/8 opacity-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-code text-xs font-bold text-[#38BDF8]">{metro.code}</span>
                  <span className={`w-2 h-2 rounded-full ${metro.state ? "bg-[#0054F9]" : "bg-[#EF4444]"}`} />
                </div>
                <div>
                  <span className="font-display font-bold text-xs text-white block">{metro.name}</span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">
                    {metro.state ? "High-Density Dispatch Active" : "Cluster Suspended"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Marketplace Economics */}
        <div className="p-6 rounded-3xl bg-[#111118] border border-white/8 space-y-4">
          <div className="pb-3 border-b border-white/8">
            <h3 className="font-display font-bold text-sm text-white">
              Marketplace Commission & Escrow Gate
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Set the platform cut retained per completed master artisan booking.
            </p>
          </div>

          <div className="space-y-4 max-w-md">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-zinc-400">Platform Commission Rate:</span>
                <span className="font-code font-bold text-sm text-[#0054F9]">{commissionRate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full h-2 bg-[#0A0A0F] rounded-lg appearance-none cursor-pointer accent-[#0054F9]"
              />
              <div className="flex items-center justify-between text-[10px] font-code text-zinc-400 mt-1">
                <span>5% (Subsidized)</span>
                <span>10% (Standard)</span>
                <span>25% (Premium)</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Post-Service Escrow Auto-Release</span>
                <span className="text-[11px] text-zinc-400 block">Release artisan payout only after customer OTP confirmation.</span>
              </div>
              <input
                type="checkbox"
                checked={autoEscrow}
                onChange={(e) => setAutoEscrow(e.target.checked)}
                className="w-4 h-4 accent-[#0054F9] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 3. Vapi RTC Voice Engine Settings */}
        <div className="p-6 rounded-3xl bg-[#111118] border border-white/8 space-y-4">
          <div className="pb-3 border-b border-white/8">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <Radio size={15} className="text-[#0054F9]" />
              <span>Acoustic Voice Engine (Vapi 16kHz)</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Control Roman Urdu / English dialect translation and speech synthesis pipelines.
            </p>
          </div>

          <div className="space-y-3 max-w-md text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0A0A0F] border border-white/8">
              <div>
                <span className="font-semibold text-white block">Devanagari $\to$ Roman Urdu Normalizer</span>
                <span className="text-[10px] text-zinc-400 block">Converts Hindi script to legible Roman Urdu in real time</span>
              </div>
              <input
                type="checkbox"
                checked={vapiUrduMode}
                onChange={(e) => setVapiUrduMode(e.target.checked)}
                className="w-4 h-4 accent-[#0054F9] cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-2xl bg-[#0A0A0F] border border-white/8 space-y-1 text-[11px] font-code text-zinc-400">
              <div className="flex justify-between">
                <span>Webhook Health:</span>
                <span className="text-emerald-400 font-semibold">200 OK (Reverse Proxy Active)</span>
              </div>
              <div className="flex justify-between">
                <span>Assistant ID:</span>
                <span className="text-[#D4A843]">7256aa53-d8eb-4323-baac...</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
