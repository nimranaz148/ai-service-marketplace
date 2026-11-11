"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { api, type ConversationResponse, type ConversationTurn } from "@/lib/api";
import { traceLogToAgentEvent } from "@/lib/agent/map-trace";
import { AgentEventItem } from "@/components/primitives/agent-event-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The real conversational request flow: type what you need, the Concierge
 * agent asks a follow-up question when something's missing, and every tool
 * call it makes shows up in the trace panel as it happens — not a scripted
 * demo, a live call against /requests and /requests/{id}/reply.
 */
export default function CustomerRequestPage() {
  const { user } = useAuth();
  const [turns, setTurns] = React.useState<ConversationTurn[]>([]);
  const [traceLogs, setTraceLogs] = React.useState<ConversationResponse["trace_logs"]>([]);
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<ConversationResponse["status"] | null>(null);
  const [input, setInput] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns]);

  async function send(message: string) {
    if (!message.trim() || pending) return;
    setPending(true);
    setError(null);
    setInput("");
    try {
      const res = sessionId
        ? await api.continueConversation(sessionId, message)
        : await api.startConversation(message, user?.id);
      setSessionId(res.session_id);
      setStatus(res.status);
      setTurns(res.turns);
      setTraceLogs(res.trace_logs);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong reaching the agent.");
    } finally {
      setPending(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    void send(input);
  }

  const statusTone: Record<string, string> = {
    needs_input: "border-status-warn-line bg-status-warn-tint",
    in_progress: "border-status-info-line bg-status-info-tint",
    completed: "border-status-go-line bg-status-go-tint",
    failed: "border-status-stop-line bg-status-stop-tint",
  };
  const statusLabel: Record<string, string> = {
    needs_input: "Waiting on you",
    in_progress: "Working",
    completed: "Booked",
    failed: "Couldn't complete",
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-4 px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard/customer" className="font-mono text-xs uppercase tracking-[0.12em] text-ink-muted hover:text-ink">
            ← Dashboard
          </Link>
          <h1 className="font-display mt-1 text-2xl font-semibold text-ink">Ask for help</h1>
        </div>
        {status ? (
          <span className={cn("inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium text-ink", statusTone[status])}>
            {statusLabel[status] ?? status}
          </span>
        ) : null}
      </div>

      <div className="grid flex-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Transcript */}
        <div className="flex flex-col rounded-lg border border-hairline bg-surface-raised">
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4" style={{ maxHeight: "60vh" }}>
            {turns.length === 0 ? (
              <p className="text-sm text-ink-muted">
                Bataiye kya masla hai — AC, plumbing, bijli, safai, ya tuition. Jitni tafseel deinge, utni jaldi banda mil jayega.
              </p>
            ) : (
              turns.map((t, i) => (
                <div key={i} className={cn("flex", t.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-md px-3 py-2 text-sm",
                      t.role === "user"
                        ? "bg-accent-tint text-ink"
                        : "border border-hairline bg-surface text-ink",
                    )}
                  >
                    {t.content}
                  </div>
                </div>
              ))
            )}
            {pending ? <p className="font-mono text-xs text-ink-muted">Concierge is working…</p> : null}
          </div>

          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-hairline p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Maslan: G-13 mein AC theek karana hai, kal subah…"
              aria-label="Your message"
              disabled={status === "completed" || status === "failed"}
              className="min-w-0 flex-1 rounded-md border border-hairline bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent disabled:opacity-50"
            />
            <Button type="submit" disabled={pending || status === "completed" || status === "failed"}>
              Send
            </Button>
          </form>
          {error ? <p className="px-3 pb-3 text-sm text-status-stop">{error}</p> : null}
        </div>

        {/* Live trace */}
        <div className="rounded-lg border border-hairline bg-surface-raised p-4">
          <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-ink-muted">What the agent is doing</h2>
          <div className="mt-3 space-y-2">
            {traceLogs.length === 0 ? (
              <p className="text-sm text-ink-muted">No tool calls yet.</p>
            ) : (
              traceLogs.map((log) => <AgentEventItem key={log.id} event={traceLogToAgentEvent(log)} live={false} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
