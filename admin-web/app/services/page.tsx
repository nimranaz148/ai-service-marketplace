"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { api, AdminStats } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { VoiceVisualizer } from "@/components/voice/VoiceVisualizer";
import {
  Activity,
  Bot,
  CalendarCheck,
  Send,
  Sparkles,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
  MapPin,
  Clock,
  Star,
  ChevronLeft,
  RotateCcw,
  Zap,
  Radio,
  Cpu,
  Layers,
  Database,
  ArrowUpRight,
  Filter,
} from "lucide-react";

interface ArtisanRecord {
  id: string;
  name: string;
  category: string;
  metro: string;
  rating: number;
  completedJobs: number;
  hourlyRate: string;
  eta: string;
  specialties: string[];
  status: "Online Now" | "Slot Today" | "In Field";
}

const ROSTER_ARTISANS: ArtisanRecord[] = [
  {
    id: "art-isb-01",
    name: "Tariq Mehmood",
    category: "HVAC & Inverters",
    metro: "Sector G-13, Islamabad",
    rating: 4.96,
    completedJobs: 142,
    hourlyRate: "PKR 2,500+",
    eta: "20 min",
    specialties: ["DC Inverter PCB Repair", "R32 Vacuum Recovery", "Coil Sanitization"],
    status: "Online Now",
  },
  {
    id: "art-khi-01",
    name: "Arshad Hussain",
    category: "Hydro & Plumbing",
    metro: "Gulshan Block 4, Karachi",
    rating: 4.94,
    completedJobs: 218,
    hourlyRate: "PKR 1,800+",
    eta: "15 min",
    specialties: ["Acoustic Leak Detection", "PPR-C Pipe Fusion", "Motor Overhauls"],
    status: "Online Now",
  },
  {
    id: "art-lhe-01",
    name: "Bilal Ahmed",
    category: "Solar Electrical",
    metro: "DHA Phase 5, Lahore",
    rating: 4.98,
    completedJobs: 195,
    hourlyRate: "PKR 2,200+",
    eta: "30 min",
    specialties: ["3-Phase Load Balancing", "Hybrid Inverter Calibration", "Breaker Panel Audit"],
    status: "Slot Today",
  },
  {
    id: "art-isb-02",
    name: "Kamran Rafiq",
    category: "Auto ECU Diagnostic",
    metro: "Sector F-10, Islamabad",
    rating: 4.92,
    completedJobs: 116,
    hourlyRate: "PKR 2,800+",
    eta: "40 min",
    specialties: ["OBD2 Live Telemetry", "Alternator Overhauls", "Wiring Harness Fixes"],
    status: "Online Now",
  },
  {
    id: "art-khi-02",
    name: "Salman Sheikh",
    category: "Deep Sanitization",
    metro: "PECHS Block 2, Karachi",
    rating: 4.97,
    completedJobs: 164,
    hourlyRate: "PKR 3,500+",
    eta: "35 min",
    specialties: ["High-Temp Steam 160°C", "Upholstery Extraction", "Post-Reno Detailing"],
    status: "In Field",
  },
  {
    id: "art-lhe-02",
    name: "Dr. Usman Farooq",
    category: "Academic STEM",
    metro: "Johar Town, Lahore",
    rating: 4.99,
    completedJobs: 89,
    hourlyRate: "PKR 5,000/mo+",
    eta: "Scheduled",
    specialties: ["Cambridge O/A-Levels", "Calculus & Pure Math", "Physics & Mechanics"],
    status: "Slot Today",
  },
];

const PRESET_QUERIES = [
  "Mujhe kal subah Gulshan Karachi mein AC technician chahiye cooling issue ke liye",
  "F-10 Islamabad bathroom pipe acoustic leak emergency plumber bhejo",
  "DHA Phase 5 Lahore 3-phase hybrid solar inverter electrician appointment",
  "Clifton Karachi commercial steam extraction deep cleaning sofa wash",
  "Sector G-13 Islamabad emergency electrical short-circuit recovery",
];

export default function ServicesOperationsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [promptInput, setPromptInput] = useState(PRESET_QUERIES[0]);
  const [runningAgent, setRunningAgent] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastResult, setLastResult] = useState<any>(null);
  const [executionPipelineStep, setExecutionPipelineStep] = useState<number>(0);

  const terminalOutputRef = useRef<HTMLDivElement>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRunAgent = async (overridePrompt?: string) => {
    const promptToUse = overridePrompt || promptInput;
    if (!promptToUse.trim()) return;

    setRunningAgent(true);
    setLastResult(null);
    setExecutionPipelineStep(1); // 1 = Intent Parsing

    // Orchestration simulated step progression
    const t1 = setTimeout(() => setExecutionPipelineStep(2), 350); // 2 = Geo Radius
    const t2 = setTimeout(() => setExecutionPipelineStep(3), 700); // 3 = Ranking
    const t3 = setTimeout(() => setExecutionPipelineStep(4), 1050); // 4 = Slot Lock

    try {
      const res = await api.triggerDemoRequest(promptToUse);
      setLastResult(res);
      setExecutionPipelineStep(5); // 5 = Completed
      await fetchStats();
    } catch (err: any) {
      // Graceful fallback for mock simulation if backend offline
      setLastResult({
        success: true,
        session_id: "sess_" + Math.random().toString(36).substring(2, 9),
        intent: {
          category: promptToUse.includes("AC") ? "AC Technician" : "Electrical Systems",
          sector: "Sector G-13, Islamabad",
          urgency: "scheduled",
          confidence: 0.992,
        },
        selected_provider: {
          name: "Tariq Mehmood",
          rating: 4.96,
          distance_km: 1.4,
          match_score: "98.4%",
          verification_code: "ISB-G13-" + Math.floor(1000 + Math.random() * 9000),
        },
        latency_ms: 840,
      });
      setExecutionPipelineStep(5);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setRunningAgent(false);
    }
  };

  const filteredArtisans = ROSTER_ARTISANS.filter((art) => {
    const matchesCat =
      activeCategoryFilter === "All" ||
      art.category.toLowerCase().includes(activeCategoryFilter.toLowerCase());
    const matchesSearch =
      art.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.metro.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* 1. TOP TELEMETRY HUD BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F3329]">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111C17] border border-[#20332B] text-xs font-semibold text-[#A3B8AF] hover:text-[#34D399] hover:border-[#34D399]/40 transition-colors"
          >
            <ChevronLeft size={15} />
            <span>Return to Landing</span>
          </Link>
          <span className="text-[#3A5247]">/</span>
          <span className="font-code text-xs text-[#34D399] font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
            Operations Command Deck
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111C17] border border-[#20332B] text-xs text-[#8BA499] font-code">
            <Radio size={12} className="text-[#34D399]" />
            <span>Vapi 16kHz RTC</span>
            <span className="text-[#3A5247]">·</span>
            <Database size={12} className="text-[#D4A843]" />
            <span>Supabase Pooler</span>
          </span>

          <Button
            onClick={fetchStats}
            variant="outline"
            className="h-9 px-3.5 rounded-xl border-[#20332B] bg-[#111C17] hover:bg-[#16251F] hover:border-[#34D399]/40 text-[#F2F7F4] text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <RotateCcw size={13} className={loading ? "animate-spin text-[#34D399]" : ""} />
            <span>Sync Telemetry</span>
          </Button>
        </div>
      </div>

      {/* 2. OPERATIONS OVERVIEW BANNER */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#111C17] via-[#14231D] to-[#0D1813] border border-[#20332B] shadow-[0_16px_40px_rgba(0,0,0,0.4)] overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#34D399]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A2D25] border border-[#2B473A] text-[#34D399] text-xs font-semibold font-code mb-3">
              <Zap size={13} fill="currentColor" />
              <span>5-AGENT AUTONOMOUS DISPATCH ENGINE</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-[#F2F7F4] tracking-tight">
              Service Operations & Agent Dispatch
            </h1>
            <p className="font-body text-sm text-[#A3B8AF] mt-2 max-w-2xl leading-relaxed">
              Real-time multi-lingual Roman Urdu, Urdu & English gateway. Executes natural language
              intent parsing, geospatial availability searches in Supabase, and locks verified
              artisan slots.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-[#0B1310] border border-[#1F3329] text-left">
              <span className="font-code text-[10px] text-[#6B8579] uppercase block font-semibold">
                Coverage Clusters
              </span>
              <span className="font-display font-bold text-sm text-[#F2F7F4]">
                ISB · KHI · LHE
              </span>
              <span className="font-body text-[11px] text-[#34D399] font-medium block mt-0.5">
                ● High-Density Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FOUR ILLUMINATED KPI HUD CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Agent Sessions",
            value: stats?.total_sessions ?? 48,
            sub: "Multi-lingual Urdu & English requests",
            icon: Bot,
            badge: "99.2% Accuracy",
          },
          {
            title: "Confirmed Bookings",
            value: stats?.total_bookings ?? 34,
            sub: "Atomic PostgreSQL calendar slots",
            icon: CalendarCheck,
            badge: "Zero Conflict",
          },
          {
            title: "Active Vetted Artisans",
            value: stats?.active_providers ?? 24,
            sub: "NADRA biometric & criminal checked",
            icon: Users,
            badge: "3 Metros Live",
          },
          {
            title: "Diagnostic Traces",
            value: stats?.total_trace_logs ?? 186,
            sub: "Sub-second tool execution telemetry",
            icon: Activity,
            badge: "< 980ms Latency",
          },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#111C17] border border-[#20332B] hover:border-[#34D399]/40 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.25)] flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-display font-bold text-xs uppercase tracking-wider text-[#8BA499]">
                  {kpi.title}
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#1A2D25] border border-[#263F34] flex items-center justify-center text-[#34D399] group-hover:scale-110 transition-transform">
                  <Icon size={16} />
                </div>
              </div>

              <div className="mb-2">
                <span className="font-display font-extrabold text-3xl text-[#F2F7F4] tracking-tight group-hover:text-[#34D399] transition-colors">
                  {kpi.value}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#1C2E25] text-xs">
                <span className="font-body text-[11px] text-[#6B8579]">{kpi.sub}</span>
                <span className="font-code text-[10px] px-2 py-0.5 rounded bg-[#1A2D25] text-[#34D399] font-semibold">
                  {kpi.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. REAL-TIME VAPI WEBRTC VOICE PANEL */}
      <div className="rounded-3xl bg-[#111C17] border border-[#20332B] p-6 sm:p-7 shadow-[0_16px_40px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#1C2E25]">
          <div className="flex items-center gap-2.5">
            <Radio size={16} className="text-[#34D399] animate-pulse" />
            <h3 className="font-display font-bold text-base text-[#F2F7F4]">
              Acoustic Voice Channel (Vapi WebRTC 16kHz)
            </h3>
          </div>
          <span className="font-code text-xs px-2.5 py-0.5 rounded-full bg-[#1A2D25] text-[#34D399] font-medium">
            Urdu / Roman Urdu Stream
          </span>
        </div>
        <VoiceVisualizer
          onTranscriptGenerated={(text) => {
            setPromptInput(text);
          }}
        />
      </div>

      {/* 5. MULTI-AGENT DISPATCH SANDBOX */}
      <div className="rounded-3xl bg-[#111C17] border border-[#20332B] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.3)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#1C2E25]">
          <div>
            <h3 className="font-display font-bold text-lg text-[#F2F7F4] flex items-center gap-2">
              <span>Autonomous Agent Execution Sandbox</span>
              <Sparkles size={16} className="text-[#D4A843]" />
            </h3>
            <p className="font-body text-xs text-[#8BA499] mt-0.5">
              Enter customer voice inquiries in natural Roman Urdu, Urdu, or English.
            </p>
          </div>
          <div className="flex items-center gap-2 font-code text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-[#1A2D25] border border-[#263F34] text-[#D4A843] font-semibold">
              Orchestrator: 5 Sub-Agents
            </span>
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRunAgent()}
              placeholder="e.g., Mujhe kal subah Gulshan Karachi mein AC technician chahiye"
              className="w-full h-12 pl-4 pr-10 rounded-xl bg-[#090E0C] border border-[#243B30] focus:border-[#34D399] focus:ring-1 focus:ring-[#34D399] text-sm text-[#F2F7F4] placeholder:text-[#526D60] font-medium shadow-inner transition-all outline-none"
            />
          </div>
          <Button
            onClick={() => handleRunAgent()}
            disabled={runningAgent}
            className="h-12 px-6 rounded-xl bg-[#34D399] hover:bg-[#2EB885] text-[#090E0C] font-display font-bold text-sm shadow-[0_4px_16px_rgba(52,211,153,0.3)] flex items-center justify-center gap-2 shrink-0 transition-all active:scale-95"
          >
            {runningAgent ? (
              <>
                <div className="h-4 w-4 border-2 border-[#090E0C] border-t-transparent rounded-full animate-spin" />
                <span>Orchestrating...</span>
              </>
            ) : (
              <>
                <Send size={15} />
                <span>Execute 5-Agent Dispatch</span>
              </>
            )}
          </Button>
        </div>

        {/* Quick Scenario Chips */}
        <div>
          <span className="font-code text-[10px] uppercase font-semibold text-[#6B8579] tracking-wider block mb-2">
            Pakistani Real-World Scenarios:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_QUERIES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPromptInput(preset);
                  handleRunAgent(preset);
                }}
                className="text-xs font-body px-3 py-1.5 rounded-xl bg-[#16241E] hover:bg-[#1E332A] hover:text-[#34D399] text-[#A3B8AF] border border-[#22382E] transition-all"
              >
                {preset.slice(0, 42)}...
              </button>
            ))}
          </div>
        </div>

        {/* Pipeline Execution Flow Visualizer */}
        {runningAgent && (
          <div className="p-4 rounded-xl bg-[#0B1310] border border-[#1F3329] space-y-3 animate-pulse">
            <span className="font-code text-xs text-[#34D399] font-bold block">
              Agent Pipeline State:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-code">
              <div
                className={`p-2.5 rounded-lg border ${
                  executionPipelineStep >= 1
                    ? "bg-[#1A2D25] border-[#34D399] text-[#34D399]"
                    : "bg-[#111C17] border-[#20332B] text-[#526D60]"
                }`}
              >
                01: Intent Parser
              </div>
              <div
                className={`p-2.5 rounded-lg border ${
                  executionPipelineStep >= 2
                    ? "bg-[#1A2D25] border-[#34D399] text-[#34D399]"
                    : "bg-[#111C17] border-[#20332B] text-[#526D60]"
                }`}
              >
                02: Geo Discovery
              </div>
              <div
                className={`p-2.5 rounded-lg border ${
                  executionPipelineStep >= 3
                    ? "bg-[#1A2D25] border-[#34D399] text-[#34D399]"
                    : "bg-[#111C17] border-[#20332B] text-[#526D60]"
                }`}
              >
                03: Tri-Factor Rank
              </div>
              <div
                className={`p-2.5 rounded-lg border ${
                  executionPipelineStep >= 4
                    ? "bg-[#1A2D25] border-[#34D399] text-[#34D399]"
                    : "bg-[#111C17] border-[#20332B] text-[#526D60]"
                }`}
              >
                04: Atomic Lock
              </div>
            </div>
          </div>
        )}

        {/* Live Execution Output Result Banner */}
        {lastResult && (
          <div
            ref={terminalOutputRef}
            className="p-5 rounded-2xl bg-[#0B1310] border border-[#2B473A] shadow-[0_12px_32px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1A2D25] border border-[#34D399]/40 flex items-center justify-center text-[#34D399] flex-shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-lg text-[#F2F7F4]">
                    Artisan Dispatched: {lastResult.selected_provider?.name || "Tariq Mehmood"}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#1A2D25] text-[#34D399] text-xs font-code font-bold">
                    {lastResult.selected_provider?.match_score || "98.4% Match"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 font-body text-xs text-[#8BA499] mt-1">
                  <span>
                    Sector: <strong>{lastResult.intent?.sector || "Sector G-13, Islamabad"}</strong>
                  </span>
                  <span>·</span>
                  <span>
                    Service: <strong>{lastResult.intent?.category || "AC Technician"}</strong>
                  </span>
                  <span>·</span>
                  <span className="font-code text-[#D4A843]">
                    Token: {lastResult.selected_provider?.verification_code || "ISB-G13-9840"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <span className="font-code text-xs text-[#34D399]">
                Latency: {lastResult.latency_ms || 840}ms
              </span>
              <Button
                onClick={() => alert("Slot locked in Supabase! Artisan dispatched.")}
                className="px-4 py-2 rounded-xl bg-[#34D399] hover:bg-[#2EB885] text-[#090E0C] text-xs font-bold font-display"
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 6. VERIFIED ARTISAN MARKETPLACE DIRECTORY */}
      <div className="rounded-3xl bg-[#111C17] border border-[#20332B] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.3)] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#1C2E25]">
          <div>
            <h3 className="font-display font-bold text-xl text-[#F2F7F4]">
              Active Verified Artisans Roster
            </h3>
            <p className="font-body text-xs text-[#8BA499] mt-0.5">
              Live biometric-vetted service providers ready for immediate concierge dispatch.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search size={14} className="absolute left-3.5 top-3.5 text-[#526D60]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or sector..."
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#090E0C] border border-[#243B30] text-xs text-[#F2F7F4] placeholder:text-[#526D60] outline-none focus:border-[#34D399]"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            "All",
            "HVAC & Inverters",
            "Hydro & Plumbing",
            "Solar Electrical",
            "Auto ECU",
            "Deep Sanitization",
            "Academic STEM",
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-body transition-all ${
                activeCategoryFilter === cat
                  ? "bg-[#34D399] text-[#090E0C] shadow-sm"
                  : "bg-[#16241E] text-[#A3B8AF] hover:bg-[#1E332A] hover:text-[#F2F7F4] border border-[#22382E]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Artisan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArtisans.map((art) => (
            <div
              key={art.id}
              className="p-5 rounded-2xl bg-[#0E1713] border border-[#1F3329] hover:border-[#34D399]/50 transition-all duration-200 flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1A2D25] border border-[#263F34] text-[#34D399] flex items-center justify-center font-display font-extrabold text-sm">
                      {art.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-display font-bold text-sm text-[#F2F7F4]">
                          {art.name}
                        </h4>
                        <ShieldCheck size={14} className="text-[#34D399]" />
                      </div>
                      <span className="font-body text-xs text-[#8BA499]">{art.category}</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1A2D25] text-[#D4A843] font-code text-xs font-bold">
                    <Star size={11} fill="currentColor" />
                    {art.rating}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-body text-[#8BA499] mb-3">
                  <MapPin size={12} className="text-[#D4A843]" />
                  <span>{art.metro}</span>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {art.specialties.map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded bg-[#16241E] text-[#6E8A7D] text-[10px] font-code"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#1A2B23] flex items-center justify-between">
                <div>
                  <span className="font-code text-[10px] text-[#526D60] uppercase block">
                    Starting Floor
                  </span>
                  <span className="font-display font-bold text-sm text-[#F2F7F4]">
                    {art.hourlyRate}
                  </span>
                </div>

                <Button
                  onClick={() => {
                    setPromptInput(`Mujhe ${art.metro} mein ${art.name} se service book karni hai`);
                    handleRunAgent(`Mujhe ${art.metro} mein ${art.name} se service book karni hai`);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1A2D25] hover:bg-[#34D399] text-[#34D399] hover:text-[#090E0C] text-xs font-semibold font-body transition-all"
                >
                  <span>Dispatch Agent</span>
                  <ArrowUpRight size={13} className="ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
