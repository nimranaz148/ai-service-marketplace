"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AuthShell } from "@/components/marketing/auth-shell";

export default function ProviderSignupPage() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("Sector G-13, Islamabad");
  const [category, setCategory] = useState("AC Technician & HVAC");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setError(await signup({
      name,
      email,
      password,
      role: "provider",
      phone: phone || "+92 301 5554321",
      area,
      category,
    }));
  };

  const fieldClass =
    "w-full rounded-md border border-hairline bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]";

  return (
    <AuthShell
      kicker="Provider onboarding"
      title="Register as a provider"
      subtitle="Tell us your trade and your base area to start a provider application."
      footer={<>Atelier provider guild. Domestic master technicians.</>}
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
            placeholder="e.g. Tariq Mehmood"
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
            placeholder="e.g. tariq.hvac@gmail.com"
            className={fieldClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="category" className="block text-sm font-medium text-ink">
            Primary trade
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={fieldClass + " cursor-pointer appearance-none"}
          >
            <option value="AC Technician & HVAC">AC Technician &amp; HVAC</option>
            <option value="Solar & Inverter Engineer">Solar &amp; Inverter Engineer</option>
            <option value="Hydro Plumbing & Sanitary">Hydro Plumbing &amp; Sanitary</option>
            <option value="Automotive ECU & OBD2">Automotive ECU &amp; OBD2</option>
            <option value="Academic STEM Mentorship">Academic STEM Mentorship</option>
            <option value="Deep Sanitization & Steam">Deep Sanitization &amp; Steam</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="area" className="block text-sm font-medium text-ink">
            Base city / sector
          </label>
          <select
            id="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className={fieldClass + " cursor-pointer appearance-none"}
          >
            <option value="Sector G-13, Islamabad">Sector G-13, Islamabad</option>
            <option value="Sector F-10, Islamabad">Sector F-10, Islamabad</option>
            <option value="DHA Phase 5, Lahore">DHA Phase 5, Lahore</option>
            <option value="Johar Town, Lahore">Johar Town, Lahore</option>
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
          Submit provider application
        </button>
      </form>

      <div className="mt-5 text-center text-xs text-ink-muted">
        Already registered?{" "}
        <Link href="/provider/login" className="font-medium text-ink hover:underline">
          Sign in here
        </Link>
      </div>
    </AuthShell>
  );
}
