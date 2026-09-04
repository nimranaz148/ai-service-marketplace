"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowUpRight, Sparkles, Shield, MapPin, Layers, CheckCircle2 } from "lucide-react";

export function LandingFooter() {
  const footerCardRef = useRef<HTMLDivElement>(null);
  const footerCtaRef = useRef<HTMLButtonElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // GSAP 3D perspective tilt on grand finale card
  useEffect(() => {
    const el = footerCardRef.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "rotationY", { duration: 0.35, ease: "power2.out" });
    const yTo = gsap.quickTo(el, "rotationX", { duration: 0.35, ease: "power2.out" });
    const zTo = gsap.quickTo(el, "z", { duration: 0.35, ease: "power2.out" });

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const xRel = (e.clientX - rect.left) / rect.width - 0.5;
      const yRel = (e.clientY - rect.top) / rect.height - 0.5;

      xTo(xRel * 10);
      yTo(-yRel * 10);
      zTo(20);

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

  // GSAP magnetic hover on footer button
  useEffect(() => {
    const el = footerCtaRef.current;
    if (!el) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      gsap.to(el, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: "power2.out" });
    };

    const onMouseLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);
    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <footer className="bg-[#070C0A] text-[#F2F7F4] pt-20 pb-12 px-4 sm:px-8 border-t border-[#1F3329]">
      <div className="max-w-6xl mx-auto">
        {/* 3D Holographic Banner Card */}
        <div
          style={{ perspective: "1200px" }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div
            ref={footerCardRef}
            style={{
              transformStyle: "preserve-3d",
              boxShadow: isHovered
                ? "0 30px 80px -20px rgba(0,0,0,0.9), 0 0 45px rgba(52,211,153,0.22), inset 0 1px 0 rgba(255,255,255,0.15)"
                : "0 20px 50px -15px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
            className="bg-[#111C17] border border-[#20332B] hover:border-[#34D399]/60 rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden transition-colors duration-300 select-none"
          >
            {/* Dynamic Specular Cursor Glare */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                opacity: isHovered ? 1 : 0,
                background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(52,211,153,0.16) 0%, transparent 60%)`,
              }}
            />

            {/* Ambient Background Aura */}
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-[#34D399]/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-[#10B981]/10 blur-3xl pointer-events-none" />

            <div
              style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
              className="relative z-10"
            >
              <div
                style={{ transform: "translateZ(15px)" }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#162D23] border border-[#2B493B] text-[#34D399] text-xs font-semibold font-body tracking-tight mb-5 shadow-sm"
              >
                <Sparkles size={13} className="text-[#34D399]" />
                <span>Experience Autonomous Dispatch</span>
              </div>

              <h2
                style={{ transform: "translateZ(35px)" }}
                className="font-display font-extrabold text-3xl sm:text-5xl text-[#F2F7F4] tracking-tight mb-4 max-w-xl mx-auto leading-tight drop-shadow-md"
              >
                Ready to experience concierge precision?
              </h2>

              <p
                style={{ transform: "translateZ(20px)" }}
                className="font-body text-sm sm:text-base text-[#A3B8AF] max-w-lg mx-auto mb-8 leading-relaxed"
              >
                No account creation needed. Voice dispatch works immediately in Roman Urdu, Urdu, and
                English with sub-second latency.
              </p>

              <div style={{ transform: "translateZ(40px)" }}>
                <Link href="/services">
                  <button
                    ref={footerCtaRef}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#34D399] hover:bg-[#52e4b0] text-[#090E0C] font-display font-bold text-base shadow-[0_0_35px_rgba(52,211,153,0.45)] active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Launch Service Concierge</span>
                    <ArrowUpRight size={18} />
                  </button>
                </Link>
              </div>

              {/* Security & Verification Guarantee Row */}
              <div
                style={{ transform: "translateZ(15px)" }}
                className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-[#1F3329] text-xs font-body text-[#8EAAA0]"
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#34D399]" />
                  <span>100% NADRA Verified Artisans</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#34D399]" />
                  <span>Post-Service Escrow Protection</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#34D399]" />
                  <span>Zero Call-Center Wait Times</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Links & Brand Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#1F3329] text-sm">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#162D23] border border-[#2B493B] text-[#34D399] flex items-center justify-center font-display font-bold text-base shadow-sm">
                A
              </div>
              <span className="font-display font-extrabold text-lg tracking-tight text-[#F2F7F4]">
                ATELIER AI
              </span>
            </div>
            <p className="font-body text-xs text-[#8EAAA0] max-w-sm leading-relaxed mb-4">
              Autonomous local services marketplace orchestrating background-checked artisans across
              Pakistan using OpenAI Agents SDK, FastAPI, Supabase, and Vapi WebRTC.
            </p>
            <div className="flex items-center gap-2 font-code text-xs text-[#34D399]">
              <MapPin size={13} />
              <span>Islamabad · Karachi · Lahore</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#F2F7F4] mb-3">
              Architecture
            </h4>
            <ul className="space-y-2 font-body text-xs text-[#8EAAA0]">
              <li>
                <a href="#symphony" className="hover:text-[#34D399] transition-colors">
                  5-Agent Pipeline
                </a>
              </li>
              <li>
                <a href="#roster" className="hover:text-[#34D399] transition-colors">
                  Verified Artisans
                </a>
              </li>
              <li>
                <a href="#voice-engine" className="hover:text-[#34D399] transition-colors">
                  Vapi Acoustic Engine
                </a>
              </li>
              <li>
                <a href="#audit-ledger" className="hover:text-[#34D399] transition-colors">
                  Audit Trace Ledger
                </a>
              </li>
            </ul>
          </div>

          {/* Operations & Tech */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#F2F7F4] mb-3">
              System Infrastructure
            </h4>
            <ul className="space-y-2 font-body text-xs text-[#8EAAA0]">
              <li>Supabase PostgreSQL 15</li>
              <li>FastAPI Async Engine</li>
              <li>Vapi WebRTC 16kHz Stream</li>
              <li>GSAP Kinetic Physics</li>
              <li>Redis & Celery Workers</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-body text-xs text-[#5E796F]">
          <p>© 2026 Atelier AI Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/services" className="hover:text-[#34D399] transition-colors">
              Concierge Console
            </Link>
            <a href="#audit-ledger" className="hover:text-[#34D399] transition-colors">
              Diagnostic Logs
            </a>
            <span className="font-code text-[11px] text-[#34D399] bg-[#132A1F] border border-[#214735] px-2 py-0.5 rounded-full">
              Production Ready v2.4
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
