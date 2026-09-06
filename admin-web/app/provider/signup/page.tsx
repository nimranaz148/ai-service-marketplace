"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Wrench,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  User,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProviderSignupPage() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("Sector G-13, Islamabad");
  const [category, setCategory] = useState("AC Technician & HVAC");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    signup({
      name,
      email,
      role: "provider",
      phone: phone || "+92 301 5554321",
      area,
      category,
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F4F4F6] flex flex-col justify-between relative overflow-hidden font-body selection:bg-[#D4A843] selection:text-black">
      {/* Background glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#D4A843]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#0054F9]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 sm:px-12 py-6 flex items-center justify-between border-b border-white/8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-[#D4A843]/20 border border-[#D4A843]/40 text-[#D4A843] flex items-center justify-center font-display font-bold text-sm shadow-[0_0_15px_rgba(212,168,67,0.3)] group-hover:scale-105 transition-transform">
            <Wrench size={16} />
          </div>
          <div>
            <span className="font-display font-bold text-base text-white block leading-none">
              CATALIS ARTISAN
            </span>
            <span className="font-code text-[10px] text-[#D4A843] block mt-0.5 font-semibold">
              Artisan Trade Onboarding
            </span>
          </div>
        </Link>

        <Link
          href="/provider/login"
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A843]/15 border border-[#D4A843]/30 text-[#D4A843] text-[11px] font-code font-semibold mb-3">
              <Award size={12} />
              <span>SUPPLY ROSTER ONBOARDING</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Register as Artisan
            </h1>
            <p className="font-body text-xs sm:text-sm text-zinc-400 mt-1.5">
              Join the certified guild, receive automated local jobs, and get guaranteed escrow payouts.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-code uppercase text-zinc-400 mb-1.5 font-semibold">
                Full Legal Name (as per CNIC) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-4 py-3 pl-11 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4A843] transition-colors"
                />
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-code uppercase text-zinc-400 mb-1.5 font-semibold">
                Email Address or Dispatch Notification Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. tariq.hvac@gmail.com"
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-4 py-3 pl-11 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4A843] transition-colors"
                />
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-code uppercase text-zinc-400 mb-1.5 font-semibold">
                Primary Trade Specialty *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4A843] transition-colors appearance-none cursor-pointer"
              >
                <option value="AC Technician & HVAC">AC Technician & HVAC</option>
                <option value="Solar & Inverter Engineer">Solar & Inverter Engineer</option>
                <option value="Hydro Plumbing & Sanitary">Hydro Plumbing & Sanitary</option>
                <option value="Automotive ECU & OBD2">Automotive ECU & OBD2</option>
                <option value="Academic STEM Mentorship">Academic STEM Mentorship</option>
                <option value="Deep Sanitization & Steam">Deep Sanitization & Steam</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-code uppercase text-zinc-400 mb-1.5 font-semibold">
                Operational Base Hub
              </label>
              <div className="relative">
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-[#0A0A0F] border border-white/10 rounded-2xl px-4 py-3 pl-11 text-sm text-white focus:outline-none focus:border-[#D4A843] transition-colors appearance-none cursor-pointer"
                >
                  <option value="Sector G-13, Islamabad">Sector G-13, Islamabad</option>
                  <option value="Sector F-10, Islamabad">Sector F-10, Islamabad</option>
                  <option value="DHA Phase 5, Lahore">DHA Phase 5, Lahore</option>
                  <option value="Johar Town, Lahore">Johar Town, Lahore</option>
                  <option value="Clifton Block 2, Karachi">Clifton Block 2, Karachi</option>
                  <option value="Gulshan-e-Iqbal, Karachi">Gulshan-e-Iqbal, Karachi</option>
                </select>
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              </div>
            </div>

            <button
              type="submit"
              className="catalis-btn w-full py-3.5 text-sm font-display font-bold bg-[#D4A843] text-black hover:bg-[#c49a38] shadow-[0_0_25px_rgba(212,168,67,0.35)] mt-2 flex items-center justify-center gap-2"
            >
              <span>Submit Roster Application</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="text-center mt-5 text-xs text-zinc-400 font-body">
            Already approved?{" "}
            <Link href="/provider/login" className="text-[#D4A843] hover:underline font-semibold">
              Sign in here
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center text-xs font-code text-zinc-500 border-t border-white/8">
        Catalis Artisan Guild &copy; 2026. Empowering Pakistan's domestic master technicians.
      </footer>
    </div>
  );
}
