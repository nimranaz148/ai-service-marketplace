import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthGate, PersonaProvider } from "./auth-gate";

vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard/admin" }));

describe("AuthGate (Phase-1 stub)", () => {
  it("blocks a customer persona on an admin route", () => {
    render(
      <PersonaProvider initialRole="customer">
        <AuthGate><div>secret admin content</div></AuthGate>
      </PersonaProvider>,
    );
    expect(screen.queryByText("secret admin content")).not.toBeInTheDocument();
    expect(screen.getByText(/not authorised/i)).toBeInTheDocument();
  });

  it("allows an admin persona on an admin route", () => {
    render(
      <PersonaProvider initialRole="admin">
        <AuthGate><div>secret admin content</div></AuthGate>
      </PersonaProvider>,
    );
    expect(screen.getByText("secret admin content")).toBeInTheDocument();
  });
});
