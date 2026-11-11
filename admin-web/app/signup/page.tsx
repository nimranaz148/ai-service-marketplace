"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AuthShell } from "@/components/marketing/auth-shell";

export default function CustomerSignupPage() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("Sector F-10, Islamabad");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setError(await signup({
      name,
      email,
      password,
      role: "customer",
      phone: phone || "+92 300 1234567",
      area,
    }));
  };

  const fieldClass =
    "w-full rounded-md border border-hairline bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";

  return (
    <AuthShell
      kicker="Homeowner onboarding"
      title="Create customer account"
      subtitle="Get access to verified providers with a clear price before anything is booked."
      footer={<>Atelier concierge network. Verified domestic trades.</>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-sm font-medium text-ink">
            Full legal name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Zubair Khan"
            className={fieldClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-ink">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. zubair.k@gmail.com"
            className={fieldClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="phone" className="block text-sm font-medium text-ink">
            Mobile number (for OTP tokens)
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+92 300 1234567"
            className={fieldClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="area" className="block text-sm font-medium text-ink">
            Premises city / sector
          </label>
          <select
            id="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className={fieldClass + " cursor-pointer appearance-none"}
          >
            <option value="Sector F-10, Islamabad">Sector F-10, Islamabad</option>
            <option value="Sector G-13, Islamabad">Sector G-13, Islamabad</option>
            <option value="Sector E-11, Islamabad">Sector E-11, Islamabad</option>
            <option value="DHA Phase 5, Lahore">DHA Phase 5, Lahore</option>
            <option value="Gulberg III, Lahore">Gulberg III, Lahore</option>
            <option value="Clifton Block 2, Karachi">Clifton Block 2, Karachi</option>
            <option value="Gulshan-e-Iqbal, Karachi">Gulshan-e-Iqbal, Karachi</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-ink">
            Password (min 8 characters)
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />
        </div>

        {error ? (
          <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-[var(--accent-strong-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Complete registration
        </button>
      </form>

      <div className="mt-5 rounded-md border border-hairline bg-surface p-3 text-center text-xs text-ink-muted">
        Are you a provider or technician?{" "}
        <Link href="/provider/signup" className="font-medium text-ink hover:underline">
          Apply as provider
        </Link>
      </div>

      <div className="mt-4 text-center text-xs text-ink-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-ink hover:underline">
          Sign in here
        </Link>
      </div>
    </AuthShell>
  );
}
