"use client";

import { useState } from "react";
import type { AgentEvent } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { ToolCallChip } from "./tool-call-chip";
import { cn } from "@/lib/utils";

export interface AgentEventItemProps {
  event: AgentEvent;
  onAnswer?: (text: string) => void;
  onApprove?: () => void;
  onReject?: () => void;
}

const LIVE_KINDS = new Set<AgentEvent["kind"]>(["agent_started", "tool_call_started"]);

export function AgentEventItem({ event, onAnswer, onApprove, onReject }: AgentEventItemProps) {
  const [answer, setAnswer] = useState("");
  const live = LIVE_KINDS.has(event.kind);

  return (
    <div className="rounded-md border border-hairline bg-surface-raised p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={cn("h-1.5 w-1.5 rounded-full", live ? "bg-[var(--status-live)]" : event.kind === "error" ? "bg-[var(--status-stop)]" : "bg-[var(--status-go)]")}
          />
          <span className="font-mono text-xs text-ink-muted">{event.agentName}</span>
        </div>
        {"toolName" in event && event.toolName ? (
          <ToolCallChip name={event.toolName} status={event.kind === "tool_call_result" ? "ok" : "running"} />
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
