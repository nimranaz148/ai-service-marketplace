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
      case "Concierge":
      case "Discovery":
      case "Booking":
      case "Followup":
      case "IntentAgent":
        return "text-accent bg-accent-tint border-status-live-line";
      case "DiscoveryAgent":
        return "text-accent bg-accent-tint border-status-live-line";
      case "RankingAgent":
        return "text-status-warn bg-status-warn-tint border-status-warn-line";
      case "BookingAgent":
        return "text-accent bg-accent-tint border-status-live-line";
      case "FollowupAgent":
        return "text-accent bg-accent-tint border-status-live-line";
      default:
        return "text-ink-muted bg-surface-raised border-hairline";
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button & Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/traces"
          className="inline-flex items-center gap-2 text-xs text-ink-muted hover:text-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to All Sessions
        </Link>
        <Button
          onClick={handleExportJSON}
          variant="outline"
          size="sm"
          className="text-xs bg-surface-raised border-hairline text-ink hover:bg-surface-sunken gap-1.5 rounded-xl cursor-pointer"
        >
          <Download className="h-3.5 w-3.5 text-accent" /> Export Trace JSON
        </Button>
      </div>

      {/* Session Summary Card */}
      <Card className="bg-surface-raised border-hairline rounded-2xl shadow-raised">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-mono border-hairline bg-surface text-accent">
                  SESSION ID: {sessionId.slice(0, 8)}...
                </Badge>
                <Badge className="bg-status-go-tint text-status-go border border-status-go-line text-[10px]">
                  {session?.status || "completed"}
                </Badge>
              </div>
              <CardTitle className="font-display text-lg font-bold text-ink mt-2">
                &ldquo;{session?.raw_input}&rdquo;
              </CardTitle>
            </div>
            <div className="flex items-center gap-4 text-xs text-ink-muted">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-accent" />
                <span>Total Latency: <strong className="text-ink">{totalDuration} ms</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-accent" />
                <span>Steps: <strong className="text-ink">{traces.length}</strong></span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Interactive Step-by-Step Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold tracking-wider text-ink-muted uppercase flex items-center gap-2 font-code">
            <Layers className="h-4 w-4 text-accent" />
            Chronological Agent Execution Chain
          </h2>
          <span className="text-xs text-ink-muted">Click any step to expand/collapse I/O payloads</span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-xs text-ink-muted">Loading trace timeline...</div>
        ) : (
          <div className="space-y-3">
            {traces.map((trace, idx) => {
              const isExpanded = expandedSteps[trace.step];

              return (
                <div key={trace.id} className="relative">
                  {/* Step Card */}
                  <Card className="bg-surface-raised border-hairline rounded-2xl overflow-hidden transition-all hover:border-status-live-line shadow-raised">
                    <div
                      onClick={() => toggleStep(trace.step)}
                      className="p-4 flex items-center justify-between cursor-pointer select-none bg-surface-raised hover:bg-surface-sunken transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {/* Step Circle */}
                        <div className="h-7 w-7 rounded-full bg-accent-tint border border-status-live-line flex items-center justify-center text-xs font-mono font-bold text-accent">
                          {trace.step}
                        </div>

                        {/* Agent & Tool Info */}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded border font-medium ${getAgentColor(trace.agent_name)}`}>
                              {trace.agent_name}
                            </span>
                            <span className="text-xs font-mono text-ink-muted">
                              tool: <code className="text-accent font-semibold">{trace.tool_used}()</code>
                            </span>
                          </div>
                          <p className="text-xs text-ink-muted mt-1">{trace.output_summary}</p>
                        </div>
                      </div>

                      {/* Latency & Toggle Icon */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface text-accent border border-hairline">
                          {trace.duration_ms}ms
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-accent" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-ink-muted" />
                        )}
                      </div>
                    </div>

                    {/* Collapsible JSON I/O Details */}
                    {isExpanded && (
                      <div className="p-4 border-t border-hairline bg-surface grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Input Payload */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-ink-muted uppercase tracking-wider font-code">
                            <span>Input Payload</span>
                            <Code className="h-3 w-3 text-ink-muted" />
                          </div>
                          <pre className="p-3 rounded-xl bg-surface border border-hairline text-xs font-mono text-ink overflow-x-auto max-h-56 leading-relaxed">
                            {JSON.stringify(trace.input_payload, null, 2)}
                          </pre>
                        </div>

                        {/* Output Payload */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-ink-muted uppercase tracking-wider font-code">
                            <span>Output Payload</span>
                            <Code className="h-3 w-3 text-ink-muted" />
                          </div>
                          <pre className="p-3 rounded-xl bg-surface border border-hairline text-xs font-mono text-accent overflow-x-auto max-h-56 leading-relaxed">
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
