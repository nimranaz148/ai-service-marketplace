"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { Mic, Volume2, Play, Pause, Radio, Check, Sparkles } from "lucide-react";

const DIALECT_SAMPLES = [
  {
    id: "isb",
    city: "Islamabad (Sector G-13)",
    language: "Roman Urdu",
    userQuery: "Bhai kal subah 10 baje G-13 Islamabad mein AC technician chahiye cooling issue ke liye.",
    aiResponse:
      "Ji bilkul! Sector G-13 ke verified master technician Tariq Mehmood kal subah 10:30 AM par available hain. Composite match score 98.4%. Booking confirm kar doon?",
    matchedArtisan: "Tariq Mehmood (4.96★)",
    slotTime: "Tomorrow 10:30 AM",
    latency: "340ms",
  },
  {
    id: "khi",
    city: "Karachi (Gulshan-e-Iqbal)",
    language: "Colloquial Urdu",
    userQuery:
      "Gulshan Block 4 mein emergency plumber bhejo — kitchen ka motor pump over-flow ho raha hai.",
    aiResponse:
      "Samajh gaya! Arshad Hussain Gulshan Block 4 se sirf 800 meters door hain aur 20 minutes mein pohanch sakte hain. Tamper-evident booking code issue kar diya gaya hai.",
    matchedArtisan: "Arshad Hussain (4.94★)",
    slotTime: "Immediate (18 min ETA)",
    latency: "280ms",
  },
  {
    id: "lhe",
    city: "Lahore (DHA Phase 5)",
    language: "English / Urdu Blend",
    userQuery:
      "I need a certified solar inverter engineer in DHA Lahore for 3-phase hybrid calibration.",
    aiResponse:
      "Understood. Bilal Ahmed, our senior solar electrical engineer in DHA Phase 5, has an open slot today at 1:00 PM. Shall I lock this appointment for you?",
    matchedArtisan: "Bilal Ahmed (4.98★)",
    slotTime: "Today 01:00 PM",
    latency: "310ms",
  },
];

export function VoiceShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  const stageRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const audioAnimationRef = useRef<gsap.core.Tween | null>(null);

  const sample = DIALECT_SAMPLES[activeTab];

  // GSAP animated audio waveform visualizer
  useEffect(() => {
    if (!barsRef.current) return;
    const bars = barsRef.current.querySelectorAll(".wave-bar");

    if (isPlaying) {
      const tween = gsap.to(bars, {
        height: () => `${Math.floor(Math.random() * 46) + 10}px`,
        duration: 0.14,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          each: 0.025,
          from: "center",
        },
      });
      audioAnimationRef.current = tween;
    } else {
      if (audioAnimationRef.current) audioAnimationRef.current.kill();
      gsap.to(bars, {
        height: "8px",
        duration: 0.35,
        ease: "power2.out",
      });
    }

    return () => {
      if (audioAnimationRef.current) audioAnimationRef.current.kill();
    };
  }, [isPlaying]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setTimeout(() => {
        setIsPlaying(false);
      }, 7500);
    }
  };

  // 3D Mouse Parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const xNorm = (e.clientX - rect.left) / rect.width - 0.5;
    const yNorm = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({
      x: xNorm * 8,
      y: -yNorm * 8,
    });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  return (
    <section id="voice-engine" className="py-24 px-4 sm:px-8 bg-[#090E0C] border-b border-[#1F3329] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[400px] bg-[#34D399]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111C17] border border-[#20332B] text-[#34D399] text-xs font-semibold font-body tracking-tight mb-3 shadow-sm">
            <Radio size={13} className="text-[#34D399]" />
            <span>Acoustic Engine · Powered by Vapi WebRTC</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F2F7F4] tracking-tight mb-3">
            Natural speech in Roman Urdu, Urdu & English.
          </h2>
          <p className="font-body text-sm text-[#A3B8AF] leading-relaxed">
            No rigid form fields. Customers call or send voice notes in colloquial local phrasing.
            Our acoustic model understands sector terminology, local landmarks, and urgent triage.
          </p>
        </div>

        {/* Dialect Tabs with 3D elevation */}
        <div
          style={{ perspective: "800px" }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {DIALECT_SAMPLES.map((item, idx) => {
            const isSelected = activeTab === idx;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(idx);
                  setIsPlaying(false);
                }}
                style={{
                  transform: isSelected ? "translateZ(8px)" : "translateZ(0px)",
                  boxShadow: isSelected ? "0 8px 24px rgba(0,0,0,0.5), 0 0 16px rgba(52,211,153,0.2)" : "none",
                }}
                className={`px-4 py-2.5 rounded-xl border font-body text-xs font-semibold transition-all duration-300 active:scale-95 ${
                  isSelected
                    ? "bg-[#162D23] border-[#34D399] text-[#F2F7F4] ring-1 ring-[#34D399]/40"
                    : "bg-[#111C17] border-[#20332B] text-[#8EAAA0] hover:border-[#2B493B] hover:text-[#F2F7F4] hover:bg-[#14231D]"
                }`}
              >
                <span>{item.city}</span>
                <span className="opacity-70 ml-1.5 font-normal">({item.language})</span>
              </button>
            );
          })}
        </div>

        {/* 3D Hardware-Style Acoustic Console */}
        <div
          style={{ perspective: "1200px" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={stageRef}
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateY(${mouseTilt.x}deg) rotateX(${mouseTilt.y}deg)`,
              transition: "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 35px rgba(52,211,153,0.12)",
            }}
            className="rounded-2xl p-6 sm:p-8 border border-[#20332B] bg-[#111C17] relative overflow-hidden"
          >
            {/* Customer Voice Input Bubble */}
            <div
              style={{ transform: "translateZ(25px)" }}
              className="mb-6 p-5 sm:p-6 rounded-xl bg-[#0D1813] border border-[#1F3329] shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-body text-xs font-semibold text-[#8EAAA0]">
                  <Mic size={14} className="text-[#34D399]" />
                  <span>CUSTOMER AUDIO INGESTION</span>
                </div>
                <span className="font-code text-[11px] text-[#5E796F] px-2 py-0.5 rounded bg-[#070D0A] border border-[#14231D]">
                  16kHz Opus WebRTC
                </span>
              </div>
              <p className="font-display font-bold text-base sm:text-lg text-[#F2F7F4] italic leading-relaxed">
                &ldquo;{sample.userQuery}&rdquo;
              </p>
            </div>

            {/* GSAP Waveform Audio Equalizer Bar */}
            <div
              style={{ transform: "translateZ(35px)" }}
              className="bg-[#080E0B] p-5 sm:p-6 rounded-xl border border-[#1F3329] flex flex-col sm:flex-row items-center justify-between gap-6 mb-6 shadow-inner"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={togglePlayback}
                  className="w-12 h-12 rounded-full bg-[#34D399] text-[#090E0C] hover:bg-[#52e4b0] active:scale-90 flex items-center justify-center shadow-[0_0_24px_rgba(52,211,153,0.5)] transition-all flex-shrink-0 cursor-pointer"
                  aria-label={isPlaying ? "Pause voice note" : "Play voice note"}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </button>
                <div>
                  <div className="font-display font-bold text-sm text-[#F2F7F4] flex items-center gap-2">
                    <span>{isPlaying ? "Streaming Concierge Audio..." : "Simulate Agent Response"}</span>
                    {isPlaying && (
                      <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
                    )}
                  </div>
                  <div className="font-code text-[11px] text-[#8EAAA0] mt-0.5">
                    Latency: <span className="text-[#34D399] font-bold">{sample.latency}</span> · Model: Deepgram Nova-2 + Vapi
                  </div>
                </div>
              </div>

              {/* Visualizer Wave Bars */}
              <div
                ref={barsRef}
                className="flex items-center gap-1 sm:gap-1.5 h-14 px-5 py-2 bg-[#050807] rounded-xl border border-[#14231D] w-full sm:w-80 justify-center shadow-inner"
              >
                {Array.from({ length: 26 }).map((_, i) => (
                  <span
                    key={i}
                    className="wave-bar w-1.5 rounded-full bg-[#34D399] transition-colors"
                    style={{ height: "8px" }}
                  />
                ))}
              </div>
            </div>

            {/* Agent Spoken Response */}
            <div
              style={{ transform: "translateZ(25px)" }}
              className="p-5 sm:p-6 rounded-xl bg-[#0D1813] border border-[#1F3329]"
            >
              <div className="flex items-center gap-2 font-body text-xs font-semibold text-[#34D399] mb-3">
                <Volume2 size={14} className="text-[#34D399]" />
                <span>SYNTHESIZED CONCIERGE DISPATCH INTENT</span>
              </div>
              <p className="font-body text-sm sm:text-base text-[#F2F7F4] leading-relaxed mb-4">
                {sample.aiResponse}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-[#1F3329] text-xs font-body text-[#8EAAA0]">
                <div className="flex items-center gap-4">
                  <span>
                    Matched Artisan: <strong className="text-[#F2F7F4]">{sample.matchedArtisan}</strong>
                  </span>
                  <span>
                    Window: <strong className="text-[#34D399]">{sample.slotTime}</strong>
                  </span>
                </div>
                <span className="font-code text-[11px] px-2.5 py-0.5 rounded bg-[#132A1F] border border-[#214735] font-semibold text-[#34D399] shadow-sm">
                  Hallucination Guard: PASS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
