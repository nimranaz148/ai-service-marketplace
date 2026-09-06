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
    <div className="min-h-screen bg-[#090E0C] text-[#F2F7F4] flex flex-col justify-between relative overflow-hidden font-body selection:bg-[#34D399] selection:text-[#090E0C]">
      {/* Ambient background glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#34D399]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#162D23]/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 sm:px-12 py-6 flex items-center justify-between border-b border-[#1C2C24]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#162D23] border border-[#2A493A] text-[#34D399] flex items-center justify-center font-display font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            A
          </div>
          <div>
            <span className="font-display font-bold text-base text-[#F2F7F4] block leading-none">
              ATELIER AI
            </span>
            <span className="font-code text-[10px] text-[#6B877B] block mt-0.5">
              Client Account Creation
            </span>
          </div>
        </Link>

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-[#8EAAA0] hover:text-[#34D399] transition-colors font-medium px-3 py-1.5 rounded-xl border border-transparent hover:border-[#1E3328]"
        >
          <ChevronLeft size={14} />
          <span>Already registered? Sign In</span>
        </Link>
      </header>

      {/* Main Form Center */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#0D1612]/90 border border-[#1F3329] rounded-3xl p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#162920] border border-[#254234] text-[#34D399] text-[11px] font-code font-semibold mb-3">
              <Sparkles size={12} />
              <span>HOMEOWNER ONBOARDING</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F2F7F4] tracking-tight">
              Create Client Account
            </h1>
            <p className="font-body text-xs sm:text-sm text-[#A3B8AF] mt-1.5">
              Get immediate access to verified master artisans and conversational AI dispatch.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-code uppercase text-[#8EAAA0] mb-1.5 font-semibold">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Zubair Khan"
                  className="w-full bg-[#090E0C] border border-[#1E3026] rounded-2xl px-4 py-3 pl-11 text-sm text-[#F2F7F4] placeholder-[#577063] focus:outline-none focus:border-[#34D399] transition-colors"
                />
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#577063]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-code uppercase text-[#8EAAA0] mb-1.5 font-semibold">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. zubair.k@gmail.com"
                  className="w-full bg-[#090E0C] border border-[#1E3026] rounded-2xl px-4 py-3 pl-11 text-sm text-[#F2F7F4] placeholder-[#577063] focus:outline-none focus:border-[#34D399] transition-colors"
                />
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#577063]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-code uppercase text-[#8EAAA0] mb-1.5 font-semibold">
                  Phone (WhatsApp)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full bg-[#090E0C] border border-[#1E3026] rounded-2xl px-3.5 py-3 text-xs text-[#F2F7F4] placeholder-[#577063] focus:outline-none focus:border-[#34D399]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-code uppercase text-[#8EAAA0] mb-1.5 font-semibold">
                  Primary Sector / Area
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Sector F-10, Islamabad"
                    className="w-full bg-[#090E0C] border border-[#1E3026] rounded-2xl px-3.5 py-3 text-xs text-[#F2F7F4] placeholder-[#577063] focus:outline-none focus:border-[#34D399]"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#34D399] hover:bg-[#2BB380] text-[#090E0C] font-display font-extrabold text-sm rounded-2xl shadow-[0_4px_20px_rgba(52,211,153,0.3)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 mt-2"
            >
              <span>Create Account & Open Concierge</span>
              <ArrowRight size={16} />
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-[#8EAAA0]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#34D399] font-bold hover:underline">
              Sign In here
            </Link>
          </div>

          <div className="mt-5 pt-4 border-t border-[#182620] text-center text-[11px] text-[#8EAAA0]">
            Are you an artisan or technician wanting to receive jobs?{" "}
            <Link href="/provider/signup" className="text-[#D4A843] font-bold hover:underline block mt-0.5">
              Register as Master Artisan (/provider/signup) →
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 px-6 py-4 text-center text-xs font-code text-[#516E61] border-t border-[#14221A]">
        Atelier AI Client Concierge Network
      </footer>
    </div>
  );
}
