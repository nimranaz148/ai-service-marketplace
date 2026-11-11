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
    Concierge: {
      label: "Triage",
      icon: "💬",
      badgeColor: "bg-accent-tint text-accent border-status-live-line",
    },
    Discovery: {
      label: "Provider Discovery",
      icon: "🔍",
      badgeColor: "bg-accent-tint text-accent border-status-live-line",
    },
    Booking: {
      label: "Slot Reservation",
      icon: "📝",
      badgeColor: "bg-accent-tint text-accent border-status-live-line",
    },
    Followup: {
      label: "Follow-up Scheduler",
      icon: "⏰",
      badgeColor: "bg-accent-tint text-accent border-status-live-line",
    },
    IntentAgent: {
      label: "1. Intent Extraction",
      icon: "🧠",
      badgeColor: "bg-accent-tint text-accent border-status-live-line",
    },
    DiscoveryAgent: {
      label: "2. Provider Discovery",
      icon: "🔍",
      badgeColor: "bg-accent-tint text-accent border-status-live-line",
    },
    RankingAgent: {
      label: "3. Multi-Factor Ranking",
      icon: "📊",
      badgeColor: "bg-status-warn-tint text-status-warn border-status-warn-line",
    },
    BookingAgent: {
      label: "4. Slot Reservation",
      icon: "📝",
      badgeColor: "bg-accent-tint text-accent border-status-live-line",
    },
    FollowupAgent: {
      label: "5. Notification Scheduler",
      icon: "⏰",
      badgeColor: "bg-accent-tint text-accent border-status-live-line",
    },
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center space-y-3 bg-surface-raised border border-hairline rounded-2xl">
        <div className="h-6 w-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-ink-muted font-medium">Executing multi-agent reasoning chain...</p>
      </div>
    );
  }

  if (!traces || traces.length === 0) {
    return (
      <div className="p-8 text-center bg-surface-raised rounded-2xl border border-dashed border-hairline">
        <Terminal className="h-8 w-8 text-ink-muted mx-auto mb-2 opacity-60" />
        <h4 className="text-sm font-semibold text-ink">No Trace Logs In View</h4>
        <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
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
          badgeColor: "bg-accent-tint text-accent border-status-live-line",
        };
        const isExpanded = expandedSteps[trace.step];

        return (
          <div
            key={trace.id || trace.step}
            className="rounded-2xl bg-surface-raised overflow-hidden border border-hairline transition-all hover:border-status-live-line shadow-raised"
          >
            {/* Header Accordion */}
            <button
              onClick={() => toggleStep(trace.step)}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left bg-surface-raised hover:bg-surface-sunken transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{config.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-ink">{config.label}</span>
                    <Badge variant="outline" className={`text-[10px] font-mono px-2 py-0.5 ${config.badgeColor}`}>
                      {trace.agent_name}
                    </Badge>
                  </div>
                  <p className="text-xs text-ink-muted mt-0.5">{trace.output_summary}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-ink-muted text-xs font-mono">
                  <Clock className="h-3.5 w-3.5 text-accent" />
                  <span>{trace.duration_ms}ms</span>
                </div>
                <div className="h-6 w-6 rounded-full bg-accent-tint border border-status-live-line flex items-center justify-center text-accent">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
              </div>
            </button>

            {/* Collapsible Payload Viewer */}
            {isExpanded && (
              <div className="p-5 border-t border-hairline bg-surface space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tool & Input Payload */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-ink-muted">
                      <span className="flex items-center gap-1">
                        <Wrench className="h-3 w-3 text-accent" />
                        Tool: <code className="text-ink font-mono">{trace.tool_used}</code>
                      </span>
                      <span className="text-ink-muted font-normal font-code">Input JSON</span>
                    </div>
                    <pre className="p-3.5 rounded-xl bg-surface text-ink text-[11px] font-mono overflow-x-auto max-h-48 border border-hairline">
                      {JSON.stringify(trace.input_payload, null, 2)}
                    </pre>
                  </div>

                  {/* Output Payload */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-ink-muted">
                      <span className="flex items-center gap-1">
                        <Cpu className="h-3 w-3 text-accent" />
                        Execution Result
                      </span>
                      <span className="text-ink-muted font-normal font-code">Output JSON</span>
                    </div>
                    <pre className="p-3.5 rounded-xl bg-surface text-accent text-[11px] font-mono overflow-x-auto max-h-48 border border-hairline">
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
