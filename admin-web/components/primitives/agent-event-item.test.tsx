import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AgentEventItem } from "./agent-event-item";
import type { AgentEvent } from "@/lib/contracts";

const at = "2026-09-10T10:00:00Z";

describe("AgentEventItem", () => {
  it("shows the tool name for a tool call", () => {
    const e: AgentEvent = { kind: "tool_call_started", sessionId: "s", step: 2, agentName: "DiscoveryAgent", toolName: "find_providers", summary: "Searching", payload: {}, timestamp: at };
    render(<AgentEventItem event={e} />);
    expect(screen.getByText("find_providers")).toBeInTheDocument();
  });

  it("renders the question and an answer field when onAnswer is provided", () => {
    const e: AgentEvent = { kind: "question_required", sessionId: "s", step: 3, agentName: "RankingAgent", question: "Nearest or highest-rated?", summary: "needs input", payload: {}, timestamp: at };
    render(<AgentEventItem event={e} onAnswer={vi.fn()} />);
    expect(screen.getByText("Nearest or highest-rated?")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders Approve and Reject for approval_required when handlers are provided", () => {
    const e: AgentEvent = { kind: "approval_required", sessionId: "s", step: 4, agentName: "BookingAgent", action: "Book Imran Baig at PKR 2,800", summary: "confirm", payload: {}, timestamp: at };
    render(<AgentEventItem event={e} onApprove={vi.fn()} onReject={vi.fn()} />);
    expect(screen.getByRole("button", { name: /approve/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reject/i })).toBeInTheDocument();
  });

  it("does not mutate its own DOM over time (no self-driving activity)", () => {
    vi.useFakeTimers();
    const e: AgentEvent = { kind: "agent_started", sessionId: "s", step: 1, agentName: "IntentAgent", summary: "Reading the request", payload: {}, timestamp: at };
    const { container } = render(<AgentEventItem event={e} />);
    const before = container.innerHTML;
    act(() => vi.advanceTimersByTime(10_000));
    expect(container.innerHTML).toBe(before);
    vi.useRealTimers();
  });
});
