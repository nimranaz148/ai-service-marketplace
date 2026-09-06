"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  User,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomerSignupPage() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("Sector F-10, Islamabad");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    signup({
      name,
      email,
      role: "customer",
      phone: phone || "+92 300 1234567",
      area,
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F4F4F6] flex flex-col justify-between relative overflow-hidden font-body selection:bg-[#0054F9] selection:text-white">
      {/* Ambient background glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#0054F9]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#0054F9]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 sm:px-12 py-6 flex items-center justify-between border-b border-white/8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-[#0054F9] text-white flex items-center justify-center font-display font-bold text-sm shadow-[0_0_15px_rgba(0,84,249,0.4)] group-hover:scale-105 transition-transform">
            C
          </div>
          <div>
            <span className="font-display font-bold text-base text-white block leading-none">
              CATALIS ATELIER
            </span>
            <span className="font-code text-[10px] text-zinc-400 block mt-0.5">
              Client Account Creation
            </span>
          </div>
        </Link>

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors font-medium px-3 py-1.5 rounded-full border border-white/5 hover:border-white/10"
        >
          <ChevronLeft size={14} />
          <span>Already registered? Sign In</span>
        </Link>
      </header>

      {/* Main Form Center */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#111118]/90 border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="catalis-badge mb-3">
              <Sparkles size={12} className="text-[#0054F9]" />
              <span>HOMEOWNER ONBOARDING</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Create Customer Account
            </h1>
            <p className="font-body text-xs sm:text-sm text-zinc-400 mt-1.5">
              Get immediate access to verified master artisans with automated escrow assurance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-code uppercase text-zinc-400 mb-1.5 font-semibold">
                Full Legal Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Zubair Khan"
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-4 py-3 pl-11 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#0054F9] transition-colors"
                />
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-code uppercase text-zinc-400 mb-1.5 font-semibold">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. zubair.k@gmail.com"
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-4 py-3 pl-11 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#0054F9] transition-colors"
                />
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-code uppercase text-zinc-400 mb-1.5 font-semibold">
                Mobile Number (for OTP tokens)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-4 py-3 pl-11 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#0054F9] transition-colors"
                />
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-code uppercase text-zinc-400 mb-1.5 font-semibold">
                Premises City / Sector
              </label>
              <div className="relative">
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-4 py-3 pl-11 text-sm text-white focus:outline-none focus:border-[#0054F9] transition-colors appearance-none cursor-pointer"
                >
                  <option value="Sector F-10, Islamabad">Sector F-10, Islamabad</option>
                  <option value="Sector G-13, Islamabad">Sector G-13, Islamabad</option>
                  <option value="Sector E-11, Islamabad">Sector E-11, Islamabad</option>
                  <option value="DHA Phase 5, Lahore">DHA Phase 5, Lahore</option>
                  <option value="Gulberg III, Lahore">Gulberg III, Lahore</option>
                  <option value="Clifton Block 2, Karachi">Clifton Block 2, Karachi</option>
                  <option value="Gulshan-e-Iqbal, Karachi">Gulshan-e-Iqbal, Karachi</option>
                </select>
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

            <button
              type="submit"
              className="catalis-btn catalis-btn-primary w-full py-3.5 text-sm font-display font-bold shadow-[0_0_25px_rgba(0,84,249,0.35)] mt-2"
            >
              <span>Complete Registration</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Artisan supply link */}
          <div className="mt-5 p-3 rounded-2xl bg-[#0A0A0F] border border-white/8 text-center">
            <span className="text-xs text-zinc-400 font-body">
              Are you an artisan or technician?{" "}
              <Link href="/provider/signup" className="text-[#D4A843] hover:underline font-semibold inline-flex items-center gap-1">
                <Wrench size={12} /> Apply as Provider
              </Link>
            </span>
          </div>

          <div className="text-center mt-4 text-xs text-zinc-400 font-body">
            Already have an account?{" "}
            <Link href="/login" className="text-[#0054F9] hover:underline font-semibold">
              Sign in here
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center text-xs font-code text-zinc-500 border-t border-white/8">
        Catalis Atelier AI Concierge Network &copy; 2026. High-assurance domestic trade dispatch.
      </footer>
    </div>
  );
}
