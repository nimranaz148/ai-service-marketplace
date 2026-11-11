import type { AgentSession } from "@/lib/contracts";
import { personas } from "./personas";

const cid = personas.customer.id;

export const sessions: AgentSession[] = [
  {
    id: "sess-01",
    customerId: cid,
    rawInput: "Mujhe kal subah Gulshan mein AC technician chahiye, cooling nahi kar raha",
    language: "roman_ur",
    status: "completed",
    startedAt: "2026-09-10T08:29:40Z",
    intent: { serviceType: "ac", area: "Gulshan-e-Iqbal", timePreference: "Tomorrow morning", urgency: "high", language: "roman_ur" },
    events: [
      { kind: "agent_started", sessionId: "sess-01", step: 1, agentName: "IntentAgent", summary: "Reading the request", payload: {}, timestamp: "2026-09-10T08:29:41Z" },
      { kind: "tool_call_started", sessionId: "sess-01", step: 1, agentName: "IntentAgent", toolName: "extract_intent", summary: "Extracting service, area, time", payload: { raw: "…" }, timestamp: "2026-09-10T08:29:41Z" },
      { kind: "tool_call_result", sessionId: "sess-01", step: 1, agentName: "IntentAgent", toolName: "extract_intent", ok: true, summary: "AC Technician · Gulshan-e-Iqbal · tomorrow morning · high urgency", payload: { serviceType: "ac" }, timestamp: "2026-09-10T08:29:42Z", durationMs: 640 },
      { kind: "tool_call_started", sessionId: "sess-01", step: 2, agentName: "DiscoveryAgent", toolName: "find_providers", summary: "Searching Gulshan-e-Iqbal for AC technicians", payload: { area: "Gulshan-e-Iqbal" }, timestamp: "2026-09-10T08:29:42Z" },
      { kind: "info_found", sessionId: "sess-01", step: 2, agentName: "DiscoveryAgent", summary: "3 verified technicians available tomorrow morning", payload: { count: 3 }, timestamp: "2026-09-10T08:29:43Z", durationMs: 410 },
      { kind: "question_required", sessionId: "sess-01", step: 3, agentName: "RankingAgent", question: "Two technicians can come at 9 AM. Do you prefer the highest-rated (Imran Baig, 4.8) or the nearest (2 km away)?", summary: "Needs a preference before ranking", payload: {}, timestamp: "2026-09-10T08:29:44Z" },
      { kind: "approval_required", sessionId: "sess-01", step: 4, agentName: "BookingAgent", action: "Book Imran Baig for tomorrow 9:00 AM at PKR 2,800", summary: "Waiting for confirmation before booking", payload: { providerId: "prov-02", pricePkr: 2800 }, timestamp: "2026-09-10T08:29:58Z" },
      { kind: "tool_call_result", sessionId: "sess-01", step: 4, agentName: "BookingAgent", toolName: "create_booking", ok: true, summary: "Booked · token BK-4821", payload: { token: "BK-4821" }, timestamp: "2026-09-10T08:30:02Z", durationMs: 520 },
      { kind: "agent_completed", sessionId: "sess-01", step: 5, agentName: "FollowupAgent", summary: "Reminder scheduled for 8:00 AM tomorrow", payload: {}, timestamp: "2026-09-10T08:30:03Z" },
    ],
  },
  {
    id: "sess-02",
    customerId: cid,
    rawInput: "F-10 mein pipe leak ho raha hai, abhi chahiye",
    language: "roman_ur",
    status: "failed",
    startedAt: "2026-09-09T21:10:00Z",
    intent: { serviceType: "plumber", area: "Sector F-10", timePreference: "Now", urgency: "high", language: "roman_ur" },
    events: [
      { kind: "agent_started", sessionId: "sess-02", step: 1, agentName: "IntentAgent", summary: "Reading the request", payload: {}, timestamp: "2026-09-09T21:10:01Z" },
      { kind: "tool_call_result", sessionId: "sess-02", step: 1, agentName: "IntentAgent", toolName: "extract_intent", ok: true, summary: "Plumber · Sector F-10 · now · high urgency", payload: {}, timestamp: "2026-09-09T21:10:02Z", durationMs: 590 },
      { kind: "tool_call_started", sessionId: "sess-02", step: 2, agentName: "DiscoveryAgent", toolName: "find_providers", summary: "Searching Sector F-10 for plumbers", payload: { area: "Sector F-10" }, timestamp: "2026-09-09T21:10:02Z" },
      { kind: "tool_call_result", sessionId: "sess-02", step: 2, agentName: "DiscoveryAgent", toolName: "find_providers", ok: false, errorCode: "no_providers", summary: "Search returned no available plumbers", payload: { count: 0 }, timestamp: "2026-09-09T21:10:03Z", durationMs: 310 },
      { kind: "info_found", sessionId: "sess-02", step: 2, agentName: "DiscoveryAgent", summary: "No plumbers available in F-10 after 9 PM", payload: { count: 0 }, timestamp: "2026-09-09T21:10:03Z", durationMs: 380 },
      { kind: "error", sessionId: "sess-02", step: 2, agentName: "DiscoveryAgent", errorCode: "no_providers", summary: "No providers available — suggested trying again at 7 AM", payload: {}, timestamp: "2026-09-09T21:10:03Z" },
    ],
  },
];
