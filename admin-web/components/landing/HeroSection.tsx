"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Cpu,
  MapPin,
  Star,
  Sparkles,
  RotateCcw,
  Zap,
  Volume2,
  ShieldCheck,
  Radio,
  Clock,
} from "lucide-react";

const SAMPLE_PROMPTS = [
  {
    query: "Kal subah 10:30 baje G-13 Islamabad mein AC servicing chahiye",
    service: "AC Technician",
    city: "Islamabad (Sector G-13)",
    artisan: "Tariq Mehmood",
    rating: "4.96",
    eta: "25 min",
    score: "98.4%",
  },
  {
    query: "Gulshan Karachi Block 4 mein emergency plumber bhejo - motor pump issue",
    service: "Plumbing & Hydro Systems",
    city: "Karachi (Gulshan-e-Iqbal)",
    artisan: "Arshad Hussain",
    rating: "4.94",
    eta: "18 min",
    score: "97.2%",
  },
  {
    query: "DHA Phase 5 Lahore mein solar hybrid inverter electrician book karo",
    service: "Solar Electrical Systems",
    city: "Lahore (DHA Phase 5)",
    artisan: "Bilal Ahmed",
    rating: "4.98",
    eta: "35 min",
    score: "99.1%",
  },
];

const LIVE_DISPATCH_FEED = [
  "⚡ AC Inverter PCB repaired in Sector G-13, Islamabad • 24 min turnaround",
  "🛡️ Emergency hydro pipe welded in Gulshan-e-Iqbal, Karachi • Verified Pass",
  "☀️ 3-Phase hybrid solar load balanced in DHA Phase 5, Lahore • 100% Escrow Lock",
  "🔧 Sanitary acoustic leak resolved in Sector F-7, Islamabad • Tariq Mehmood",
  "⚡ High-voltage breaker audit completed in Clifton Block 2, Karachi",
  "🎓 Pre-engineering calculus mentor booked in Bahria Town, Rawalpindi",
];


function HeroMetric3DCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "rotationY", { duration: 0.35, ease: "power2.out" });
    const yTo = gsap.quickTo(el, "rotationX", { duration: 0.35, ease: "power2.out" });
    const zTo = gsap.quickTo(el, "z", { duration: 0.35, ease: "power2.out" });

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const xRel = (e.clientX - rect.left) / rect.width - 0.5;
      const yRel = (e.clientY - rect.top) / rect.height - 0.5;
      xTo(xRel * 14);
      yTo(-yRel * 14);
      zTo(16);
      setMousePos({
        x: Math.round(((e.clientX - rect.left) / rect.width) * 100),
        y: Math.round(((e.clientY - rect.top) / rect.height) * 100),
      });
    };

    const onMouseEnter = () => setIsHovered(true);
    const onMouseLeave = () => {
      setIsHovered(false);
      xTo(0);
      yTo(0);
      zTo(0);
      setMousePos({ x: 50, y: 50 });
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseenter", onMouseEnter);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div style={{ perspective: "800px" }}>
      <div
        ref={cardRef}
        style={{
          transformStyle: "preserve-3d",
          boxShadow: isHovered
            ? "0 18px 40px -10px rgba(0,0,0,0.85), 0 0 24px rgba(52,211,153,0.18), inset 0 1px 0 rgba(255,255,255,0.12)"
            : "0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
        className="p-4 rounded-xl bg-[#111C17] border border-[#20332B] hover:border-[#34D399]/60 text-center transition-colors duration-300 relative overflow-hidden select-none cursor-pointer active:scale-95"
      >
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(52,211,153,0.15) 0%, transparent 60%)`,
          }}
        />
        <div style={{ transform: "translateZ(20px)" }} className="relative z-10">
          <div className="font-display font-bold text-2xl text-[#F2F7F4] tracking-tight mb-1">
            {value}
          </div>
          <div className="font-body text-xs font-semibold text-[#34D399] mb-0.5">
            {label}
          </div>
          <div className="font-body text-[11px] text-[#8EAAA0]">{sub}</div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [simulating, setSimulating] = useState(false);
  const [step, setStep] = useState(0); // 0 = idle, 1 = parsing, 2 = searching, 3 = ranking, 4 = matched
  const [latency, setLatency] = useState(0);

  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const simWidgetRef = useRef<HTMLDivElement>(null);
  const leftFloatRef = useRef<HTMLDivElement>(null);
  const rightFloatRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // GSAP 3D float physics & entrance animations on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Guaranteed visible fromTo entrance
      gsap.fromTo(
        ".hero-fade-in",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: "power2.out", clearProps: "opacity,transform" }
      );

      // Console entrance
      if (simWidgetRef.current) {
        gsap.fromTo(
          simWidgetRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: "power2.out", clearProps: "opacity" }
        );
      }

      // Left 3D Floating Badge continuous organic float
      if (leftFloatRef.current) {
        gsap.to(leftFloatRef.current, {
          y: -14,
          rotationZ: -2,
          rotationX: 8,
          rotationY: -10,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Right 3D Floating Badge continuous organic float
      if (rightFloatRef.current) {
        gsap.to(rightFloatRef.current, {
          y: 12,
          rotationZ: 2,
          rotationX: -8,
          rotationY: 10,
          duration: 3.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.5,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // 3D Parallax Tilt on the simulator console responding to mouse movement
  useEffect(() => {
    const el = simWidgetRef.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power2.out" });
    const yTo = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power2.out" });

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      xTo(x * 8);
      yTo(-y * 8);
    };

    const onMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);
    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  // Run interactive live dispatch simulation
  const runSimulation = (idx: number) => {
    setSelectedIdx(idx);
    setSimulating(true);
    setStep(1);
    setLatency(120);

    if (timelineRef.current) timelineRef.current.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        setSimulating(false);
      },
    });
    timelineRef.current = tl;

    // Step 1 -> 2
    tl.to({}, { duration: 0.45, onComplete: () => { setStep(2); setLatency(380); } });
    // Step 2 -> 3
    tl.to({}, { duration: 0.5, onComplete: () => { setStep(3); setLatency(740); } });
    // Step 3 -> 4
    tl.to({}, {
      duration: 0.4,
      onComplete: () => {
        setStep(4);
        setLatency(980);
        // Animate match card entrance
        gsap.fromTo(
          ".match-card-reveal",
          { opacity: 0, y: 14, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.4)" }
        );
      },
    });
  };

  const current = SAMPLE_PROMPTS[selectedIdx];

  return (
    <section
      ref={heroRef}
      className="relative pt-32 pb-20 px-4 sm:px-8 gradient-atmosphere overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative">
        {/* ========================================================
            3D FLOATING KINETIC BADGES (LEFT & RIGHT)
            ======================================================== */}
        <div
          ref={leftFloatRef}
          style={{ transformStyle: "preserve-3d", perspective: 800 }}
          className="hidden xl:flex absolute -left-20 top-40 z-20 p-3.5 rounded-2xl bg-[#0D1612]/95 backdrop-blur-md border border-[#20332B] shadow-[0_16px_36px_rgba(0,0,0,0.6)] items-center gap-3 w-56"
        >
          <div className="w-9 h-9 rounded-xl bg-[#162D23] border border-[#2B493B] flex items-center justify-center text-[#34D399] flex-shrink-0">
            <Radio size={16} className="text-[#34D399] animate-pulse" />
          </div>
          <div>
            <span className="font-code text-[10px] text-[#6B877B] uppercase block">
              Acoustic Stream
            </span>
            <span className="font-display font-bold text-xs text-[#F2F7F4] block leading-tight">
              16kHz Vapi WebRTC
            </span>
            <span className="font-body text-[10px] text-[#34D399] font-semibold">
              ● Roman Urdu Active
            </span>
          </div>
        </div>

        <div
          ref={rightFloatRef}
          style={{ transformStyle: "preserve-3d", perspective: 800 }}
          className="hidden xl:flex absolute -right-20 top-56 z-20 p-3.5 rounded-2xl bg-[#0D1612]/95 backdrop-blur-md border border-[#20332B] shadow-[0_16px_36px_rgba(0,0,0,0.6)] items-center gap-3 w-56"
        >
          <div className="w-9 h-9 rounded-xl bg-[#1A1910] border border-[#3E341B] flex items-center justify-center text-[#D4A843] flex-shrink-0">
            <ShieldCheck size={18} className="text-[#D4A843]" />
          </div>
          <div>
            <span className="font-code text-[10px] text-[#6B877B] uppercase block">
              Identity Verification
            </span>
            <span className="font-display font-bold text-xs text-[#F2F7F4] block leading-tight">
              NADRA Bio-Vetted
            </span>
            <span className="font-body text-[10px] text-[#D4A843] font-semibold">
              ● 100% Background Check
            </span>
          </div>
        </div>

        {/* Top Eyebrow Tag */}
        <div className="flex justify-center mb-6 hero-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111C17] border border-[#20332B] shadow-[0_2px_12px_rgba(0,0,0,0.3)] text-[#F2F7F4] text-xs font-semibold font-body tracking-tight">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34D399]"></span>
            </span>
            <span>Deterministic 5-Agent Architecture</span>
            <span className="text-[#34D399] font-bold">·</span>
            <span className="text-[#8EAAA0] font-normal">Roman Urdu & Urdu Native</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto mb-6">
          <h1
            ref={titleRef}
            className="hero-fade-in font-display font-extrabold text-[42px] sm:text-[64px] lg:text-[72px] leading-[1.06] tracking-[-0.03em] text-[#F2F7F4]"
          >
            Local services, orchestrated with{" "}
            <span className="relative inline-block text-[#34D399]">
              uncompromising craft
              <svg
                className="absolute left-0 -bottom-1.5 w-full h-2 text-[#34D399]/60"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 9C70 3 230 3 298 9"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </h1>
        </div>

        {/* Subtitle */}
        <p className="hero-fade-in font-body text-[16px] sm:text-[18px] text-[#A3B8AF] max-w-2xl mx-auto text-center leading-relaxed mb-8">
          Speak in natural Roman Urdu, Urdu, or English. Five synchronized agents extract intent,
          query geospatial availability in Supabase, and dispatch certified master artisans in
          under 60 seconds.
        </p>

        {/* Top CTAs */}
        <div className="hero-fade-in flex flex-wrap items-center justify-center gap-3.5 mb-10">
          <Link href="/services">
            <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#162D23] hover:bg-[#1E3B2E] text-[#F2F7F4] border border-[#2F5444] font-body font-semibold text-[14px] shadow-[0_0_24px_rgba(52,211,153,0.2)] active:scale-[0.98] transition-all">
              <span>Open Concierge Console</span>
              <ArrowRight size={16} className="text-[#34D399]" />
            </button>
          </Link>
          <a href="#voice-engine">
            <button className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#111C17] border border-[#20332B] text-[#F2F7F4] font-body font-semibold text-[14px] shadow-sm hover:border-[#34D399]/40 hover:bg-[#16251F] active:scale-[0.98] transition-all">
              <Volume2 size={16} className="text-[#34D399]" />
              <span>Listen to Voice Dispatch</span>
            </button>
          </a>
        </div>

        {/* ========================================================
            KINETIC INFINITE DISPATCH TICKER MARQUEE
            ======================================================== */}
        <div className="mb-12 overflow-hidden border-y border-[#1F3329] py-2.5 bg-[#0A120E]/80 backdrop-blur-sm">
          <div className="flex items-center gap-8 whitespace-nowrap ticker-track">
            {LIVE_DISPATCH_FEED.concat(LIVE_DISPATCH_FEED).map((feed, fIdx) => (
              <span
                key={fIdx}
                className="inline-flex items-center gap-2 font-body text-xs text-[#8EAAA0] font-medium"
              >
                <span>{feed}</span>
                <span className="text-[#34D399] opacity-75">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ========================================================
            3D PERSPECTIVE SIMULATOR CONSOLE
            ======================================================== */}
        <div
          style={{ perspective: "1200px" }}
          className="flex justify-center"
        >
          <div
            ref={simWidgetRef}
            style={{ transformStyle: "preserve-3d" }}
            className="rounded-2xl p-5 sm:p-7 w-full max-w-4xl shadow-[0_24px_64px_rgba(0,0,0,0.6)] border border-[#20332B] bg-[#111C17]"
          >
            {/* Top Bar of Console */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1F3329] mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#34D399] animate-pulse" />
                <span className="font-display font-bold text-sm tracking-tight text-[#F2F7F4]">
                  Live Agentic Dispatch Simulator
                </span>
                <span className="font-code text-[11px] px-2 py-0.5 rounded bg-[#162D23] border border-[#2B493B] text-[#34D399] font-medium">
                  VAPI RTC + SUPABASE
                </span>
              </div>
              <div className="flex items-center gap-3 font-code text-xs text-[#8EAAA0]">
                <span>Latency:</span>
                <span className="font-semibold text-[#34D399]">
                  {latency > 0 ? `${latency}ms` : "Standby"}
                </span>
              </div>
            </div>

            {/* Prompt Selection Chips */}
            <div className="mb-5">
              <p className="font-body text-xs font-semibold text-[#8EAAA0] uppercase tracking-wider mb-2">
                Select or test customer voice request:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {SAMPLE_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => runSimulation(idx)}
                    className={`text-left p-3 rounded-xl border transition-all text-xs font-body ${
                      selectedIdx === idx
                        ? "bg-[#162D23] border-[#34D399] text-[#F2F7F4] shadow-sm"
                        : "bg-[#0B1310] border-[#1F3329] text-[#8EAAA0] hover:border-[#2B493B] hover:text-[#F2F7F4]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[11px] text-[#34D399]">
                        {item.service}
                      </span>
                      <span className="text-[10px] text-[#5E796F] font-code">Preset 0{idx + 1}</span>
                    </div>
                    <p className="line-clamp-2 leading-relaxed text-[#D1E0D9]">
                      &ldquo;{item.query}&rdquo;
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* 5-Step Pipeline Progress Indicator */}
            <div className="bg-[#0B1310] p-4 rounded-xl border border-[#1F3329] mb-5">
              <div className="flex items-center justify-between mb-3 text-xs font-body">
                <span className="font-semibold text-[#F2F7F4]">Execution Pipeline:</span>
                <button
                  onClick={() => runSimulation(selectedIdx)}
                  disabled={simulating}
                  className="inline-flex items-center gap-1.5 text-xs text-[#34D399] font-semibold hover:text-[#52e4b0] transition-colors"
                >
                  <RotateCcw size={13} className={simulating ? "animate-spin" : ""} />
                  <span>Rerun Dispatch Flow</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { s: 1, name: "Intent Parser", tool: "@parse_urdu" },
                  { s: 2, name: "Geo Discovery", tool: "@radius_query" },
                  { s: 3, name: "Tri-Factor Rank", tool: "@rank_artisan" },
                  { s: 4, name: "Slot Lock", tool: "@commit_booking" },
                ].map((pipe) => {
                  const isActive = step === pipe.s;
                  const isPassed = step > pipe.s;
                  return (
                    <div
                      key={pipe.s}
                      className={`p-2.5 rounded-lg border transition-all text-xs ${
                        isActive
                          ? "bg-[#162D23] border-[#34D399] text-[#F2F7F4] shadow-sm"
                          : isPassed
                          ? "bg-[#132A1F] border-[#214735] text-[#34D399]"
                          : "bg-[#080E0B] border-[#16241E] text-[#5E796F]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-code font-bold text-[10px]">0{pipe.s}</span>
                        {isPassed ? (
                          <CheckCircle2 size={12} className="text-[#34D399]" />
                        ) : isActive ? (
                          <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1F3329]" />
                        )}
                      </div>
                      <div className="font-semibold text-[11px] text-[#F2F7F4] truncate">
                        {pipe.name}
                      </div>
                      <div className="font-code text-[10px] text-[#6B877B] truncate">{pipe.tool}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Matched Result Card */}
            <div className="match-card-reveal bg-[#0D1813] border border-[#1F3329] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#162D23] border border-[#2B493B] text-[#34D399] flex items-center justify-center font-display font-bold text-base">
                  {current.artisan.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-[16px] text-[#F2F7F4]">
                      {current.artisan}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#1A1910] border border-[#3E341B] text-[#D4A843] font-code text-[11px] font-semibold">
                      <Star size={11} fill="currentColor" />
                      {current.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-body text-xs text-[#8EAAA0] mt-0.5">
                    <MapPin size={12} className="text-[#34D399]" />
                    <span>{current.city}</span>
                    <span>·</span>
                    <span className="font-medium text-[#34D399]">{current.service}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <div className="font-code text-[10px] uppercase text-[#6B877B] tracking-wider">
                    Tri-Factor Match
                  </div>
                  <div className="font-display font-bold text-lg text-[#34D399]">
                    {current.score}
                  </div>
                </div>
                <Link href="/services">
                  <button className="px-4 py-2.5 rounded-lg bg-[#162D23] border border-[#2F5444] text-[#F2F7F4] text-xs font-semibold font-body hover:bg-[#1E3B2E] active:scale-[0.98] transition-all">
                    Instant Reserve
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Footprint - 3D Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
          {[
            { label: "AI Dispatch Latency", value: "< 1.2s", sub: "End-to-end Vapi + Supabase" },
            { label: "Background Verification", value: "100%", sub: "NADRA & Police Checked" },
            { label: "Language Accuracy", value: "99.4%", sub: "Roman Urdu & English Dialect" },
            { label: "Service Coverage", value: "3 Metros", sub: "Islamabad, Karachi, Lahore" },
          ].map((m, idx) => (
            <HeroMetric3DCard key={idx} label={m.label} value={m.value} sub={m.sub} />
          ))}
        </div>
      </div>
    </section>
  );
}
