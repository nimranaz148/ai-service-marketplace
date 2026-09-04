"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Activity, ShieldCheck, ArrowRight, CheckCircle2, Clock, Terminal, Hash } from "lucide-react";

const AUDIT_EVENTS = [
  {
    step: "01",
    agent: "IntentAgent",
    tool: "extract_intent",
    latency: "342ms",
    status: "PASS",
    summary:
      "Language classifier validated Roman Urdu with 0.992 confidence. Entity extractor resolved \x27G-13\x27 to Islamabad Sector G-13 coordinates [33.648, 72.975].",
    input: `{ "transcript": "Kal subah G-13 mein AC technician chahiye", "lang": "roman_urdu" }`,
    output: `{ "service": "AC Technician", "sector": "G-13, Islamabad", "urgency": "scheduled" }`,
  },
  {
    step: "02",
    agent: "DiscoveryAgent",
    tool: "find_providers",
    latency: "184ms",
    status: "PASS",
    summary:
      "Spatial radius query executed on Supabase PostgreSQL. 4 active HVAC artisans discovered within 5.0km. 12 available slots verified.",
    input: `{ "service_code": "HVAC", "lat": 33.648, "lng": 72.975, "radius_km": 5.0 }`,
    output: `{ "found_providers": 4, "top_candidate": "prov_tariq_mehmood_isb" }`,
  },
  {
    step: "03",
    agent: "RankingAgent",
    tool: "rank_providers",
    latency: "221ms",
    status: "PASS",
    summary:
      "Weighted scoring matrix evaluated: (0.40 * 4.96 rating) + (0.35 * 1.4km proximity) + (0.25 * immediate availability). Tariq Mehmood scored 0.984 composite.",
    input: `{ "rating_w": 0.40, "prox_w": 0.35, "avail_w": 0.25 }`,
    output: `{ "winner": "Tariq Mehmood", "composite_score": 0.984, "distance_km": 1.4 }`,
  },
  {
    step: "04",
    agent: "BookingAgent",
    tool: "create_booking",
    latency: "153ms",
    status: "PASS",
    summary:
      "Atomic slot lock in Supabase. Issued tamper-evident reservation code ISB-G13-9840. Escrow contract validated.",
    input: `{ "provider_id": "prov_tariq_mehmood", "slot": "Tomorrow 10:30 AM" }`,
    output: `{ "booking_code": "ISB-G13-9840", "slot_locked": true, "status": "CONFIRMED" }`,
  },
  {
    step: "05",
    agent: "FollowupAgent",
    tool: "schedule_followups",
    latency: "89ms",
    status: "PASS",
    summary:
      "Celery background task dispatched via Redis broker. Customer WhatsApp and SMS notifications enqueued with 60-minute pre-arrival reminder.",
    input: `{ "booking_code": "ISB-G13-9840", "reminder_offset_min": 60 }`,
    output: `{ "task_id": "task_remind_840", "broker": "redis_high_priority" }`,
  },
];

export function AuditObservability() {
  const [selectedStep, setSelectedStep] = useState(0);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
  const terminalRef = useRef<HTMLDivElement>(null);

  const activeEvent = AUDIT_EVENTS[selectedStep];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!terminalRef.current) return;
    const rect = terminalRef.current.getBoundingClientRect();
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
    <section id="audit-ledger" className="py-24 px-4 sm:px-8 bg-[#090E0C] border-b border-[#1F3329] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/3 w-[700px] h-[450px] bg-[#34D399]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111C17] border border-[#20332B] text-[#34D399] text-xs font-semibold font-body tracking-tight mb-3 shadow-sm">
              <Activity size={13} className="text-[#34D399]" />
              <span>Full Audit Traceability</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F2F7F4] tracking-tight">
              Zero black-box decisions. Inspect every agent tool call.
            </h2>
          </div>
          <p className="font-body text-sm text-[#A3B8AF] max-w-md leading-relaxed">
            Every customer voice interaction generates an immutable diagnostic trace. Inspect tool
            arguments, latencies, and verification gates in real time.
          </p>
        </div>

        {/* 3D Audit Terminal Shell */}
        <div
          style={{ perspective: "1200px" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={terminalRef}
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateY(${mouseTilt.x}deg) rotateX(${mouseTilt.y}deg)`,
              transition: "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 35px rgba(52,211,153,0.12)",
            }}
            className="rounded-2xl overflow-hidden border border-[#20332B] bg-[#111C17] relative"
          >
            {/* Top Bar with Terminal Nodes */}
            <div
              style={{ transform: "translateZ(15px)" }}
              className="bg-[#0D1813] px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#1F3329]"
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E57373]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFB74D]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]" />
                </div>
                <span className="font-code text-xs text-[#6B877B] ml-2 flex items-center gap-1">
                  <Terminal size={12} className="text-[#34D399]" />
                  <span>supabase://diagnostics/trace_session_82f1b4</span>
                </span>
              </div>

              <div className="flex items-center gap-3 font-code text-xs text-[#E2ECE7]">
                <span className="text-[#8EAAA0]">Cumulative Latency:</span>
                <span className="font-bold text-[#34D399]">989ms</span>
                <span className="px-2.5 py-0.5 rounded bg-[#132A1F] border border-[#214735] text-[#34D399] font-semibold text-[11px] shadow-sm">
                  ALL 5 PASS
                </span>
              </div>
            </div>

            {/* Body: Left Steps Timeline + Right Execution View */}
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Steps Timeline with 3D button depths */}
              <div
                style={{ transform: "translateZ(20px)" }}
                className="lg:col-span-4 p-4 sm:p-5 bg-[#0D1813] border-b lg:border-b-0 lg:border-r border-[#1F3329] space-y-2.5"
              >
                <p className="font-body text-[11px] uppercase font-semibold text-[#6B877B] px-2 mb-2 tracking-wider flex items-center justify-between">
                  <span>Execution Timeline</span>
                  <span className="text-[10px] text-[#34D399] font-code">5/5 Ready</span>
                </p>

                {AUDIT_EVENTS.map((item, idx) => {
                  const isSelected = selectedStep === idx;
                  return (
                    <button
                      key={item.step}
                      onClick={() => setSelectedStep(idx)}
                      style={{
                        transform: isSelected ? "translateZ(8px)" : "translateZ(0px)",
                        boxShadow: isSelected
                          ? "0 8px 24px rgba(0,0,0,0.5), 0 0 16px rgba(52,211,153,0.2)"
                          : "none",
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 active:scale-95 cursor-pointer ${
                        isSelected
                          ? "bg-[#162D23] border-[#34D399] text-[#F2F7F4] ring-1 ring-[#34D399]/40"
                          : "bg-[#111C17] border-[#20332B] text-[#8EAAA0] hover:border-[#2F4C3F] hover:text-[#F2F7F4] hover:bg-[#14231D]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`font-code text-xs font-bold flex items-center gap-1.5 ${
                            isSelected ? "text-[#34D399]" : "text-[#F2F7F4]"
                          }`}
                        >
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-ping" />
                          )}
                          Step {item.step}
                        </span>
                        <span
                          className={`font-code text-[10px] px-1.5 py-0.5 rounded ${
                            isSelected
                              ? "bg-[#132A1F] text-[#34D399] border border-[#214735]"
                              : "bg-[#0B1310] text-[#6B877B] border border-[#1F3329]"
                          }`}
                        >
                          {item.latency}
                        </span>
                      </div>

                      <div className="font-display font-bold text-sm truncate text-[#F2F7F4]">
                        {item.agent}
                      </div>

                      <div
                        className={`font-code text-[11px] truncate mt-0.5 ${
                          isSelected ? "text-[#34D399]" : "text-[#6B877B]"
                        }`}
                      >
                        @{item.tool}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Step Detail & Output */}
              <div
                style={{ transform: "translateZ(25px)" }}
                className="lg:col-span-8 p-6 sm:p-8 bg-[#111C17] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#1F3329] mb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-code text-xs font-semibold text-[#34D399]">
                          @{activeEvent.tool}
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-[#132A1F] border border-[#214735] text-[#34D399] text-[10px] font-code font-bold flex items-center gap-1">
                          <CheckCircle2 size={11} />
                          STATUS: {activeEvent.status}
                        </span>
                      </div>
                      <h3 className="font-display font-extrabold text-xl text-[#F2F7F4]">
                        {activeEvent.agent} Execution Log
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="font-code text-[10px] uppercase text-[#6B877B] block">
                        Execution Time
                      </span>
                      <span className="font-display font-bold text-base text-[#34D399]">
                        {activeEvent.latency}
                      </span>
                    </div>
                  </div>

                  <p className="font-body text-sm text-[#A3B8AF] leading-relaxed mb-6">
                    {activeEvent.summary}
                  </p>

                  {/* Tool Input / Output Code Boxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <span className="font-code text-[11px] font-semibold text-[#8EAAA0] block mb-1.5">
                        // TOOL CALL INPUT
                      </span>
                      <pre className="font-code text-xs text-[#D1E0D9] p-3.5 rounded-xl bg-[#050807] border border-[#14231D] overflow-x-auto whitespace-pre shadow-inner">
                        {activeEvent.input}
                      </pre>
                    </div>
                    <div>
                      <span className="font-code text-[11px] font-semibold text-[#34D399] block mb-1.5">
                        // VALIDATED OUTPUT
                      </span>
                      <pre className="font-code text-xs text-[#34D399] p-3.5 rounded-xl bg-[#050807] border border-[#14231D] overflow-x-auto whitespace-pre shadow-inner">
                        {activeEvent.output}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1F3329] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-body text-[#8EAAA0]">
                    <ShieldCheck size={14} className="text-[#34D399]" />
                    <span className="font-code text-[11px]">Cryptographic hash: 0x82f...1b4 locked</span>
                  </div>

                  <Link href="/services">
                    <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#162D23] hover:bg-[#1E3B2E] border border-[#2B493B] text-xs font-bold font-body text-[#34D399] hover:text-[#F2F7F4] hover:border-[#34D399] transition-all shadow-sm active:scale-95">
                      <span>Open Operations Board</span>
                      <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
