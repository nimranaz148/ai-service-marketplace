"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AuthShell } from "@/components/marketing/auth-shell";

export default function AdminLoginPage() {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError(await login(email, password, "admin"));
  };

  return (
    <AuthShell
      kicker="Administrator access"
      title="Admin operations login"
      subtitle="Restricted governance console for telemetry, customer/provider CRUD, and AI agents."
      footer={<>Atelier command kernel. Microservices and multi-agent mesh controller.</>}
    >
      <div className="mb-5 rounded-md border border-hairline bg-surface p-3 text-xs text-ink-muted">
        This console is restricted to administrator accounts and reads the demo
        dataset only — no production customer data is reachable from this build.
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-ink">
            Executive SSO / email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@atelier.ai"
            className="w-full rounded-md border border-hairline bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-ink">
            Master security key / password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your security key or password"
            className="w-full rounded-md border border-hairline bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          />
        </div>

        {error ? (
          <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-[var(--accent-strong-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Authenticate terminal
        </button>
      </form>

      <div className="mt-6 border-t border-hairline pt-5">
        <span className="mb-2 block text-center text-xs font-medium uppercase tracking-wide text-ink-muted">
          1-click sandbox bypass
        </span>
        <button
          type="button"
          onClick={async () => setError(await loginAsDemo("admin"))}
          className="flex w-full items-center justify-between rounded-md border border-hairline bg-surface-raised p-3 text-left transition-colors hover:border-accent"
        >
          <span className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-hairline text-xs font-semibold text-ink">
              SA
            </span>
            <span>
              <span className="block text-xs font-semibold text-ink">
                Instant demo: Super Admin Root
              </span>
              <span className="block text-xs text-ink-muted">
                Full CRUD · Telemetry · Agent traces
              </span>
            </span>
          </span>
        </button>
      </div>

      <div className="mt-5 text-center text-xs text-ink-muted">
        Not an admin? Return to{" "}
        <Link href="/login" className="font-medium text-ink hover:underline">
          Customer login
        </Link>{" "}
        or{" "}
        <Link href="/provider/login" className="font-medium text-ink hover:underline">
          Provider login
        </Link>
      </div>
    </AuthShell>
  );
}
