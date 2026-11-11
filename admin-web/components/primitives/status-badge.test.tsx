import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("renders a known booking status with its label", () => {
    render(<StatusBadge status="en_route" />);
    expect(screen.getByText("En route")).toBeInTheDocument();
  });

  it("renders an availability status", () => {
    render(<StatusBadge status="online" />);
    expect(screen.getByText("Online")).toBeInTheDocument();
  });

  it("falls back to a neutral badge with the raw value for unknown status", () => {
    render(<StatusBadge status="teleporting" />);
    expect(screen.getByText("teleporting")).toBeInTheDocument();
  });
});
