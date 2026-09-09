"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api, SessionItem, TraceLog } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TraceTimeline } from "@/components/agent/TraceTimeline";
import { Activity, Clock, Cpu, MessageSquare, Terminal, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
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
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="relative rounded-[2rem] p-6 sm:p-8 bg-[#111118] border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#0054F9]/15 blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="catalis-badge mb-3">
              <Activity size={13} className="text-[#0054F9]" />
              <span>SUPER ADMIN / 5-AGENT ORCHESTRATOR</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Multi-Agent Step Traces & Observability
            </h1>
            <p className="font-body text-xs sm:text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
              Deep execution traces, tool payloads, and latency breakdowns for every customer voice or chat request.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/dashboard/admin"
              className="h-10 px-4 rounded-xl bg-[#141420] hover:bg-[#1A1A28] text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <ChevronLeft size={14} className="text-[#38BDF8]" />
              <span>Admin Deck</span>
            </Link>
            <Button
              onClick={() => loadSessions()}
              className="h-10 px-4 rounded-xl bg-[#0054F9] hover:bg-[#0043C7] text-white shadow-[0_0_20px_rgba(0,84,249,0.3)] font-display font-bold text-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Activity size={14} />
              <span>Refresh Sessions</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Sessions List + Deep Trace Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sessions List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold text-white px-1 flex items-center justify-between">
            <span>Customer Sessions</span>
            <Badge className="bg-[#141420] text-[#38BDF8] text-[10px] font-mono border border-white/10">
              {sessions.length} recorded
            </Badge>
          </h3>

          {loading ? (
            <div className="p-8 text-center bg-[#111118] border border-white/8 rounded-2xl">
              <div className="h-5 w-5 border-2 border-[#0054F9] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-zinc-400">Loading session history...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center bg-[#111118] rounded-2xl border border-dashed border-white/10">
              <MessageSquare className="h-6 w-6 text-zinc-500 mx-auto mb-2" />
              <p className="text-xs text-zinc-400">No sessions recorded yet.</p>
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
                        ? "bg-[#141420] border-[#0054F9]/60 shadow-[0_0_20px_rgba(0,84,249,0.15)] ring-1 ring-[#0054F9]/30"
                        : "bg-[#111118] border-white/8 hover:border-[#0054F9]/30 hover:bg-[#141420]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-white line-clamp-2">
                        "{session.raw_input}"
                      </p>
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 transition-transform ${
                          isSelected ? "text-[#38BDF8] translate-x-0.5" : "text-zinc-500"
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-[11px] text-zinc-400">
                      <Badge variant="outline" className="text-[10px] font-mono bg-[#0A0A0F] text-[#38BDF8] border-white/10">
                        {session.detected_language}
                      </Badge>
                      <span className="font-medium text-white">
                        {session.intent_result?.service_type || "General"}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-500 font-mono text-[10px]">
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
              <div className="p-5 rounded-2xl bg-[#111118] border border-white/10 space-y-3 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-[#38BDF8]" />
                    <span className="text-xs font-bold text-white">Session ID:</span>
                    <code className="text-[11px] font-mono text-[#38BDF8] bg-[#0A0A0F] border border-white/10 px-2 py-0.5 rounded">
                      {selectedSession.id}
                    </code>
                  </div>

                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-bold">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-400" />
                    {selectedSession.status}
                  </Badge>
                </div>

                <div className="text-xs text-zinc-300 bg-[#0A0A0F] p-3 rounded-xl border border-white/8">
                  <span className="font-semibold text-[#38BDF8]">Input Prompt: </span>
                  <span className="italic text-white">"{selectedSession.raw_input}"</span>
                </div>
              </div>

              {/* Step Timeline */}
              <TraceTimeline traces={sessionTraces} isLoading={tracesLoading} />
            </div>
          ) : (
            <div className="p-12 text-center bg-[#111118] rounded-2xl border border-dashed border-white/10">
              <Activity className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
              <p className="text-xs text-zinc-400">Select a session on the left to inspect its 5-agent trace.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
