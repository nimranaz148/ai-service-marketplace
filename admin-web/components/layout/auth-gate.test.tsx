import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthGate, PersonaProvider } from "./auth-gate";

vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard/admin" }));

// PersonaProvider now derives its role from the real auth context. Mocking useAuth
// (rather than mounting AuthProvider, which needs a router + localStorage) keeps the
// RBAC assertions about AuthGate itself while exercising the real role source.
const mockAuth = vi.hoisted(() => ({ current: null as { role: string } | null }));
vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({ user: mockAuth.current }),
}));

beforeEach(() => {
  mockAuth.current = null;
  localStorage.clear();
});

describe("AuthGate (Phase-1 stub)", () => {
  it("blocks a customer persona on an admin route", () => {
    mockAuth.current = { role: "customer" };
    render(
      <PersonaProvider>
        <AuthGate><div>secret admin content</div></AuthGate>
      </PersonaProvider>,
    );
    expect(screen.queryByText("secret admin content")).not.toBeInTheDocument();
    expect(screen.getByText(/not authorised/i)).toBeInTheDocument();
  });

  it("allows an admin persona on an admin route", () => {
    mockAuth.current = { role: "admin" };
    render(
      <PersonaProvider>
        <AuthGate><div>secret admin content</div></AuthGate>
      </PersonaProvider>,
    );
    expect(screen.getByText("secret admin content")).toBeInTheDocument();
  });

  it("falls back to initialRole when no user is signed in", () => {
    mockAuth.current = null;
    render(
      <PersonaProvider initialRole="admin">
        <AuthGate><div>secret admin content</div></AuthGate>
      </PersonaProvider>,
    );
    expect(screen.getByText("secret admin content")).toBeInTheDocument();
  });
});
