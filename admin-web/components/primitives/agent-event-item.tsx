"use client";

import { useState } from "react";
import type { AgentEvent } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { ToolCallChip } from "./tool-call-chip";
import { cn } from "@/lib/utils";

export interface AgentEventItemProps {
  event: AgentEvent;
  /**
   * Spec §7: `--status-live` means "currently executing", never a static badge.
   * Liveness is therefore the caller's fact — an `agent_started` event on a session
   * that finished yesterday is NOT live — so it is an explicit prop, not derived
   * from `event.kind`.
   */
  live?: boolean;
  onAnswer?: (text: string) => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export function AgentEventItem({ event, live = false, onAnswer, onApprove, onReject }: AgentEventItemProps) {
  const [answer, setAnswer] = useState("");

  return (
    <div className="rounded-md border border-hairline bg-surface-raised p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            data-live={live ? "true" : undefined}
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              live
                ? "bg-[var(--status-live)]"
                : event.kind === "error" || (event.kind === "tool_call_result" && !event.ok)
                  ? "bg-[var(--status-stop)]"
                  : "bg-[var(--status-go)]",
            )}
          />
          <span className="font-mono text-xs text-ink-muted">{event.agentName}</span>
        </div>
        {"toolName" in event && event.toolName ? (
          <ToolCallChip
            name={event.toolName}
            status={event.kind === "tool_call_result" ? (event.ok ? "ok" : "error") : "running"}
          />
        ) : null}
      </div>

      <p className="mt-1.5 text-sm text-ink">{event.summary}</p>

      {event.kind === "question_required" ? (
        <div className="mt-2 space-y-2">
          <p className="text-sm text-ink">{event.question}</p>
          {onAnswer ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (answer.trim()) onAnswer(answer.trim());
              }}
              className="flex gap-2"
            >
              <input
                className="flex-1 rounded-md border border-hairline bg-surface px-2 py-1 text-sm text-ink outline-none focus:border-accent"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                aria-label="Your answer"
              />
              <Button type="submit" size="sm">Send</Button>
            </form>
          ) : null}
        </div>
      ) : null}

      {event.kind === "approval_required" ? (
        <div className="mt-2 space-y-2">
          <p className="text-sm text-ink">{event.action}</p>
          {onApprove || onReject ? (
            <div className="flex gap-2">
              <Button size="sm" onClick={onApprove}>Approve</Button>
              <Button size="sm" variant="outline" onClick={onReject}>Reject</Button>
            </div>
          ) : null}
        </div>
      ) : null}

      {event.durationMs ? <p className="mt-1 font-mono text-xs text-ink-muted">{event.durationMs} ms</p> : null}
    </div>
  );
}
