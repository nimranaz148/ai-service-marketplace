"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AuthShell } from "@/components/marketing/auth-shell";

export default function CustomerLoginPage() {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError(await login(email, password, "customer"));
  };

  return (
    <AuthShell
      kicker="Client concierge access"
      title="Customer sign in"
      subtitle="Track your active bookings, view verified providers, and manage premises."
      footer={<>Atelier concierge network. Verified domestic trades.</>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-ink">
            Email or mobile number
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. zubair.k@gmail.com"
            className="w-full rounded-md border border-hairline bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-ink">
              Password
            </label>
            <a href="#" className="text-xs text-ink-muted hover:text-ink">
              Forgot?
            </a>
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
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
          Access concierge hub
        </button>
      </form>

      <div className="mt-6 border-t border-hairline pt-5">
        <span className="mb-2 block text-center text-xs font-medium uppercase tracking-wide text-ink-muted">
          Quick 1-click persona login
        </span>
        <button
          type="button"
          onClick={async () => setError(await loginAsDemo("customer"))}
          className="flex w-full items-center justify-between rounded-md border border-hairline bg-surface-raised p-3 text-left transition-colors hover:border-accent"
        >
          <span className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-hairline text-xs font-semibold text-ink">
              ZK
            </span>
            <span>
              <span className="block text-xs font-semibold text-ink">
                Instant demo: Zubair Khan (Customer)
              </span>
              <span className="block text-xs text-ink-muted">
                Customer persona · demo dataset
              </span>
            </span>
          </span>
        </button>
      </div>

      <div className="mt-5 rounded-md border border-hairline bg-surface p-3 text-center">
        <span className="block text-xs text-ink-muted">
          Looking for provider supply or admin command?
        </span>
        <div className="mt-1.5 flex items-center justify-center gap-3 text-xs font-medium">
          <Link href="/provider/login" className="text-ink-muted hover:text-ink">
            Provider login
          </Link>
          <span className="text-ink-muted">·</span>
          <Link href="/admin/login" className="text-ink-muted hover:text-ink">
            Admin login
          </Link>
        </div>
      </div>

      <div className="mt-5 text-center text-xs text-ink-muted">
        New homeowner?{" "}
        <Link href="/signup" className="font-medium text-ink hover:underline">
          Create an account
        </Link>
      </div>
    </AuthShell>
  );
}
