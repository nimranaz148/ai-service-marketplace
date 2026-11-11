import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatTile } from "./stat-tile";

describe("StatTile", () => {
  it("renders value and label", () => {
    render(<StatTile label="Bookings today" value={12} />);
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Bookings today")).toBeInTheDocument();
  });

  it("renders an em dash and 'no data yet' when state is no-data, never a number", () => {
    render(<StatTile label="GMV" value={0} state="no-data" />);
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByText(/no data yet/i)).toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("renders a skeleton and no value when loading", () => {
    render(<StatTile label="GMV" value={999} state="loading" />);
    expect(screen.queryByText("999")).not.toBeInTheDocument();
    expect(screen.getByTestId("stat-tile-skeleton")).toBeInTheDocument();
  });
});
