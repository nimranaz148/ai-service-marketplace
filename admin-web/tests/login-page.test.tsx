import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

// useAuth() (and the AuthProvider it needs) both read next/navigation.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/login",
}));

import { AuthProvider } from "@/lib/auth-context";
import CustomerLoginPage from "@/app/login/page";

function renderLogin() {
  return render(
    <AuthProvider>
      <CustomerLoginPage />
    </AuthProvider>,
  );
}

describe("/login", () => {
  it("renders the sign-in form with labelled fields", () => {
    renderLogin();
    expect(screen.getByRole("heading", { name: /customer sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email or mobile number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  });

  it("has no serious/critical a11y violations", async () => {
    const { container } = renderLogin();
    const results = await axe(container);
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious).toEqual([]);
  });
});
