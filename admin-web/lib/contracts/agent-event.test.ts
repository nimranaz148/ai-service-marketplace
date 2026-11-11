import { describe, it, expect } from "vitest";
import { isAgentEvent, type AgentEvent } from "./agent-event";

const base = { sessionId: "s1", step: 1, agentName: "IntentAgent", timestamp: "2026-09-10T10:00:00Z" };

describe("isAgentEvent", () => {
  it("accepts every valid kind", () => {
    const kinds: AgentEvent["kind"][] = [
      "agent_started", "tool_call_started", "tool_call_result", "info_found",
      "question_required", "approval_required", "agent_completed", "error",
    ];
    for (const kind of kinds) {
      const obj: any = { ...base, kind, summary: "x", payload: {} };
      if (kind === "tool_call_started" || kind === "tool_call_result") {
        obj.toolName = "test";
      }
      if (kind === "tool_call_result") {
        obj.ok = true;
      }
      expect(isAgentEvent(obj)).toBe(true);
    }
  });

  it("rejects unknown kind and malformed objects", () => {
    expect(isAgentEvent({ ...base, kind: "nope", summary: "x", payload: {} })).toBe(false);
    expect(isAgentEvent({ kind: "error" })).toBe(false);
    expect(isAgentEvent(null)).toBe(false);
    expect(isAgentEvent("agent_started")).toBe(false);
  });

  it("requires toolName on tool_call_* kinds", () => {
    expect(isAgentEvent({ ...base, kind: "tool_call_started", summary: "x", payload: {}, toolName: "find_providers" })).toBe(true);
    expect(isAgentEvent({ ...base, kind: "tool_call_started", summary: "x", payload: {} })).toBe(false);
  });

  it("requires a boolean ok on tool_call_result", () => {
    expect(isAgentEvent({ ...base, kind: "tool_call_result", summary: "x", payload: {}, toolName: "create_booking", ok: false, errorCode: "slot_taken" })).toBe(true);
    expect(isAgentEvent({ ...base, kind: "tool_call_result", summary: "x", payload: {}, toolName: "create_booking" })).toBe(false);
  });
});
