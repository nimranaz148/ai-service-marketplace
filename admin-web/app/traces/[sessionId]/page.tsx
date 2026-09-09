"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api, TraceLog, SessionItem } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Bot,
  Clock,
  Code,
  Download,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Layers,
  CheckCircle,
} from "lucide-react";

export default function TraceDetailPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [traces, setTraces] = useState<TraceLog[]>([]);
  const [session, setSession] = useState<SessionItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({ 1: true });

  useEffect(() => {
    if (!sessionId) return;

    Promise.all([api.getSessions(), api.getSessionTraces(sessionId)])
      .then(([allSessions, traceList]) => {
        const currentSession = allSessions.find((s) => s.id === sessionId) || null;
        setSession(currentSession);
        setTraces(traceList);
        // Expand all steps by default
        const initialExpanded: Record<number, boolean> = {};
        traceList.forEach((t) => (initialExpanded[t.step] = true));
        setExpandedSteps(initialExpanded);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const toggleStep = (step: number) => {
    setExpandedSteps((prev) => ({ ...prev, [step]: !prev[step] }));
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(traces, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `trace-${sessionId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const totalDuration = traces.reduce((acc, curr) => acc + (curr.duration_ms || 0), 0);

  const getAgentColor = (agentName: string) => {
    switch (agentName) {
      case "IntentAgent":
        return "text-[#38BDF8] bg-[#0054F9]/15 border-[#0054F9]/30";
      case "DiscoveryAgent":
        return "text-[#38BDF8] bg-[#0054F9]/15 border-[#0054F9]/30";
      case "RankingAgent":
        return "text-[#D4A843] bg-[#D4A843]/15 border-[#D4A843]/30";
      case "BookingAgent":
        return "text-[#38BDF8] bg-[#0054F9]/15 border-[#0054F9]/30";
      case "FollowupAgent":
        return "text-[#38BDF8] bg-[#38BDF8]/15 border-[#38BDF8]/30";
      default:
        return "text-zinc-400 bg-[#141420] border-white/10";
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button & Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/traces"
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-[#0054F9] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to All Sessions
        </Link>
        <Button
          onClick={handleExportJSON}
          variant="outline"
          size="sm"
          className="text-xs bg-[#141420] border-white/10 text-white hover:bg-[#1A1A28] gap-1.5 rounded-xl cursor-pointer"
        >
          <Download className="h-3.5 w-3.5 text-[#38BDF8]" /> Export Trace JSON
        </Button>
      </div>

      {/* Session Summary Card */}
      <Card className="bg-[#111118] border-white/10 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-mono border-white/10 bg-[#0A0A0F] text-[#38BDF8]">
                  SESSION ID: {sessionId.slice(0, 8)}...
                </Badge>
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                  {session?.status || "completed"}
                </Badge>
              </div>
              <CardTitle className="font-display text-lg font-bold text-white mt-2">
                &ldquo;{session?.raw_input}&rdquo;
              </CardTitle>
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#38BDF8]" />
                <span>Total Latency: <strong className="text-white">{totalDuration} ms</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-[#38BDF8]" />
                <span>Steps: <strong className="text-white">{traces.length}</strong></span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Interactive Step-by-Step Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase flex items-center gap-2 font-code">
            <Layers className="h-4 w-4 text-[#38BDF8]" />
            Chronological Agent Execution Chain
          </h2>
          <span className="text-xs text-zinc-500">Click any step to expand/collapse I/O payloads</span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-xs text-zinc-400">Loading trace timeline...</div>
        ) : (
          <div className="space-y-3">
            {traces.map((trace, idx) => {
              const isExpanded = expandedSteps[trace.step];

              return (
                <div key={trace.id} className="relative">
                  {/* Step Card */}
                  <Card className="bg-[#111118] border-white/8 rounded-2xl overflow-hidden transition-all hover:border-[#0054F9]/40 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
                    <div
                      onClick={() => toggleStep(trace.step)}
                      className="p-4 flex items-center justify-between cursor-pointer select-none bg-[#141420] hover:bg-[#1A1A28] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {/* Step Circle */}
                        <div className="h-7 w-7 rounded-full bg-[#0054F9]/10 border border-[#0054F9]/30 flex items-center justify-center text-xs font-mono font-bold text-[#38BDF8]">
                          {trace.step}
                        </div>

                        {/* Agent & Tool Info */}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded border font-medium ${getAgentColor(trace.agent_name)}`}>
                              {trace.agent_name}
                            </span>
                            <span className="text-xs font-mono text-zinc-400">
                              tool: <code className="text-[#38BDF8] font-semibold">{trace.tool_used}()</code>
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1">{trace.output_summary}</p>
                        </div>
                      </div>

                      {/* Latency & Toggle Icon */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#0A0A0F] text-[#38BDF8] border border-white/10">
                          {trace.duration_ms}ms
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-[#38BDF8]" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-zinc-500" />
                        )}
                      </div>
                    </div>

                    {/* Collapsible JSON I/O Details */}
                    {isExpanded && (
                      <div className="p-4 border-t border-white/8 bg-[#0A0A0F] grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Input Payload */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-code">
                            <span>Input Payload</span>
                            <Code className="h-3 w-3 text-zinc-500" />
                          </div>
                          <pre className="p-3 rounded-xl bg-[#06070B] border border-white/5 text-xs font-mono text-zinc-300 overflow-x-auto max-h-56 leading-relaxed">
                            {JSON.stringify(trace.input_payload, null, 2)}
                          </pre>
                        </div>

                        {/* Output Payload */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-code">
                            <span>Output Payload</span>
                            <Code className="h-3 w-3 text-zinc-500" />
                          </div>
                          <pre className="p-3 rounded-xl bg-[#06070B] border border-white/5 text-xs font-mono text-[#38BDF8] overflow-x-auto max-h-56 leading-relaxed">
                            {JSON.stringify(trace.output_payload, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
