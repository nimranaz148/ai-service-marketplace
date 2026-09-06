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
    <div className="min-h-screen bg-[#090E0C] text-[#F2F7F4] flex flex-col justify-between relative overflow-hidden font-body selection:bg-[#D4A843] selection:text-[#090E0C]">
      {/* Background glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#D4A843]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#3D3017]/30 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 sm:px-12 py-6 flex items-center justify-between border-b border-[#292212]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#292212] border border-[#473B1F] text-[#D4A843] flex items-center justify-center font-display font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            <Wrench size={16} />
          </div>
          <div>
            <span className="font-display font-bold text-base text-[#F2F7F4] block leading-none">
              ATELIER ARTISAN
            </span>
            <span className="font-code text-[10px] text-[#D4A843] block mt-0.5 font-semibold">
              Artisan Trade Onboarding
            </span>
          </div>
        </Link>

        <Link
          href="/provider/login"
          className="inline-flex items-center gap-1.5 text-xs text-[#8EAAA0] hover:text-[#D4A843] transition-colors font-medium px-3 py-1.5 rounded-xl border border-transparent hover:border-[#3D3017]"
        >
          <ChevronLeft size={14} />
          <span>Already registered? Sign In</span>
        </Link>
      </header>

      {/* Main Form Center */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#120F0A]/90 border border-[#3D3017] rounded-3xl p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#292212] border border-[#473B1F] text-[#D4A843] text-[11px] font-code font-bold mb-3">
              <Award size={12} />
              <span>JOIN MASTER ARTISAN ROSTER</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F2F7F4] tracking-tight">
              Register Your Trade
            </h1>
            <p className="font-body text-xs sm:text-sm text-[#A3B8AF] mt-1.5">
              Receive verified client dispatches across Islamabad, Karachi, and Lahore with direct payments.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-code uppercase text-[#D4A843] mb-1.5 font-semibold">
                Trade Specialty *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0A0805] border border-[#2B2313] rounded-2xl px-4 py-3 text-sm text-[#F2F7F4] focus:outline-none focus:border-[#D4A843]"
              >
                <option value="AC Technician & HVAC">AC Technician & HVAC</option>
                <option value="Master Electrician & UPS">Master Electrician & Solar UPS</option>
                <option value="Plumber & Hydro Pressure">Plumber & Hydro Pressure</option>
                <option value="Master Carpenter & Wood Restoration">Master Carpenter & Wood Restoration</option>
                <option value="Smart CCTV & Access Control">Smart CCTV & Access Control</option>
                <option value="Solar Hybrid Inverter Specialist">Solar Hybrid Inverter Specialist</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-code uppercase text-[#D4A843] mb-1.5 font-semibold">
                Full Legal Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full bg-[#0A0805] border border-[#2B2313] rounded-2xl px-4 py-3 pl-11 text-sm text-[#F2F7F4] placeholder-[#57492D] focus:outline-none focus:border-[#D4A843]"
                />
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#57492D]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-code uppercase text-[#D4A843] mb-1.5 font-semibold">
                Artisan Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. tariq.hvac@artisan.atelier.ai"
                  className="w-full bg-[#0A0805] border border-[#2B2313] rounded-2xl px-4 py-3 pl-11 text-sm text-[#F2F7F4] placeholder-[#57492D] focus:outline-none focus:border-[#D4A843]"
                />
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#57492D]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-code uppercase text-[#D4A843] mb-1.5 font-semibold">
                  Phone (WhatsApp)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 301 5554321"
                  className="w-full bg-[#0A0805] border border-[#2B2313] rounded-2xl px-3.5 py-3 text-xs text-[#F2F7F4] placeholder-[#57492D] focus:outline-none focus:border-[#D4A843]"
                />
              </div>

              <div>
                <label className="block text-xs font-code uppercase text-[#D4A843] mb-1.5 font-semibold">
                  Operating Area
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Sector G-13, Islamabad"
                  className="w-full bg-[#0A0805] border border-[#2B2313] rounded-2xl px-3.5 py-3 text-xs text-[#F2F7F4] placeholder-[#57492D] focus:outline-none focus:border-[#D4A843]"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#D4A843] hover:bg-[#C29633] text-[#090E0C] font-display font-extrabold text-sm rounded-2xl shadow-[0_4px_20px_rgba(212,168,67,0.3)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 mt-2"
            >
              <span>Submit & Open Artisan HUD</span>
              <ArrowRight size={16} />
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-[#8EAAA0]">
            Already have an active artisan roster account?{" "}
            <Link href="/provider/login" className="text-[#D4A843] font-bold hover:underline">
              Sign In here
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 px-6 py-4 text-center text-xs font-code text-[#5E5136] border-t border-[#1F190C]">
        Atelier AI Artisan Supply Network • Registered Providers Guarantee
      </footer>
    </div>
  );
}
