import type { ProviderCategory } from "./provider";
import type { AgentEvent } from "./agent-event";

export interface IntentResult {
  serviceType: ProviderCategory;
  area: string;
  timePreference: string;
  urgency: "low" | "medium" | "high";
  language: "en" | "ur" | "roman_ur";
}

export interface AgentSession {
  id: string;
  customerId: string;
  rawInput: string;
  language: IntentResult["language"];
  status: "in_progress" | "completed" | "failed";
  startedAt: string;
  intent?: IntentResult;
  events: AgentEvent[];
}
