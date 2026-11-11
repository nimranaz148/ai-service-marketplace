import { describe, it, expect } from "vitest";
import { personas, personaList, cities, providers, providerSlots, bookings, sessions } from "./index";
import { isAgentEvent } from "@/lib/contracts";

describe("fixtures referential integrity", () => {
  it("has exactly one persona per role", () => {
    expect(personaList.map((p) => p.role).sort()).toEqual(["admin", "customer", "provider"]);
  });

  it("the provider persona exists in the provider roster as the same identity", () => {
    const match = providers.find((p) => p.name === personas.provider.name);
    expect(match, "provider persona must appear in roster").toBeTruthy();
    expect(match!.category).toBe(personas.provider.category);
    expect(match!.city).toBe(personas.provider.city);
  });

  it("provider names are unique", () => {
    expect(new Set(providers.map((p) => p.name)).size).toBe(providers.length);
  });

  it("every provider references a known city id", () => {
    const ids = new Set(cities.map((c) => c.id));
    for (const p of providers) expect(ids.has(p.city)).toBe(true);
  });

  it("every slot references a known provider", () => {
    const ids = new Set(providers.map((p) => p.id));
    for (const s of providerSlots) expect(ids.has(s.providerId)).toBe(true);
  });

  it("every booking references a real customer, provider, and slot, and covers all statuses", () => {
    const providerIds = new Set(providers.map((p) => p.id));
    const slotIds = new Set(providerSlots.map((s) => s.id));
    for (const b of bookings) {
      expect(b.customerId).toBe(personas.customer.id);
      expect(providerIds.has(b.providerId)).toBe(true);
      expect(slotIds.has(b.slotId)).toBe(true);
    }
    expect(new Set(bookings.map((b) => b.status))).toEqual(
      new Set(["confirmed", "en_route", "arrived", "completed", "cancelled"]),
    );
  });

  it("sample sessions carry valid events including a question and an approval", () => {
    const kinds = sessions.flatMap((s) => s.events.map((e) => e.kind));
    expect(sessions.every((s) => s.events.every(isAgentEvent))).toBe(true);
    expect(kinds).toContain("question_required");
    expect(kinds).toContain("approval_required");
  });
});
