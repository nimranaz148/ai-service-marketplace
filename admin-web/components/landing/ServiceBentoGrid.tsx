"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  Wind,
  Zap,
  Wrench,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  Clock,
  Users,
  ShieldCheck,
  LucideIcon,
  CheckCircle2,
} from "lucide-react";

interface CategoryItem {
  icon: LucideIcon;
  title: string;
  tagline: string;
  desc: string;
  eta: string;
  activeCount: number;
  rate: string;
  badge: string;
  tools: string[];
  colSpan: string;
  accentGlow: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    icon: Wind,
    title: "Climate & HVAC Systems",
    tagline: "Inverter PCB Diagnostics & Precision Refrigeration",
    desc: "Certified master technicians equipped with digital manifold gauges, vacuum pumps, and genuine inverter board components. Rapid resolution for cooling failure, PCB error codes, and seasonal tune-ups.",
    eta: "20–35 min",
    activeCount: 18,
    rate: "From PKR 2,500",
    badge: "Highest Demand",
    tools: ["Digital Manifold", "Vacuum Pump", "PCB Soldering"],
    colSpan: "lg:col-span-8",
    accentGlow: "rgba(52, 211, 153, 0.2)",
  },
  {
    icon: Zap,
    title: "Solar & High-Voltage Electrical",
    tagline: "3-Phase Balancing & Hybrid Inverters",
    desc: "Licensed industrial and domestic electricians for solar net-metering installations, breaker panel safety audits, and emergency short-circuit recovery.",
    eta: "15–30 min",
    activeCount: 14,
    rate: "From PKR 2,000",
    badge: "Certified Safety",
    tools: ["3-Phase Megger", "Fluke Meter", "Solar Calibrator"],
    colSpan: "lg:col-span-4",
    accentGlow: "rgba(251, 191, 36, 0.18)",
  },
  {
    icon: Wrench,
    title: "Hydro & Sanitary Engineering",
    tagline: "Acoustic Leak Detection & Pressure Piping",
    desc: "Heavy-duty sanitary plumbers equipped with electronic acoustic detectors, PPR-C pipe fusion gear, and deep-well submersible motor diagnostics.",
    eta: "20–40 min",
    activeCount: 16,
    rate: "From PKR 1,800",
    badge: "Emergency Priority",
    tools: ["Acoustic Sensor", "PPR-C Fusion", "Drain Camera"],
    colSpan: "lg:col-span-4",
    accentGlow: "rgba(56, 189, 248, 0.18)",
  },
  {
    icon: GraduationCap,
    title: "Academic STEM Mentorship",
    tagline: "Cambridge O/A-Levels & Pre-Engineering",
    desc: "Verified senior tutors from NUST, LUMS, and GIKI specializing in Advanced Mathematics, Physics, Chemistry, and Computer Science.",
    eta: "Scheduled Slots",
    activeCount: 11,
    rate: "From PKR 5,000/mo",
    badge: "Top Verified",
    tools: ["O/A Levels", "ECAT / NET", "Calculus & CS"],
    colSpan: "lg:col-span-4",
    accentGlow: "rgba(167, 139, 250, 0.18)",
  },
  {
    icon: Sparkles,
    title: "Deep Sanitization & Detailing",
    tagline: "High-Temperature Steam Extraction",
    desc: "Commercial-grade deep extraction and sanitation for homes, post-construction finishes, and executive upholstery with zero residual chemicals.",
    eta: "30–45 min",
    activeCount: 12,
    rate: "From PKR 3,500",
    badge: "Hospital Grade",
    tools: ["160°C Steam", "HEPA Filter", "Eco Extraction"],
    colSpan: "lg:col-span-4",
    accentGlow: "rgba(52, 211, 153, 0.18)",
  },
];

function Interactive3DBentoCard({ cat }: { cat: CategoryItem }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const Icon = cat.icon;

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

      xTo(xRel * 12);
      yTo(-yRel * 12);
      zTo(24);

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

  return (
    <div
      style={{ perspective: "1200px" }}
      className={`${cat.colSpan} group`}
    >
      <div
        ref={cardRef}
        style={{
          transformStyle: "preserve-3d",
          boxShadow: isHovered
            ? `0 24px 60px -15px rgba(0,0,0,0.85), 0 0 35px ${cat.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.12)`
            : "0 10px 30px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
        className="rounded-2xl p-6 sm:p-7 flex flex-col justify-between bg-[#111C17] border border-[#20332B] hover:border-[#34D399]/60 transition-colors duration-300 relative overflow-hidden select-none cursor-pointer h-full active:scale-[0.98]"
      >
        {/* Specular Glare Follower */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(52,211,153,0.14) 0%, transparent 60%)`,
          }}
        />

        {/* Ambient Corner Glow */}
        <div
          className="absolute -right-12 -top-12 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-all duration-500"
          style={{
            background: cat.accentGlow,
            opacity: isHovered ? 0.9 : 0.2,
          }}
        />

        {/* Top 3D Section */}
        <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
          <div className="flex items-center justify-between gap-3 mb-5">
            <div
              style={{ transform: "translateZ(20px)" }}
              className="w-12 h-12 rounded-xl bg-[#162D23] border border-[#2B493B] flex items-center justify-center text-[#34D399] group-hover:scale-110 group-hover:bg-[#1E3B2E] group-hover:border-[#34D399]/60 transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
            >
              <Icon size={22} />
            </div>

            <span
              style={{ transform: "translateZ(15px)" }}
              className="px-3 py-1 rounded-full bg-[#132A1F] border border-[#214735] text-[#34D399] font-code text-[11px] font-semibold shadow-sm group-hover:border-[#34D399]/50 transition-colors"
            >
              {cat.badge}
            </span>
          </div>

          <h3
            style={{ transform: "translateZ(35px)" }}
            className="font-display font-extrabold text-xl sm:text-2xl text-[#F2F7F4] mb-1.5 group-hover:text-[#34D399] transition-colors"
          >
            {cat.title}
          </h3>

          <p
            style={{ transform: "translateZ(20px)" }}
            className="font-body text-xs font-semibold text-[#34D399] mb-3 flex items-center gap-1.5"
          >
            <span>{cat.tagline}</span>
          </p>

          <p
            style={{ transform: "translateZ(15px)" }}
            className="font-body text-sm text-[#A3B8AF] leading-relaxed mb-5 group-hover:text-[#D1E0D9] transition-colors"
          >
            {cat.desc}
          </p>

          {/* Micro Tool Capabilities */}
          <div
            style={{ transform: "translateZ(20px)" }}
            className="flex flex-wrap gap-1.5 mb-6"
          >
            {cat.tools.map((tool, tIdx) => (
              <span
                key={tIdx}
                className="px-2.5 py-1 rounded-lg bg-[#0B1310] border border-[#1C2C24] text-[#8EAAA0] text-[11px] font-code group-hover:text-[#E2ECE7] group-hover:border-[#284437] transition-colors"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom 3D Action Strip */}
        <div
          style={{ transform: "translateZ(25px)" }}
          className="pt-4 border-t border-[#1F3329] flex items-center justify-between mt-auto"
        >
          <div className="flex items-center gap-4 text-xs font-body text-[#8EAAA0]">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock size={13} className="text-[#34D399]" />
              <span>{cat.eta}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34D399]"></span>
              </span>
              <span className="text-[#F2F7F4] font-medium">{cat.activeCount} Live</span>
            </span>
          </div>

          <Link href="/services">
            <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#162D23] hover:bg-[#1E3B2E] border border-[#2B493B] text-xs font-bold font-body text-[#34D399] hover:text-[#F2F7F4] hover:border-[#34D399] transition-all shadow-sm active:scale-95">
              <span>Reserve</span>
              <ArrowUpRight size={14} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ServiceBentoGrid() {
  return (
    <section id="services" className="py-24 px-4 sm:px-8 bg-[#090E0C] border-b border-[#1F3329] relative overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#34D399]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111C17] border border-[#20332B] text-[#34D399] text-xs font-semibold font-body tracking-tight mb-3 shadow-sm">
              <ShieldCheck size={13} className="text-[#34D399]" />
              <span>Full-Stack Local Trade Coverage</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F2F7F4] tracking-tight">
              Curated service categories by certified trade.
            </h2>
          </div>
          <p className="font-body text-sm text-[#A3B8AF] max-w-md leading-relaxed">
            Every category has strict standardized rate floors, verified skill rubrics, and direct
            in-app dispatch with tamper-evident booking codes.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {CATEGORIES.map((cat, idx) => (
            <Interactive3DBentoCard key={idx} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
