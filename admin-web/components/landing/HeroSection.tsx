"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Navigation,
  Send,
  CheckCircle2,
  Lock,
  Bot,
  Zap,
  Phone,
} from "lucide-react";
import { api } from "@/lib/api";

const SAMPLE_PROMPTS = [
  {
    query: "Kal subah 10:30 baje G-13 Islamabad mein AC servicing chahiye",
    service: "AC Technician & HVAC",
    city: "Sector G-13, Islamabad",
    artisan: "Tariq Mehmood",
    rating: "4.96",
    eta: "25 min",
  },
  {
    query: "Gulshan Karachi Block 4 mein emergency plumber bhejo - motor issue",
    service: "Plumbing & Hydro Systems",
    city: "Gulshan-e-Iqbal, Karachi",
    artisan: "Arshad Hussain",
    rating: "4.94",
    eta: "18 min",
  },
  {
    query: "DHA Phase 5 Lahore mein solar hybrid inverter electrician book karo",
    service: "Solar Electrical Systems",
    city: "DHA Phase 5, Lahore",
    artisan: "Bilal Ahmed",
    rating: "4.98",
    eta: "35 min",
  },
];

export function HeroSection() {
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [promptInput, setPromptInput] = useState(SAMPLE_PROMPTS[0].query);
  const [isSimulating, setIsSimulating] = useState(false);
  const [dispatchedToken, setDispatchedToken] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const centerCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPromptInput(SAMPLE_PROMPTS[activePromptIndex].query);
  }, [activePromptIndex]);

  // Subtle 3D mouse parallax on hero cards (Catalis style)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      if (leftCardRef.current) {
        gsap.to(leftCardRef.current, { x: x * -15, y: y * -10, rotationY: x * 8, duration: 0.5, ease: "power2.out" });
      }
      if (rightCardRef.current) {
        gsap.to(rightCardRef.current, { x: x * 15, y: y * -10, rotationY: x * -8, duration: 0.5, ease: "power2.out" });
      }
      if (centerCardRef.current) {
        gsap.to(centerCardRef.current, { x: x * 5, y: y * 5, rotationX: -y * 4, rotationY: x * 4, duration: 0.5, ease: "power2.out" });
      }
    };

    container.addEventListener("mousemove", onMouseMove);
    return () => container.removeEventListener("mousemove", onMouseMove);
  }, []);

  const handleSimulateDispatch = () => {
    setIsSimulating(true);
    setDispatchedToken(null);
    setTimeout(() => {
      setIsSimulating(false);
      setDispatchedToken(`BK-${Math.floor(1000 + Math.random() * 9000)}`);
    }, 1200);
  };

  const activeData = SAMPLE_PROMPTS[activePromptIndex];

  return (
    <section className="relative pt-28 pb-16 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#0054F9]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* 1. HERO WRAPPER (Catalis section_home container) */}
      <div
        ref={containerRef}
        className="rounded-[2.5rem] bg-[#0D0D14]/85 border border-white/8 p-6 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.8)]"
      >
        {/* Subtle grid background texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* HERO LAYOUT (Centered Editorial Command) */}
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          
          {/* Top Pill Badge */}
          <div className="catalis-badge mb-6 shadow-sm">
            <Sparkles size={12} className="text-[#0054F9]" />
            <span>Autonomous AI Concierge Network</span>
          </div>

          {/* Main Title (Catalis Editorial Serif + Sans Hybrid) */}
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] mb-6">
            Autonomous Dispatch,{" "}
            <span className="font-serif italic font-normal text-[#0054F9]">
              Guaranteed Craftsmanship.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-body text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Easily adapt to on-demand maintenance and scale your operations with our 5-agent neural infrastructure. 
            Connect with verified master artisans across Islamabad, Karachi, and Lahore with instant escrow security.
          </p>

          {/* Dual Kinetic Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <Link href="/services">
              <button className="catalis-btn catalis-btn-primary px-7 py-3.5 text-sm font-display font-bold shadow-[0_0_30px_rgba(0,84,249,0.45)]">
                <span>Launch AI Concierge</span>
                <ArrowRight size={16} />
              </button>
            </Link>
            <a href="#about">
              <button className="catalis-btn catalis-btn-secondary px-7 py-3.5 text-sm font-medium">
                <span>Explore Platform Blueprint</span>
              </button>
            </a>
          </div>

          {/* 2. HERO VISUALS (Catalis 3D Floating Perspective Cards Deck) */}
          <div className="w-full relative mt-4 pt-6 perspective-[1000px]">
            
            {/* Visuals Grid: 3 Staggered / Floating Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* LEFT FLOATING CARD (Artisan Proof) */}
              <div
                ref={leftCardRef}
                className="hidden lg:block lg:col-span-3 transform -rotate-2 hover:rotate-0 transition-transform duration-300"
              >
                <div className="p-5 rounded-3xl bg-[#12121A]/90 border border-white/10 shadow-2xl space-y-4 text-left backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] flex items-center justify-center font-bold text-base">
                      TM
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-display font-bold text-sm text-white">Tariq Mehmood</span>
                        <ShieldCheck size={14} className="text-[#0054F9]" />
                      </div>
                      <span className="text-[11px] text-[#D4A843] font-semibold">Master HVAC Specialist</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-zinc-300 font-body">
                    <div className="flex items-center justify-between text-[11px] py-1 border-b border-white/5">
                      <span>Rating</span>
                      <span className="text-[#D4A843] font-bold flex items-center gap-1">
                        <Star size={11} fill="#D4A843" /> 4.96 (142 reviews)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] py-1 border-b border-white/5">
                      <span>NADRA Status</span>
                      <span className="text-emerald-400 font-code font-bold">100% Biometric Pass</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] py-1">
                      <span>Sector</span>
                      <span className="text-zinc-200">G-13, Islamabad</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-code text-zinc-400">
                    ⚡ Auto-Dispatched via Voice Agent in 220ms
                  </div>
                </div>
              </div>

              {/* CENTER MAIN CARD (Interactive Sandbox Terminal) */}
              <div
                ref={centerCardRef}
                className="lg:col-span-6 w-full"
              >
                <div className="p-6 sm:p-8 rounded-[2rem] bg-[#12121C]/95 border-2 border-[#0054F9]/40 shadow-[0_24px_70px_rgba(0,0,0,0.9)] text-left backdrop-blur-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#0054F9]/15 rounded-full blur-3xl pointer-events-none" />

                  {/* Header bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/8 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0054F9] animate-ping" />
                      <span className="text-xs font-code font-bold text-white uppercase tracking-wider">
                        5-Agent Dispatch Sandbox
                      </span>
                    </div>
                    <span className="text-[10px] font-code text-zinc-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                      Live Vapi Core v2.4
                    </span>
                  </div>

                  {/* Prompt Selector Pills */}
                  <div className="space-y-2 mb-4">
                    <span className="text-[11px] font-code uppercase text-zinc-400 font-bold">
                      Select Sample Scenario:
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {SAMPLE_PROMPTS.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setActivePromptIndex(idx);
                            setDispatchedToken(null);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all cursor-pointer whitespace-nowrap ${
                            activePromptIndex === idx
                              ? "bg-[#0054F9] text-white shadow-[0_0_15px_rgba(0,84,249,0.4)]"
                              : "bg-white/5 text-zinc-300 hover:text-white border border-white/5"
                          }`}
                        >
                          {p.service}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Simulated Natural Language Prompt Box */}
                  <div className="relative mb-5">
                    <textarea
                      rows={2}
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-white focus:outline-none focus:border-[#0054F9] transition-colors resize-none leading-relaxed"
                    />
                    <button
                      onClick={handleSimulateDispatch}
                      disabled={isSimulating}
                      className="absolute right-3 bottom-3 catalis-btn catalis-btn-primary py-1.5 px-3.5 text-xs shadow-md"
                    >
                      {isSimulating ? (
                        <span className="animate-spin">⟳</span>
                      ) : (
                        <>
                          <span>Dispatch</span>
                          <Send size={11} />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Realtime Result Badge */}
                  {dispatchedToken ? (
                    <div className="p-3.5 rounded-2xl bg-[#0054F9]/10 border border-[#0054F9]/40 flex items-center justify-between animate-fadeIn">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-[#0054F9]" />
                        <div>
                          <div className="text-xs font-display font-bold text-white">
                            Artisan Matched: {activeData.artisan}
                          </div>
                          <div className="text-[10px] text-zinc-400 font-code">
                            Arrival ETA: {activeData.eta} • Escrow Token: {dispatchedToken}
                          </div>
                        </div>
                      </div>
                      <Link href="/services" className="text-xs text-[#0054F9] font-bold hover:underline">
                        Open Trace →
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[11px] font-code text-zinc-400 pt-1">
                      <span>Active Dialect: Roman Urdu / English</span>
                      <span className="text-[#0054F9]">Ready to Orchestrate</span>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT FLOATING CARD (Escrow & Telemetry Proof) */}
              <div
                ref={rightCardRef}
                className="hidden lg:block lg:col-span-3 transform rotate-2 hover:rotate-0 transition-transform duration-300"
              >
                <div className="p-5 rounded-3xl bg-[#12121A]/90 border border-white/10 shadow-2xl space-y-4 text-left backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-code uppercase text-[#0054F9] font-bold">
                      Escrow Vault Lock
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <div>
                    <div className="font-display font-black text-2xl text-white">PKR 3,500</div>
                    <div className="text-[11px] text-zinc-400 font-body">Guaranteed Artisan Escrow Hold</div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-[#0054F9]" />
                      <span>Release on OTP Verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Navigation size={13} className="text-[#0054F9]" />
                      <span>Live GPS Beacon Tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock size={13} className="text-[#0054F9]" />
                      <span>100% Dispute Protection</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-code text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 size={12} />
                    <span>Bank / Raast Instant Settlement</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
