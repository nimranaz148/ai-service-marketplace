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
      <div className="relative rounded-[2rem] p-6 sm:p-8 bg-surface-raised border border-hairline shadow-raised overflow-hidden">

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-pill border border-hairline bg-surface-sunken px-3 py-1 text-xs font-medium text-ink-muted mb-3">
              <Activity size={13} className="text-accent" />
              <span>SUPER ADMIN / 5-AGENT ORCHESTRATOR</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink tracking-tight">
              Multi-Agent Step Traces & Observability
            </h1>
            <p className="font-body text-xs sm:text-sm text-ink-muted mt-2 max-w-2xl leading-relaxed">
              Deep execution traces, tool payloads, and latency breakdowns for every customer voice or chat request.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/dashboard/admin"
              className="h-10 px-4 rounded-xl bg-surface-raised hover:bg-surface-sunken text-ink border border-hairline text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <ChevronLeft size={14} className="text-accent" />
              <span>Admin Deck</span>
            </Link>
            <Button
              onClick={() => loadSessions()}
              className="h-10 px-4 rounded-xl bg-primary hover:bg-[var(--accent-strong-hover)] text-accent-ink shadow-raised font-display font-bold text-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95"
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
          <h3 className="text-sm font-bold text-ink px-1 flex items-center justify-between">
            <span>Customer Sessions</span>
            <Badge className="bg-surface-raised text-accent text-[10px] font-mono border border-hairline">
              {sessions.length} recorded
            </Badge>
          </h3>

          {loading ? (
            <div className="p-8 text-center bg-surface-raised border border-hairline rounded-2xl">
              <div className="h-5 w-5 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-ink-muted">Loading session history...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center bg-surface-raised rounded-2xl border border-dashed border-hairline">
              <MessageSquare className="h-6 w-6 text-ink-muted mx-auto mb-2" />
              <p className="text-xs text-ink-muted">No sessions recorded yet.</p>
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
                        ? "bg-surface-raised border-status-live-line shadow-raised ring-1 ring-accent"
                        : "bg-surface-raised border-hairline hover:border-status-live-line hover:bg-surface-raised"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-ink line-clamp-2">
                        "{session.raw_input}"
                      </p>
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 transition-transform ${
                          isSelected ? "text-accent translate-x-0.5" : "text-ink-muted"
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-[11px] text-ink-muted">
                      <Badge variant="outline" className="text-[10px] font-mono bg-surface text-accent border-hairline">
                        {session.detected_language}
                      </Badge>
                      <span className="font-medium text-ink">
                        {session.intent_result?.service_type || "General"}
                      </span>
                      <span className="text-ink-muted">•</span>
                      <span className="text-ink-muted font-mono text-[10px]">
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
              <div className="p-5 rounded-2xl bg-surface-raised border border-hairline space-y-3 shadow-raised">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-accent" />
                    <span className="text-xs font-bold text-ink">Session ID:</span>
                    <code className="text-[11px] font-mono text-accent bg-surface border border-hairline px-2 py-0.5 rounded">
                      {selectedSession.id}
                    </code>
                  </div>

                  <Badge className="bg-status-go-tint text-status-go border-status-go-line text-[10px] font-bold">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-status-go" />
                    {selectedSession.status}
                  </Badge>
                </div>

                <div className="text-xs text-ink bg-surface p-3 rounded-xl border border-hairline">
                  <span className="font-semibold text-accent">Input Prompt: </span>
                  <span className="italic text-ink">"{selectedSession.raw_input}"</span>
                </div>
              </div>

              {/* Step Timeline */}
              <TraceTimeline traces={sessionTraces} isLoading={tracesLoading} />
            </div>
          ) : (
            <div className="p-12 text-center bg-surface-raised rounded-2xl border border-dashed border-hairline">
              <Activity className="h-8 w-8 text-ink-muted mx-auto mb-2" />
              <p className="text-xs text-ink-muted">Select a session on the left to inspect its multi-agent trace.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
