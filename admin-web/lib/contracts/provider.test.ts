import { describe, it, expect } from "vitest";
import { PROVIDER_CATEGORY_FROM_LABEL, PROVIDER_CATEGORY_LABEL, splitCityArea } from "./provider";

describe("PROVIDER_CATEGORY_FROM_LABEL", () => {
  it("maps a seed label back to its category id", () => {
    expect(PROVIDER_CATEGORY_FROM_LABEL["AC Technician"]).toBe("ac");
  });

  it("round-trips every category", () => {
    for (const [id, label] of Object.entries(PROVIDER_CATEGORY_LABEL)) {
      expect(PROVIDER_CATEGORY_FROM_LABEL[label]).toBe(id);
    }
  });
});

describe("splitCityArea", () => {
  it("splits a combined seed location on the last comma", () => {
    expect(splitCityArea("Sector G-13, Islamabad")).toEqual({ area: "Sector G-13", cityName: "Islamabad" });
    expect(splitCityArea("Gulshan-e-Iqbal, Block 5, Karachi")).toEqual({
      area: "Gulshan-e-Iqbal, Block 5",
      cityName: "Karachi",
    });
  });

  it("returns the whole string as the area when there is no comma", () => {
    expect(splitCityArea("Islamabad")).toEqual({ area: "Islamabad", cityName: "" });
  });
});
