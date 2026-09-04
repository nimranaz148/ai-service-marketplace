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
      badgeColor: "bg-[#162D23] text-[#34D399] border-[#2B493B]",
    },
    DiscoveryAgent: {
      label: "2. Provider Discovery",
      icon: "🔍",
      badgeColor: "bg-[#162D23] text-[#34D399] border-[#2B493B]",
    },
    RankingAgent: {
      label: "3. Multi-Factor Ranking",
      icon: "📊",
      badgeColor: "bg-[#162D23] text-[#34D399] border-[#2B493B]",
    },
    BookingAgent: {
      label: "4. Slot Reservation",
      icon: "📝",
      badgeColor: "bg-[#162D23] text-[#34D399] border-[#2B493B]",
    },
    FollowupAgent: {
      label: "5. Notification Scheduler",
      icon: "⏰",
      badgeColor: "bg-[#162D23] text-[#34D399] border-[#2B493B]",
    },
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center space-y-3 bg-[#111C17] border border-[#20332B] rounded-2xl">
        <div className="h-6 w-6 border-2 border-[#34D399] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#8EAAA0] font-medium">Executing multi-agent reasoning chain...</p>
      </div>
    );
  }

  if (!traces || traces.length === 0) {
    return (
      <div className="p-8 text-center bg-[#111C17] rounded-2xl border border-dashed border-[#20332B]">
        <Terminal className="h-8 w-8 text-[#5E796F] mx-auto mb-2 opacity-60" />
        <h4 className="text-sm font-semibold text-[#F2F7F4]">No Trace Logs In View</h4>
        <p className="text-xs text-[#8EAAA0] mt-1 max-w-sm mx-auto">
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
          badgeColor: "bg-[#162D23] text-[#34D399] border-[#2B493B]",
        };
        const isExpanded = expandedSteps[trace.step];

        return (
          <div
            key={trace.id || trace.step}
            className="rounded-2xl bg-[#111C17] overflow-hidden border border-[#20332B] transition-all hover:border-[#34D399]/40 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
          >
            {/* Header Accordion */}
            <button
              onClick={() => toggleStep(trace.step)}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left bg-[#0D1813] hover:bg-[#14231D] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{config.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#F2F7F4]">{config.label}</span>
                    <Badge variant="outline" className={`text-[10px] font-mono px-2 py-0.5 ${config.badgeColor}`}>
                      {trace.agent_name}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#A3B8AF] mt-0.5">{trace.output_summary}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[#8EAAA0] text-xs font-mono">
                  <Clock className="h-3.5 w-3.5 text-[#34D399]" />
                  <span>{trace.duration_ms}ms</span>
                </div>
                <div className="h-6 w-6 rounded-full bg-[#162D23] border border-[#2B493B] flex items-center justify-center text-[#34D399]">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
              </div>
            </button>

            {/* Collapsible Payload Viewer */}
            {isExpanded && (
              <div className="p-5 border-t border-[#1F3329] bg-[#090E0C] space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tool & Input Payload */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#8EAAA0]">
                      <span className="flex items-center gap-1">
                        <Wrench className="h-3 w-3 text-[#34D399]" />
                        Tool: <code className="text-[#F2F7F4] font-mono">{trace.tool_used}</code>
                      </span>
                      <span className="text-[#5E796F] font-normal font-code">Input JSON</span>
                    </div>
                    <pre className="p-3.5 rounded-xl bg-[#050807] text-[#D1E0D9] text-[11px] font-mono overflow-x-auto max-h-48 border border-[#14231D]">
                      {JSON.stringify(trace.input_payload, null, 2)}
                    </pre>
                  </div>

                  {/* Output Payload */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#8EAAA0]">
                      <span className="flex items-center gap-1">
                        <Cpu className="h-3 w-3 text-[#34D399]" />
                        Execution Result
                      </span>
                      <span className="text-[#5E796F] font-normal font-code">Output JSON</span>
                    </div>
                    <pre className="p-3.5 rounded-xl bg-[#050807] text-[#34D399] text-[11px] font-mono overflow-x-auto max-h-48 border border-[#14231D]">
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
