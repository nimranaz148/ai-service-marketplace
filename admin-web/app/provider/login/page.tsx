"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AuthShell } from "@/components/marketing/auth-shell";

export default function ProviderLoginPage() {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError(await login(email, password, "provider"));
  };

  return (
    <AuthShell
      kicker="Licensed tradesperson access"
      title="Provider partner sign in"
      subtitle="Manage assigned dispatch requests, update your catalog, and view customer previews."
      footer={<>Atelier provider guild. Domestic master technicians.</>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-ink">
            Registered mobile or email
          </label>
          <input
            id="email"
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. tariq.m@provider.pk or 03015554321"
            className="w-full rounded-md border border-hairline bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-ink">
              Secret PIN / password
            </label>
            <a href="#" className="text-xs text-ink-muted hover:text-ink">
              Forgot PIN?
            </a>
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your PIN or password"
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
          Open provider HUD
        </button>
      </form>

      <div className="mt-6 border-t border-hairline pt-5">
        <span className="mb-2 block text-center text-xs font-medium uppercase tracking-wide text-ink-muted">
          Quick 1-click persona login
        </span>
        <button
          type="button"
          onClick={async () => setError(await loginAsDemo("provider"))}
          className="flex w-full items-center justify-between rounded-md border border-hairline bg-surface-raised p-3 text-left transition-colors hover:border-accent"
        >
          <span className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-hairline text-xs font-semibold text-ink">
              TM
            </span>
            <span>
              <span className="block text-xs font-semibold text-ink">
                Instant demo: Tariq Mehmood (Provider)
              </span>
              <span className="block text-xs text-ink-muted">
                AC &amp; HVAC · Islamabad · demo dataset
              </span>
            </span>
          </span>
        </button>
      </div>

      <div className="mt-5 text-center text-xs text-ink-muted">
        Want to offer your craft on Atelier?{" "}
        <Link href="/provider/signup" className="font-medium text-ink hover:underline">
          Register as provider
        </Link>
      </div>
    </AuthShell>
  );
}
