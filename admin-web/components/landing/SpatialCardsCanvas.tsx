"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Pause,
  Play,
  CheckCircle2,
  Zap,
  Droplets,
  Car,
  Sparkle,
  type LucideIcon,
} from "lucide-react";

interface Artisan {
  id: number;
  name: string;
  trade: string;
  icon: LucideIcon;
  city: string;
  metro: string;
  rating: string;
  jobs: number;
  badge: string;
  experience: string;
  specialty: string[];
  slot: string;
  rate: string;
  score: string;
  accent: string;
}

const ARTISANS: Artisan[] = [
  {
    id: 0,
    name: "Tariq Mehmood",
    trade: "HVAC & Inverter Master",
    icon: Zap,
    city: "Sector G-13, Islamabad",
    metro: "Islamabad Capital",
    rating: "4.96",
    jobs: 142,
    badge: "Master Artisan",
    experience: "14 Years Exp",
    specialty: ["DC Inverter PCB Repair", "R32 / R410 Vacuum", "Coil Sanitization"],
    slot: "Today 10:30 AM",
    rate: "PKR 2,500+",
    score: "98.4%",
    accent: "#0054F9",
  },
  {
    id: 1,
    name: "Arshad Hussain",
    trade: "Hydro & Sanitary Engineering",
    icon: Droplets,
    city: "Gulshan Block 4, Karachi",
    metro: "Karachi South",
    rating: "4.94",
    jobs: 218,
    badge: "Emergency Certified",
    experience: "11 Years Exp",
    specialty: ["Acoustic Leak Detection", "PPR-C Pipe Fusion", "Motor Overhaul"],
    slot: "Today 11:15 AM",
    rate: "PKR 1,800+",
    score: "97.2%",
    accent: "#38BDF8",
  },
  {
    id: 2,
    name: "Bilal Ahmed",
    trade: "Solar & 3-Phase Electrician",
    icon: Zap,
    city: "DHA Phase 5, Lahore",
    metro: "Lahore Metro",
    rating: "4.98",
    jobs: 195,
    badge: "Solar Certified",
    experience: "16 Years Exp",
    specialty: ["3-Phase Load Balancing", "Hybrid Inverter Config", "Breaker Panel Audit"],
    slot: "Today 01:00 PM",
    rate: "PKR 2,200+",
    score: "99.1%",
    accent: "#D4A843",
  },
  {
    id: 3,
    name: "Kamran Rafiq",
    trade: "Automotive ECU & Diagnostics",
    icon: Car,
    city: "Sector F-10, Islamabad",
    metro: "Islamabad Capital",
    rating: "4.92",
    jobs: 116,
    badge: "Diagnostics Master",
    experience: "9 Years Exp",
    specialty: ["OBD2 Live Telemetry", "Alternator Rebuilding", "CAN Bus Harness Fix"],
    slot: "Today 02:30 PM",
    rate: "PKR 2,800+",
    score: "96.8%",
    accent: "#A78BFA",
  },
  {
    id: 4,
    name: "Salman Sheikh",
    trade: "Commercial Deep Detailing",
    icon: Sparkle,
    city: "PECHS Block 2, Karachi",
    metro: "Karachi East",
    rating: "4.97",
    jobs: 164,
    badge: "Extraction Specialist",
    experience: "12 Years Exp",
    specialty: ["Steam Extraction 160°C", "Upholstery Revive", "Post-Reno Detailing"],
    slot: "Tomorrow 09:00 AM",
    rate: "PKR 3,500+",
    score: "98.9%",
    accent: "#0054F9",
  },
];

export function SpatialCardsCanvas() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const total = ARTISANS.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay loop
  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4000);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  // Subtle 3D mouse parallax on stage hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xNorm = (e.clientX - rect.left) / rect.width - 0.5;
    const yNorm = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({
      x: xNorm * 10,
      y: -yNorm * 8,
    });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
    setIsAutoPlaying(true);
  };

  // Drag / Swipe support
  const handlePointerDown = (e: React.PointerEvent) => {
    setDragStartX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX === null) return;
    const diff = e.clientX - dragStartX;
    if (diff > 50) {
      prevSlide();
    } else if (diff < -50) {
      nextSlide();
    }
    setDragStartX(null);
  };

  return (
    <section
      id="roster"
      className="relative py-24 px-4 sm:px-8 bg-[#0A0A0F] border-y border-white/8 overflow-hidden select-none"
    >
      {/* Ambient background spatial glow rings (Catalis Cobalt theme) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#0054F9]/15 via-[#0054F9]/5 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] border border-[#0054F9]/10 rounded-[100%] pointer-events-none transform -rotate-12 scale-y-50" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with Title & Controls (Catalis editorial layout) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="catalis-badge mb-3">
              <Sparkles size={12} className="text-[#0054F9]" />
              <span>3D SPATIAL COVERFLOW</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight mb-3">
              Verified Master Artisans{" "}
              <span className="font-serif italic font-normal text-[#0054F9]">
                Roster.
              </span>
            </h2>
            <p className="font-body text-sm sm:text-base text-zinc-400 max-w-xl">
              Orbit through certified tier-1 specialists in Islamabad, Karachi, and Lahore. Click any
              card to bring it to center focus or reserve directly into active dispatch.
            </p>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAutoPlaying((p) => !p)}
              className="px-4 py-2 rounded-full bg-[#141420] border border-white/10 text-white hover:bg-[#1A1A28] hover:border-[#0054F9]/40 transition-all shadow-sm flex items-center gap-2 text-xs font-semibold font-body active:scale-95 cursor-pointer"
              title={isAutoPlaying ? "Pause 3D rotation" : "Resume 3D rotation"}
            >
              {isAutoPlaying ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0054F9] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0054F9]"></span>
                  </span>
                  <Pause size={13} className="text-[#0054F9]" />
                  <span>Orbiting</span>
                </>
              ) : (
                <>
                  <Play size={13} className="text-zinc-400" />
                  <span>Paused</span>
                </>
              )}
            </button>

            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-[#141420] border border-white/10 text-white hover:bg-[#1A1A28] hover:border-[#0054F9]/40 flex items-center justify-center transition-all shadow-sm active:scale-90 cursor-pointer"
              aria-label="Previous 3D artisan card"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-[#0054F9] border border-[#0054F9] text-white hover:bg-[#2D40EA] flex items-center justify-center transition-all shadow-[0_0_15px_rgba(0,84,249,0.35)] active:scale-90 cursor-pointer"
              aria-label="Next 3D artisan card"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ========================================================
            3D SPATIAL CAROUSEL STAGE (PRESERVED)
            ======================================================== */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={handleMouseLeave}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          style={{ perspective: "1200px" }}
          className="relative w-full h-[520px] sm:h-[540px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          {/* 3D Transform Hub */}
          <div
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateY(${mouseTilt.x}deg) rotateX(${mouseTilt.y}deg)`,
              transition: "transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {ARTISANS.map((artisan, index) => {
              let diff = index - activeIndex;
              if (diff > total / 2) diff -= total;
              if (diff < -total / 2) diff += total;

              const isCenter = diff === 0;
              const isImmediateLeft = diff === -1;
              const isImmediateRight = diff === 1;
              const isOuterLeft = diff === -2;
              const isOuterRight = diff === 2;

              let translateX = 0;
              let translateZ = 0;
              let rotateY = 0;
              let scale = 1;
              let opacity = 1;
              let zIndex = 10;
              let filter = "none";

              if (isCenter) {
                translateX = 0;
                translateZ = 80;
                rotateY = 0;
                scale = 1.04;
                opacity = 1;
                zIndex = 30;
                filter = "drop-shadow(0 25px 50px rgba(0,0,0,0.85)) drop-shadow(0 0 35px rgba(0,84,249,0.25))";
              } else if (isImmediateLeft) {
                translateX = -280;
                translateZ = -90;
                rotateY = 32;
                scale = 0.88;
                opacity = 0.68;
                zIndex = 20;
                filter = "blur(0.4px) drop-shadow(0 15px 30px rgba(0,0,0,0.6))";
              } else if (isImmediateRight) {
                translateX = 280;
                translateZ = -90;
                rotateY = -32;
                scale = 0.88;
                opacity = 0.68;
                zIndex = 20;
                filter = "blur(0.4px) drop-shadow(0 15px 30px rgba(0,0,0,0.6))";
              } else if (isOuterLeft) {
                translateX = -480;
                translateZ = -240;
                rotateY = 48;
                scale = 0.74;
                opacity = 0.3;
                zIndex = 10;
                filter = "blur(1.8px)";
              } else if (isOuterRight) {
                translateX = 480;
                translateZ = -240;
                rotateY = -48;
                scale = 0.74;
                opacity = 0.3;
                zIndex = 10;
                filter = "blur(1.8px)";
              }

              const TradeIcon = artisan.icon;

              return (
                <div
                  key={artisan.id}
                  onClick={() => setActiveIndex(index)}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    zIndex,
                    filter,
                    transition:
                      "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.65s ease, filter 0.65s ease",
                    transformStyle: "preserve-3d",
                  }}
                  className={`absolute w-[320px] sm:w-[360px] rounded-[2rem] p-6 flex flex-col justify-between cursor-pointer transition-colors duration-300 backdrop-blur-xl ${
                    isCenter
                      ? "bg-[#141424] border-2 border-[#0054F9] shadow-2xl"
                      : "bg-[#111118]/90 border border-white/10 hover:border-white/20 hover:opacity-90"
                  }`}
                >
                  {/* Top Header */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-extrabold text-lg shadow-sm border transition-all ${
                            isCenter
                              ? "bg-[#0054F9]/20 border-[#0054F9]/60 text-[#0054F9]"
                              : "bg-[#141420] border-white/10 text-zinc-400"
                          }`}
                        >
                          <TradeIcon size={22} className={isCenter ? "text-[#0054F9]" : "text-zinc-400"} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-display font-extrabold text-base text-white">
                              {artisan.name}
                            </h3>
                            <ShieldCheck size={16} className="text-[#0054F9]" />
                          </div>
                          <p className="font-body text-xs text-zinc-400 font-medium">{artisan.trade}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1A1910] border border-[#3E341B] text-[#FBBF24] font-code text-xs font-bold shadow-sm">
                        <Star size={12} fill="currentColor" />
                        <span>{artisan.rating}</span>
                      </div>
                    </div>

                    {/* Verification Strip */}
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5 text-[11px] font-body text-zinc-400">
                      <span className="px-2 py-0.5 rounded-full bg-[#0054F9]/15 border border-[#0054F9]/30 text-[#0054F9] font-semibold font-code text-[10px] flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        {artisan.badge}
                      </span>
                      <span>·</span>
                      <span>{artisan.experience}</span>
                      <span>·</span>
                      <span className="font-medium text-white">{artisan.jobs} Jobs</span>
                    </div>

                    {/* Verified Capabilities */}
                    <div className="space-y-1.5 mb-4">
                      <p className="font-body text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                        Verified Capabilities:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {artisan.specialty.map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-body transition-colors ${
                              isCenter
                                ? "bg-[#0A0A0F] border border-white/10 text-zinc-200"
                                : "bg-[#0A0A0F]/60 border border-white/5 text-zinc-400"
                            }`}
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer with Live Slot & Reservation */}
                  <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs font-body text-zinc-400 mb-3.5">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#0054F9]" />
                        <span>{artisan.city}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium text-white bg-[#141420] px-2 py-0.5 rounded-md border border-white/10 font-code text-[11px]">
                        <Clock size={12} className="text-[#0054F9]" />
                        <span>{artisan.slot}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-code text-[10px] uppercase tracking-wider text-zinc-500 block">
                          Tri-Factor Match
                        </span>
                        <span className="font-display font-extrabold text-xl text-[#0054F9]">
                          {artisan.score}
                        </span>
                      </div>

                      <Link href="/services">
                        <button
                          tabIndex={isCenter ? 0 : -1}
                          className={`catalis-btn text-xs font-display font-bold px-4 py-2 ${
                            isCenter
                              ? "catalis-btn-primary shadow-[0_0_15px_rgba(0,84,249,0.35)]"
                              : "catalis-btn-secondary"
                          }`}
                        >
                          <span>Reserve Slot</span>
                          <ArrowUpRight size={13} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Pagination Dots & Metro Status Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-white/8">
          <div className="flex items-center gap-2 text-xs font-body text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Artisan {activeIndex + 1} of {total}:{" "}
              <strong className="text-white">{ARTISANS[activeIndex].name}</strong> (
              {ARTISANS[activeIndex].metro})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {ARTISANS.map((artisan, idx) => (
              <button
                key={artisan.id}
                onClick={() => setActiveIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === idx
                    ? "w-8 bg-[#0054F9] shadow-[0_0_12px_rgba(0,84,249,0.6)]"
                    : "w-2.5 bg-white/10 hover:bg-white/20"
                }`}
                aria-label={`Jump to ${artisan.name} (${artisan.trade})`}
                title={`${artisan.name} · ${artisan.trade}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
