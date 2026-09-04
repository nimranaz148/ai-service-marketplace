"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { Cpu, Terminal, CheckCircle2, Clock, Layers, Sparkles, ArrowRight, ShieldAlert } from "lucide-react";

const AGENTS = [
  {
    step: "01",
    name: "Intent Agent",
    role: "Linguistic & Urgency Parser",
    fn: "extract_service_intent()",
    latency: "340ms",
    status: "STANDBY READY",
    desc: "Extracts service category, colloquial location terms (e.g. 'G-13', 'Gulshan'), and urgency level from unstructured Roman Urdu, Urdu, or English voice input.",
    code: `{\n  "raw_voice_transcript": "Bhai kal subah G-13 mein AC service chahiye",\n  "detected_language": "roman_urdu",\n  "extracted_intent": {\n    "category": "AC Technician",\n    "target_sector": "Sector G-13, Islamabad",\n    "urgency": "scheduled",\n    "confidence_score": 0.992\n  }\n}`,
  },
  {
    step: "02",
    name: "Discovery Agent",
    role: "Geospatial Radius Scanner",
    fn: "query_supabase_radius()",
    latency: "184ms",
    status: "STANDBY READY",
    desc: "Executes real-time geospatial radius queries against active Supabase PostgreSQL provider slots within a 5.0 km perimeter of the customer.",
    code: `{\n  "query_params": {\n    "service_code": "HVAC_INVERTER",\n    "origin_coordinates": [33.648, 72.975],\n    "search_radius_km": 5.0\n  },\n  "providers_identified": 4,\n  "available_slots_count": 12,\n  "top_candidate_id": "prov_tariq_mehmood_isb"\n}`,
  },
  {
    step: "03",
    name: "Ranking Agent",
    role: "Tri-Factor Scoring Engine",
    fn: "evaluate_tri_factor_score()",
    latency: "220ms",
    status: "STANDBY READY",
    desc: "Computes a weighted composite score balancing artisan verified customer rating (40%), proximity in kilometers (35%), and slot immediacy (25%).",
    code: `{\n  "weighting_matrix": {\n    "rating_weight": 0.40,\n    "proximity_weight": 0.35,\n    "availability_weight": 0.25\n  },\n  "ranking_output": {\n    "selected_artisan": "Tariq Mehmood",\n    "composite_match": 0.984,\n    "distance_km": 1.4,\n    "rating": 4.96\n  }\n}`,
  },
  {
    step: "04",
    name: "Booking Agent",
    role: "Atomic State Committer",
    fn: "commit_atomic_booking()",
    latency: "153ms",
    status: "STANDBY READY",
    desc: "Locks the provider's calendar slot in an atomic PostgreSQL transaction and generates a tamper-evident reservation code sent to both customer and artisan.",
    code: `{\n  "transaction_id": "tx_booking_984021",\n  "slot_status": "LOCKED",\n  "confirmation_code": "ISB-G13-9840",\n  "escrow_verified": true,\n  "customer_notification": "DISPATCHED_SMS"\n}`,
  },
  {
    step: "05",
    name: "Follow-up Agent",
    role: "Asynchronous Lifecycle Tracker",
    fn: "schedule_celery_followups()",
    latency: "92ms",
    status: "STANDBY READY",
    desc: "Enqueues Celery background tasks on Redis to track artisan journey, send arrival reminders, and conduct post-service quality verification.",
    code: `{\n  "celery_task_id": "task_followup_reminder_840",\n  "scheduled_execution": "Tomorrow 09:30 AM",\n  "reminder_offset_minutes": 60,\n  "survey_trigger_on_completion": true\n}`,
  },
];

export function AgentSymphony() {
  const [activeIdx, setActiveIdx] = useState(0);
  const consoleRef = useRef<HTMLDivElement>(null);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  // GSAP 3D spring transition when switching agent tabs
  useEffect(() => {
    if (!consoleRef.current) return;
    gsap.fromTo(
      consoleRef.current,
      { opacity: 0, y: 12, scale: 0.99 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power2.out" }
    );
  }, [activeIdx]);

  // Console 3D mouse parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!consoleRef.current) return;
    const rect = consoleRef.current.getBoundingClientRect();
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

  const activeAgent = AGENTS[activeIdx];

  return (
    <section id="symphony" className="py-24 px-4 sm:px-8 bg-[#090E0C] border-y border-[#1F3329] relative overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#34D399]/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111C17] border border-[#20332B] text-[#34D399] text-xs font-semibold font-body tracking-tight mb-3 shadow-sm">
            <Layers size={13} className="text-[#34D399]" />
            <span>5-Agent Autonomous Symphony</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F2F7F4] tracking-tight mb-3">
            Zero human call centers. Five synchronized specialists.
          </h2>
          <p className="font-body text-sm text-[#A3B8AF] leading-relaxed">
            Unlike chaotic monolithic chatbots, our platform decomposes local service dispatch into
            five deterministic sub-agents running tool calls with sub-second latency.
          </p>
        </div>

        {/* 3D Interactive Agent Navigation Tabs */}
        <div
          style={{ perspective: "1000px" }}
          className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8"
        >
          {AGENTS.map((agent, idx) => {
            const isSelected = activeIdx === idx;
            return (
              <button
                key={agent.step}
                onClick={() => setActiveIdx(idx)}
                style={{
                  transformStyle: "preserve-3d",
                  transform: isSelected ? "translateZ(12px)" : "translateZ(0px)",
                  boxShadow: isSelected
                    ? "0 12px 32px rgba(0,0,0,0.6), 0 0 20px rgba(52,211,153,0.2)"
                    : "none",
                }}
                className={`p-4 rounded-xl border text-left transition-all duration-300 active:scale-95 cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? "bg-[#162D23] border-[#34D399] text-[#F2F7F4] ring-1 ring-[#34D399]/40"
                    : "bg-[#111C17] border-[#20332B] text-[#8EAAA0] hover:border-[#2F4C3F] hover:text-[#F2F7F4] hover:bg-[#14231D]"
                }`}
              >
                {/* Active Indicator Top Bar */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-code text-[11px] font-bold flex items-center gap-1.5 ${
                      isSelected ? "text-[#34D399]" : "text-[#5E796F]"
                    }`}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-ping" />
                    )}
                    STEP {agent.step}
                  </span>
                  <span
                    className={`font-code text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                      isSelected
                        ? "bg-[#132A1F] text-[#34D399] border border-[#214735]"
                        : "bg-[#0B1310] text-[#6B877B] border border-[#1F3329]"
                    }`}
                  >
                    {agent.latency}
                  </span>
                </div>

                <div className="font-display font-bold text-sm truncate text-[#F2F7F4]">
                  {agent.name}
                </div>
                <div
                  className={`font-body text-[11px] truncate mt-0.5 transition-colors ${
                    isSelected ? "text-[#D1E0D9]" : "text-[#6B877B]"
                  }`}
                >
                  {agent.role}
                </div>
              </button>
            );
          })}
        </div>

        {/* 3D Hardware Telemetry Console Panel */}
        <div
          style={{ perspective: "1200px" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={consoleRef}
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateY(${mouseTilt.x}deg) rotateX(${mouseTilt.y}deg)`,
              transition: "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 30px rgba(52,211,153,0.1)",
            }}
            className="rounded-2xl overflow-hidden border border-[#20332B] bg-[#111C17] relative"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left: Role & Function Overview */}
              <div
                style={{ transform: "translateZ(20px)" }}
                className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1F3329] bg-[#0D1813]"
              >
                <div>
                  <div className="flex items-center gap-2 font-code text-xs text-[#34D399] font-semibold mb-2">
                    <Cpu size={14} className="animate-pulse" />
                    <span>{activeAgent.fn}</span>
                  </div>

                  <h3 className="font-display font-extrabold text-2xl text-[#F2F7F4] mb-2">
                    {activeAgent.name}
                  </h3>

                  <p className="font-body text-xs font-semibold uppercase tracking-wider text-[#34D399] mb-4">
                    {activeAgent.role}
                  </p>

                  <p className="font-body text-sm text-[#A3B8AF] leading-relaxed mb-6">
                    {activeAgent.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1F3329] space-y-2.5 text-xs font-body text-[#8EAAA0]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#34D399]" />
                    <span>Deterministic Pydantic output validation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#34D399]" />
                    <span>Execution guarantee: &lt; 500ms p95 latency</span>
                  </div>
                </div>
              </div>

              {/* Right: Actual Tool I/O Payload */}
              <div
                style={{ transform: "translateZ(25px)" }}
                className="lg:col-span-7 bg-[#080E0B] p-6 sm:p-8 text-[#E2ECE7] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1F3329]">
                    <div className="flex items-center gap-2 font-code text-xs text-[#8EAAA0]">
                      <Terminal size={14} className="text-[#34D399]" />
                      <span>tool_call_payload.json</span>
                    </div>
                    <span className="font-code text-[11px] px-2.5 py-0.5 rounded bg-[#162D23] border border-[#2B493B] text-[#34D399] font-semibold shadow-sm">
                      Schema Validated
                    </span>
                  </div>

                  <pre className="font-code text-xs leading-relaxed text-[#34D399] overflow-x-auto whitespace-pre p-4 bg-[#050807] rounded-xl border border-[#14231D] shadow-inner">
                    <code>{activeAgent.code}</code>
                  </pre>
                </div>

                <div className="mt-4 pt-3 border-t border-[#14231D] flex items-center justify-between text-[11px] font-code text-[#6B877B]">
                  <span>Status: 200 OK • Verified In-Memory</span>
                  <span className="text-[#34D399] font-medium">Supabase RLS Enforced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
