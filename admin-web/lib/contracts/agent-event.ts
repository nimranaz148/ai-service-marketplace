export type AgentEventKind =
  | "agent_started"
  | "tool_call_started"
  | "tool_call_result"
  | "info_found"
  | "question_required"
  | "approval_required"
  | "agent_completed"
  | "error";

interface AgentEventBase {
  sessionId: string;
  step: number;
  agentName: string;
  summary: string;
  payload: Record<string, unknown>;
  timestamp: string; // ISO datetime
  durationMs?: number;
}

export type AgentEvent =
  | (AgentEventBase & { kind: "agent_started" })
  | (AgentEventBase & { kind: "tool_call_started"; toolName: string })
  | (AgentEventBase & { kind: "tool_call_result"; toolName: string })
  | (AgentEventBase & { kind: "info_found" })
  | (AgentEventBase & { kind: "question_required"; question: string })
  | (AgentEventBase & { kind: "approval_required"; action: string })
  | (AgentEventBase & { kind: "agent_completed" })
  | (AgentEventBase & { kind: "error"; errorCode?: string });

const KINDS: readonly AgentEventKind[] = [
  "agent_started", "tool_call_started", "tool_call_result", "info_found",
  "question_required", "approval_required", "agent_completed", "error",
];

export function isAgentEvent(x: unknown): x is AgentEvent {
  if (typeof x !== "object" || x === null) return false;
  const e = x as Record<string, unknown>;
  if (typeof e.kind !== "string" || !KINDS.includes(e.kind as AgentEventKind)) return false;
  if (typeof e.sessionId !== "string" || typeof e.step !== "number") return false;
  if (typeof e.agentName !== "string" || typeof e.summary !== "string") return false;
  if (typeof e.timestamp !== "string" || typeof e.payload !== "object" || e.payload === null) return false;
  if ((e.kind === "tool_call_started" || e.kind === "tool_call_result") && typeof e.toolName !== "string") return false;
  return true;
}
