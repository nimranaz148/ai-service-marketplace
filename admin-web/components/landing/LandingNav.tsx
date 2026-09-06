"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowUpRight, Compass, Shield, Sparkles, Menu, X, UserCheck, LogIn, Wrench } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function LandingNav() {
  const { user, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // GSAP magnetic hover physics on CTA button
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      gsap.to(el, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: "power2.out" });
    };

    const onMouseLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);
    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-4 transition-all duration-300">
      <nav
        className={`max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5 rounded-2xl transition-all duration-300 ${
          scrolled
            ? "bg-[#0D1612]/90 backdrop-blur-md border border-[#20332B] shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
            : "bg-[#0D1612]/70 backdrop-blur-sm border border-[#1A2C23]/80 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
        }`}
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group text-decoration-none">
          <div className="w-8 h-8 rounded-lg bg-[#162D23] border border-[#2B493B] text-[#34D399] flex items-center justify-center font-display font-bold text-sm tracking-wider shadow-sm group-hover:scale-105 transition-transform duration-200">
            A
          </div>
          <div>
            <span className="font-display text-[17px] font-bold tracking-tight text-[#F2F7F4] block leading-none">
              ATELIER AI
            </span>
            <span className="font-body text-[10px] uppercase font-semibold tracking-wider text-[#6B877B] block mt-0.5">
              Service Concierge
            </span>
          </div>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-7">
          <a
            href="#symphony"
            className="font-body text-[13px] font-medium text-[#A3B8AF] hover:text-[#F2F7F4] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#34D399] hover:after:w-full after:transition-all after:duration-200"
          >
            5-Agent Pipeline
          </a>
          <a
            href="#roster"
            className="font-body text-[13px] font-medium text-[#A3B8AF] hover:text-[#F2F7F4] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#34D399] hover:after:w-full after:transition-all after:duration-200"
          >
            Verified Roster
          </a>
          <a
            href="#voice-engine"
            className="font-body text-[13px] font-medium text-[#A3B8AF] hover:text-[#F2F7F4] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#34D399] hover:after:w-full after:transition-all after:duration-200"
          >
            Roman Urdu Voice
          </a>
          <a
            href="#audit-ledger"
            className="font-body text-[13px] font-medium text-[#A3B8AF] hover:text-[#F2F7F4] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#34D399] hover:after:w-full after:transition-all after:duration-200"
          >
            Trace Ledger
          </a>
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#162D23] border border-[#2B493B] text-[#34D399] text-[11px] font-medium font-body">
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
            <span>Active: ISB · KHI · LHE</span>
          </div>

          {isAuthenticated ? (
            <Link href="/dashboard">
              <button
                ref={ctaRef}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#162D23] hover:bg-[#1E3B2E] border border-[#34D399]/60 text-[#34D399] text-[13px] font-bold font-display tracking-tight shadow-[0_0_20px_rgba(52,211,153,0.2)] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Dashboard ({user?.role?.toUpperCase()})</span>
                <ArrowUpRight size={14} className="text-[#34D399]" />
              </button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/provider/login"
                className="hidden lg:inline-flex items-center gap-1.5 text-xs font-code font-bold text-[#D4A843] hover:text-[#F3CA68] px-3 py-1.5 rounded-xl border border-[#3D3017] bg-[#161209] transition-colors"
              >
                <Wrench size={12} />
                <span>Artisan Portal</span>
              </Link>
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1 text-[13px] font-semibold text-[#A3B8AF] hover:text-[#F2F7F4] px-3 py-2 rounded-xl hover:bg-[#16251F] transition-colors"
              >
                <LogIn size={13} className="text-[#34D399]" />
                <span>Sign In</span>
              </Link>
              <Link href="/signup">
                <button
                  ref={ctaRef}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#34D399] hover:bg-[#2BB380] text-[#090E0C] text-[13px] font-bold font-display tracking-tight shadow-[0_0_20px_rgba(52,211,153,0.3)] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Sign Up</span>
                  <ArrowUpRight size={14} />
                </button>
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 text-[#F2F7F4] hover:bg-[#16251F] rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden mt-2 p-4 bg-[#0D1612] rounded-2xl border border-[#20332B] shadow-2xl flex flex-col gap-3">
          <a
            href="#symphony"
            onClick={() => setMobileOpen(false)}
            className="text-[14px] font-medium text-[#F2F7F4] py-1.5 px-2 rounded-lg hover:bg-[#14231D]"
          >
            5-Agent Pipeline
          </a>
          <a
            href="#roster"
            onClick={() => setMobileOpen(false)}
            className="text-[14px] font-medium text-[#F2F7F4] py-1.5 px-2 rounded-lg hover:bg-[#14231D]"
          >
            Verified Roster
          </a>
          <a
            href="#voice-engine"
            onClick={() => setMobileOpen(false)}
            className="text-[14px] font-medium text-[#F2F7F4] py-1.5 px-2 rounded-lg hover:bg-[#14231D]"
          >
            Roman Urdu Voice
          </a>
          <a
            href="#audit-ledger"
            onClick={() => setMobileOpen(false)}
            className="text-[14px] font-medium text-[#F2F7F4] py-1.5 px-2 rounded-lg hover:bg-[#14231D]"
          >
            Trace Ledger
          </a>
          <div className="pt-2 border-t border-[#1F3329] flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="text-center py-2.5 rounded-xl bg-[#162D23] border border-[#34D399] text-[#34D399] font-bold text-sm"
              >
                Go to Dashboard ({user?.role?.toUpperCase()})
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-2 rounded-xl bg-[#16251F] border border-[#2F5444] text-[#F2F7F4] font-semibold text-sm"
                >
                  Customer Sign In (/login)
                </Link>
                <Link
                  href="/provider/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-2 rounded-xl bg-[#1D170D] border border-[#3D3017] text-[#D4A843] font-semibold text-sm flex items-center justify-center gap-1.5"
                >
                  <Wrench size={13} />
                  <span>Artisan Supply Portal (/provider/login)</span>
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-[#34D399] text-[#090E0C] font-bold text-sm shadow-lg"
                >
                  Sign Up as Homeowner
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
