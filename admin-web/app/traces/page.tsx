"use client";

import React, { useEffect, useState } from "react";
import { api, SessionItem, TraceLog } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TraceTimeline } from "@/components/agent/TraceTimeline";
import { Activity, Clock, Cpu, MessageSquare, Terminal, ChevronRight, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function TracesPage() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sessionTraces, setSessionTraces] = useState<TraceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [tracesLoading, setTracesLoading] = useState(false);

  const loadSessions = async () => {
    try {
      const data = await api.getSessions();
      setSessions(data);
      if (data.length > 0 && !selectedSessionId) {
        setSelectedSessionId(data[0].id);
        setSessionTraces(data[0].trace_logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleSelectSession = async (session: SessionItem) => {
    setSelectedSessionId(session.id);
    if (session.trace_logs && session.trace_logs.length > 0) {
      setSessionTraces(session.trace_logs);
    } else {
      setTracesLoading(true);
      try {
        const traces = await api.getSessionTraces(session.id);
        setSessionTraces(traces);
      } catch (err) {
        console.error(err);
      } finally {
        setTracesLoading(false);
      }
    }
  };

  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#34D399] bg-[#162D23] px-3 py-1 rounded-full border border-[#2B493B]">
              Observability & Deep Diagnostics
            </span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[#F2F7F4] tracking-tight mt-2">
            Multi-Agent Step Traces
          </h1>
          <p className="font-body text-xs text-[#A3B8AF] mt-1">
            Deep execution traces, tool payloads, and latency breakdowns for every customer request.
          </p>
        </div>

        <Button
          onClick={() => loadSessions()}
          variant="outline"
          className="h-10 px-4 rounded-xl border-[#20332B] bg-[#111C17] hover:bg-[#16251F] text-[#F2F7F4] text-xs font-bold"
        >
          Refresh Sessions
        </Button>
      </div>

      {/* Main 2-Column Split: Sessions List + Deep Trace Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sessions List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold text-[#F2F7F4] px-1 flex items-center justify-between">
            <span>Customer Sessions</span>
            <Badge className="bg-[#111C17] text-[#34D399] text-[10px] font-mono border border-[#20332B]">
              {sessions.length} recorded
            </Badge>
          </h3>

          {loading ? (
            <div className="p-8 text-center bg-[#111C17] border border-[#20332B] rounded-2xl">
              <div className="h-5 w-5 border-2 border-[#34D399] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-[#8EAAA0]">Loading session history...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center bg-[#111C17] rounded-2xl border border-dashed border-[#20332B]">
              <MessageSquare className="h-6 w-6 text-[#5E796F] mx-auto mb-2" />
              <p className="text-xs text-[#8EAAA0]">No sessions recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
              {sessions.map((session) => {
                const isSelected = session.id === selectedSessionId;
                return (
                  <button
                    key={session.id}
                    onClick={() => handleSelectSession(session)}
                    className={`w-full p-4 rounded-2xl text-left transition-all border ${
                      isSelected
                        ? "bg-[#162D23] border-[#34D399]/60 shadow-md ring-1 ring-[#34D399]/30"
                        : "bg-[#111C17] border-[#20332B] hover:border-[#34D399]/30 hover:bg-[#14221B]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-[#F2F7F4] line-clamp-2">
                        "{session.raw_input}"
                      </p>
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 transition-transform ${
                          isSelected ? "text-[#34D399] translate-x-0.5" : "text-[#5E796F]"
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-[11px] text-[#A3B8AF]">
                      <Badge variant="outline" className="text-[10px] font-mono bg-[#0B1310] text-[#34D399] border-[#1F3329]">
                        {session.detected_language}
                      </Badge>
                      <span className="font-medium text-[#F2F7F4]">
                        {session.intent_result?.service_type || "General"}
                      </span>
                      <span className="text-[#3A5247]">•</span>
                      <span className="text-[#6B877B] font-mono text-[10px]">
                        {formatDate(session.started_at)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Deep Trace Timeline */}
        <div className="lg:col-span-7 space-y-4">
          {selectedSession ? (
            <div className="space-y-4">
              {/* Selected Session Metadata Box */}
              <div className="p-5 rounded-2xl bg-[#111C17] border border-[#20332B] space-y-3 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-[#34D399]" />
                    <span className="text-xs font-bold text-[#F2F7F4]">Session ID:</span>
                    <code className="text-[11px] font-mono text-[#34D399] bg-[#0B1310] border border-[#1F3329] px-2 py-0.5 rounded">
                      {selectedSession.id}
                    </code>
                  </div>

                  <Badge className="bg-[#132A1F] text-[#34D399] border-[#214735] text-[10px] font-bold">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-[#34D399]" />
                    {selectedSession.status}
                  </Badge>
                </div>

                <div className="text-xs text-[#D1E0D9] bg-[#0B1310] p-3 rounded-xl border border-[#1C2C24]">
                  <span className="font-semibold text-[#34D399]">Input Prompt: </span>
                  <span className="italic text-[#F2F7F4]">"{selectedSession.raw_input}"</span>
                </div>
              </div>

              {/* Step Timeline */}
              <TraceTimeline traces={sessionTraces} isLoading={tracesLoading} />
            </div>
          ) : (
            <div className="p-12 text-center bg-[#111C17] rounded-2xl border border-dashed border-[#20332B]">
              <Activity className="h-8 w-8 text-[#5E796F] mx-auto mb-2" />
              <p className="text-xs text-[#8EAAA0]">Select a session on the left to inspect its 5-agent trace.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
