import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataTable } from "./data-table";

const columns = [
  { key: "name", header: "Name" },
  { key: "n", header: "Jobs", align: "right" as const },
];

describe("DataTable", () => {
  it("renders rows in ready state", () => {
    render(
      <DataTable
        columns={columns}
        rows={[{ id: "1", name: "Tariq", n: 142 }]}
        getRowKey={(r) => r.id}
        renderRow={(r) => [<span key="a">{r.name}</span>, <span key="b">{r.n}</span>]}
      />,
    );
    expect(screen.getByText("Tariq")).toBeInTheDocument();
    expect(screen.getByText("142")).toBeInTheDocument();
  });

  it("shows the empty state when state is empty", () => {
    render(
      <DataTable
        columns={columns}
        rows={[]}
        state="empty"
        emptyTitle="No providers"
        getRowKey={(r: { id: string }) => r.id}
        renderRow={() => []}
      />,
    );
    expect(screen.getByText("No providers")).toBeInTheDocument();
  });

  it("renders skeleton rows when loading and no data text", () => {
    render(
      <DataTable
        columns={columns}
        rows={[]}
        state="loading"
        getRowKey={(r: { id: string }) => r.id}
        renderRow={() => []}
      />,
    );
    expect(screen.getAllByTestId("data-table-skeleton-row").length).toBe(5);
  });
});
