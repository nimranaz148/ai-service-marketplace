"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ShieldCheck, Clock, Award, MapPin, LucideIcon, Sparkles } from "lucide-react";

interface PillarData {
  icon: LucideIcon;
  prefix?: string;
  targetNum: number;
  suffix: string;
  decimals: number;
  title: string;
  description: string;
  detailChip: string;
  subMetric: string;
  accentGlow: string;
}

const TRUST_PILLARS: PillarData[] = [
  {
    icon: Clock,
    prefix: "< ",
    targetNum: 1.2,
    suffix: "s",
    decimals: 1,
    title: "Median Dispatch Speed",
    description: "End-to-end Vapi WebRTC intent extraction to Supabase reservation.",
    detailChip: "Sub-Second Latency",
    subMetric: "p95 benchmark: 890ms",
    accentGlow: "rgba(52, 211, 153, 0.2)",
  },
  {
    icon: ShieldCheck,
    prefix: "",
    targetNum: 100,
    suffix: "%",
    decimals: 0,
    title: "NADRA Background Vetted",
    description: "Every master artisan verified via biometric national registry.",
    detailChip: "Biometric Verified",
    subMetric: "Zero unverified dispatch",
    accentGlow: "rgba(16, 185, 129, 0.2)",
  },
  {
    icon: Award,
    prefix: "",
    targetNum: 4.95,
    suffix: "★",
    decimals: 2,
    title: "Customer Satisfaction",
    description: "Rigorous quality gate with post-service escrow verification.",
    detailChip: "5,000+ Reviews",
    subMetric: "4.95/5.00 aggregate",
    accentGlow: "rgba(251, 191, 36, 0.18)",
  },
  {
    icon: MapPin,
    prefix: "",
    targetNum: 3,
    suffix: " Metros",
    decimals: 0,
    title: "Hyper-Local Coverage",
    description: "Active high-density clusters across Islamabad, Karachi & Lahore.",
    detailChip: "Active Clusters",
    subMetric: "18+ operational sectors",
    accentGlow: "rgba(56, 189, 248, 0.18)",
  },
];

function Animated3DPillarCard({
  pillar,
  index,
}: {
  pillar: PillarData;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState(pillar.targetNum);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Counter animation on mount
  useEffect(() => {
    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: pillar.targetNum,
      duration: 1.6,
      delay: index * 0.12,
      ease: "power2.out",
      onUpdate: () => {
        setDisplayValue(obj.val);
      },
    });

    return () => {
      tween.kill();
    };
  }, [pillar.targetNum, index]);

  // GSAP 3D Hardware-Accelerated Perspective Tilt & Cursor Glare
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

      xTo(xRel * 14); // 14 deg tilt
      yTo(-yRel * 14);
      zTo(20);

      setMousePos({
        x: Math.round(((e.clientX - rect.left) / rect.width) * 100),
        y: Math.round(((e.clientY - rect.top) / rect.height) * 100),
      });
    };

    const onMouseEnter = () => {
      setIsHovered(true);
    };

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

  const Icon = pillar.icon;
  const formattedNumber =
    pillar.decimals > 0
      ? displayValue.toFixed(pillar.decimals)
      : Math.round(displayValue).toString();

  return (
    <div
      style={{ perspective: "1000px" }}
      className="group relative"
    >
      <div
        ref={cardRef}
        style={{
          transformStyle: "preserve-3d",
          boxShadow: isHovered
            ? `0 24px 60px -15px rgba(0,0,0,0.85), 0 0 35px ${pillar.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.12)`
            : "0 10px 30px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
        className="p-6 rounded-2xl bg-[#111C17] border border-[#20332B] hover:border-[#34D399]/60 flex flex-col justify-between transition-colors duration-300 relative overflow-hidden select-none cursor-pointer h-full active:scale-[0.98]"
      >
        {/* Dynamic Specular Glare Layer that follows mouse cursor */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(52,211,153,0.15) 0%, transparent 65%)`,
          }}
        />

        {/* Ambient Corner Blur */}
        <div
          className="absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-all duration-500"
          style={{
            background: pillar.accentGlow,
            opacity: isHovered ? 0.8 : 0.2,
          }}
        />

        {/* Card Content with 3D Spatial Layering */}
        <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
          {/* Top Bar: 3D Floating Icon + Chip */}
          <div className="flex items-center justify-between mb-5">
            <div
              style={{ transform: "translateZ(20px)" }}
              className="w-12 h-12 rounded-xl bg-[#162D23] border border-[#2B493B] flex items-center justify-center text-[#34D399] group-hover:scale-110 group-hover:bg-[#1E3B2E] group-hover:border-[#34D399]/60 transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
            >
              <Icon size={22} />
            </div>

            <span
              style={{ transform: "translateZ(15px)" }}
              className="font-code text-[10px] px-2.5 py-1 rounded-full bg-[#0B1310] border border-[#1F3329] text-[#8EAAA0] group-hover:text-[#F2F7F4] group-hover:border-[#34D399]/40 group-hover:bg-[#132A1F] transition-all"
            >
              {pillar.detailChip}
            </span>
          </div>

          {/* Animated Big Metric Number */}
          <div
            style={{ transform: "translateZ(40px)" }}
            className="mb-2"
          >
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#F2F7F4] tracking-tight group-hover:text-[#34D399] transition-colors duration-200 block drop-shadow-md">
              {pillar.prefix}
              {formattedNumber}
              {pillar.suffix}
            </span>
          </div>

          {/* Title & Description */}
          <h4
            style={{ transform: "translateZ(25px)" }}
            className="font-display font-bold text-sm text-[#F2F7F4] mb-1.5 flex items-center gap-1.5"
          >
            <span>{pillar.title}</span>
          </h4>
          <p
            style={{ transform: "translateZ(15px)" }}
            className="font-body text-xs text-[#A3B8AF] leading-relaxed group-hover:text-[#D1E0D9] transition-colors"
          >
            {pillar.description}
          </p>
        </div>

        {/* Bottom Micro Indicator with Live Heartbeat */}
        <div
          style={{ transform: "translateZ(20px)" }}
          className="pt-4 mt-5 border-t border-[#1F3329] flex items-center justify-between text-[11px] font-code text-[#6B877B]"
        >
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34D399]"></span>
            </span>
            <span className="text-[#8EAAA0] text-[10px]">{pillar.subMetric}</span>
          </span>
          <span className="group-hover:translate-x-1.5 transition-transform duration-200 text-[#34D399] font-bold text-xs">
            →
          </span>
        </div>
      </div>
    </div>
  );
}

export function ProofStrip() {
  return (
    <section className="bg-[#090E0C] py-16 px-4 sm:px-8 border-y border-[#1F3329] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#34D399]/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#10B981]/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {TRUST_PILLARS.map((pillar, idx) => (
            <Animated3DPillarCard key={idx} pillar={pillar} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
