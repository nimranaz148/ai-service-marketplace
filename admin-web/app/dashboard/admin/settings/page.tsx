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
      <div className="relative rounded-[2rem] p-6 sm:p-8 bg-surface-raised border border-hairline shadow-raised overflow-hidden">

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-pill border border-hairline bg-surface-sunken px-3 py-1 text-xs font-medium text-ink-muted mb-3">
              <Settings size={13} className="text-accent" />
              <span>SUPER ADMIN / PLATFORM GOVERNANCE</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink tracking-tight">
              Platform Governance & Controls
            </h1>
            <p className="font-body text-xs sm:text-sm text-ink-muted mt-2 max-w-2xl leading-relaxed">
              Global marketplace economics, metro cluster activations, and acoustic voice engine parameters across Pakistani hubs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard/admin"
              className="h-10 px-4 rounded-xl bg-surface-raised hover:bg-surface-sunken text-ink border border-hairline text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <ChevronLeft size={14} className="text-accent" />
              <span>Admin Deck</span>
            </Link>
            <Button
              onClick={handleSave}
              className="h-10 px-4 rounded-xl bg-primary hover:bg-[var(--accent-strong-hover)] text-accent-ink shadow-raised font-display font-bold text-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Save size={14} />
              <span>Save Settings</span>
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Metro Coverage Clusters */}
        <div className="p-6 rounded-3xl bg-surface-raised border border-hairline space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <div>
              <h3 className="font-display font-bold text-sm text-ink">
                Active Pakistani Metro Clusters
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Toggle dispatch availability across hyper-local metropolitan hubs.
              </p>
            </div>
            <span className="font-code text-[10px] text-accent bg-accent-tint px-2.5 py-0.5 rounded-full border border-status-live-line">
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
                    ? "bg-surface-raised border-status-live-line shadow-raised"
                    : "bg-surface border-hairline opacity-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-code text-xs font-bold text-accent">{metro.code}</span>
                  <span className={`w-2 h-2 rounded-full ${metro.state ? "bg-accent" : "bg-status-stop"}`} />
                </div>
                <div>
                  <span className="font-display font-bold text-xs text-ink block">{metro.name}</span>
                  <span className="text-[10px] text-ink-muted block mt-0.5">
                    {metro.state ? "High-Density Dispatch Active" : "Cluster Suspended"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Marketplace Economics */}
        <div className="p-6 rounded-3xl bg-surface-raised border border-hairline space-y-4">
          <div className="pb-3 border-b border-hairline">
            <h3 className="font-display font-bold text-sm text-ink">
              Marketplace Commission & Escrow Gate
            </h3>
            <p className="text-xs text-ink-muted mt-0.5">
              Set the platform cut retained per completed master artisan booking.
            </p>
          </div>

          <div className="space-y-4 max-w-md">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-ink-muted">Platform Commission Rate:</span>
                <span className="font-code font-bold text-sm text-accent">{commissionRate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
              />
              <div className="flex items-center justify-between text-[10px] font-code text-ink-muted mt-1">
                <span>5% (Subsidized)</span>
                <span>10% (Standard)</span>
                <span>25% (Premium)</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-ink block">Post-Service Escrow Auto-Release</span>
                <span className="text-[11px] text-ink-muted block">Release artisan payout only after customer OTP confirmation.</span>
              </div>
              <input
                type="checkbox"
                checked={autoEscrow}
                onChange={(e) => setAutoEscrow(e.target.checked)}
                className="w-4 h-4 accent-[var(--accent)] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 3. Vapi RTC Voice Engine Settings */}
        <div className="p-6 rounded-3xl bg-surface-raised border border-hairline space-y-4">
          <div className="pb-3 border-b border-hairline">
            <h3 className="font-display font-bold text-sm text-ink flex items-center gap-2">
              <Radio size={15} className="text-accent" />
              <span>Acoustic Voice Engine (Vapi 16kHz)</span>
            </h3>
            <p className="text-xs text-ink-muted mt-0.5">
              Control Roman Urdu / English dialect translation and speech synthesis pipelines.
            </p>
          </div>

          <div className="space-y-3 max-w-md text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-surface border border-hairline">
              <div>
                <span className="font-semibold text-ink block">Devanagari $\to$ Roman Urdu Normalizer</span>
                <span className="text-[10px] text-ink-muted block">Converts Hindi script to legible Roman Urdu in real time</span>
              </div>
              <input
                type="checkbox"
                checked={vapiUrduMode}
                onChange={(e) => setVapiUrduMode(e.target.checked)}
                className="w-4 h-4 accent-[var(--accent)] cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-2xl bg-surface border border-hairline space-y-1 text-[11px] font-code text-ink-muted">
              <div className="flex justify-between">
                <span>Webhook Health:</span>
                <span className="text-status-go font-semibold">200 OK (Reverse Proxy Active)</span>
              </div>
              <div className="flex justify-between">
                <span>Assistant ID:</span>
                <span className="text-status-warn">7256aa53-d8eb-4323-baac...</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
