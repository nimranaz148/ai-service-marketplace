import type { TraceLog } from "@/lib/api";
import type { AgentEvent } from "@/lib/contracts";

/**
 * Maps a backend TraceLog row (one real tool call the Concierge agent made)
 * onto the AgentEvent contract the Phase 0 agent-activity primitives render.
 * Every row here is a completed tool call the agent actually made — there is
 * no synthetic "started" event, because the backend only logs after a tool
 * call returns.
 */
export function traceLogToAgentEvent(log: TraceLog): AgentEvent {
  return {
    kind: "tool_call_result",
    sessionId: log.session_id,
    step: log.step,
    agentName: log.agent_name,
    summary: log.output_summary,
    payload: (log.output_payload as Record<string, unknown>) ?? {},
    timestamp: log.created_at,
    durationMs: log.duration_ms,
    toolName: log.tool_used ?? "tool",
    ok: true,
  };
}
