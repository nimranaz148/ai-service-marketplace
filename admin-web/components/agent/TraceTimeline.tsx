"use client";

import React, { useState } from "react";
import { TraceLog } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ChevronDown, ChevronRight, Clock, Cpu, Sparkles, Terminal, Wrench } from "lucide-react";

interface TraceTimelineProps {
  traces: TraceLog[];
  isLoading?: boolean;
}

export function TraceTimeline({ traces, isLoading }: TraceTimelineProps) {
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({ 1: true, 2: false, 3: false, 4: true, 5: false });

  const toggleStep = (step: number) => {
    setExpandedSteps((prev) => ({ ...prev, [step]: !prev[step] }));
  };

  const agentConfig: Record<string, { label: string; icon: string; badgeColor: string }> = {
    IntentAgent: {
      label: "1. Intent Extraction",
      icon: "🧠",
      badgeColor: "bg-[#0054F9]/15 text-[#38BDF8] border-[#0054F9]/30",
    },
    DiscoveryAgent: {
      label: "2. Provider Discovery",
      icon: "🔍",
      badgeColor: "bg-[#0054F9]/15 text-[#38BDF8] border-[#0054F9]/30",
    },
    RankingAgent: {
      label: "3. Multi-Factor Ranking",
      icon: "📊",
      badgeColor: "bg-[#D4A843]/15 text-[#D4A843] border-[#D4A843]/30",
    },
    BookingAgent: {
      label: "4. Slot Reservation",
      icon: "📝",
      badgeColor: "bg-[#0054F9]/15 text-[#38BDF8] border-[#0054F9]/30",
    },
    FollowupAgent: {
      label: "5. Notification Scheduler",
      icon: "⏰",
      badgeColor: "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30",
    },
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center space-y-3 bg-[#111118] border border-white/8 rounded-2xl">
        <div className="h-6 w-6 border-2 border-[#0054F9] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-400 font-medium">Executing multi-agent reasoning chain...</p>
      </div>
    );
  }

  if (!traces || traces.length === 0) {
    return (
      <div className="p-8 text-center bg-[#111118] rounded-2xl border border-dashed border-white/10">
        <Terminal className="h-8 w-8 text-zinc-500 mx-auto mb-2 opacity-60" />
        <h4 className="text-sm font-semibold text-white">No Trace Logs In View</h4>
        <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
          Type an Urdu or English service request in the sandbox to watch the 5 agents orchestrate live.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {traces.map((trace) => {
        const config = agentConfig[trace.agent_name] || {
          label: trace.agent_name,
          icon: "🤖",
          badgeColor: "bg-[#0054F9]/15 text-[#38BDF8] border-[#0054F9]/30",
        };
        const isExpanded = expandedSteps[trace.step];

        return (
          <div
            key={trace.id || trace.step}
            className="rounded-2xl bg-[#111118] overflow-hidden border border-white/8 transition-all hover:border-[#0054F9]/40 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
          >
            {/* Header Accordion */}
            <button
              onClick={() => toggleStep(trace.step)}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left bg-[#141420] hover:bg-[#1A1A28] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{config.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{config.label}</span>
                    <Badge variant="outline" className={`text-[10px] font-mono px-2 py-0.5 ${config.badgeColor}`}>
                      {trace.agent_name}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{trace.output_summary}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-mono">
                  <Clock className="h-3.5 w-3.5 text-[#38BDF8]" />
                  <span>{trace.duration_ms}ms</span>
                </div>
                <div className="h-6 w-6 rounded-full bg-[#0054F9]/10 border border-[#0054F9]/30 flex items-center justify-center text-[#38BDF8]">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
              </div>
            </button>

            {/* Collapsible Payload Viewer */}
            {isExpanded && (
              <div className="p-5 border-t border-white/8 bg-[#0A0A0F] space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tool & Input Payload */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Wrench className="h-3 w-3 text-[#38BDF8]" />
                        Tool: <code className="text-white font-mono">{trace.tool_used}</code>
                      </span>
                      <span className="text-zinc-500 font-normal font-code">Input JSON</span>
                    </div>
                    <pre className="p-3.5 rounded-xl bg-[#06070B] text-zinc-300 text-[11px] font-mono overflow-x-auto max-h-48 border border-white/5">
                      {JSON.stringify(trace.input_payload, null, 2)}
                    </pre>
                  </div>

                  {/* Output Payload */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Cpu className="h-3 w-3 text-[#38BDF8]" />
                        Execution Result
                      </span>
                      <span className="text-zinc-500 font-normal font-code">Output JSON</span>
                    </div>
                    <pre className="p-3.5 rounded-xl bg-[#06070B] text-[#38BDF8] text-[11px] font-mono overflow-x-auto max-h-48 border border-white/5">
                      {JSON.stringify(trace.output_payload, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
