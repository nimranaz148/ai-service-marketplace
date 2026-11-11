"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowUpRight, Sparkles, Menu, X, LogIn, Wrench, Shield, Zap } from "lucide-react";
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

  // Magnetic hover on CTA button
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
        className={`max-w-6xl mx-auto flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 ${
          scrolled
            ? "bg-[#0A0A10]/90 backdrop-blur-xl border border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.8)]"
            : "bg-[#0D0D14]/75 backdrop-blur-md border border-white/8 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
        }`}
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group text-decoration-none">
          <div className="w-8 h-8 rounded-full bg-[#0054F9] text-white flex items-center justify-center font-display font-black text-sm shadow-[0_0_15px_rgba(0,84,249,0.5)] group-hover:scale-105 transition-transform duration-200">
            A
          </div>
          <div>
            <span className="font-display text-[16px] font-extrabold tracking-tight text-white block leading-none">
              ATELIER<span className="text-[#0054F9]">.AI</span>
            </span>
            <span className="font-code text-[9px] uppercase tracking-wider text-zinc-400 block mt-0.5 font-semibold">
              Catalis Concierge
            </span>
          </div>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="#about"
            className="font-body text-[13px] font-medium text-zinc-300 hover:text-white transition-colors py-1 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#0054F9] after:transition-all"
          >
            About
          </a>
          <a
            href="#benefits"
            className="font-body text-[13px] font-medium text-zinc-300 hover:text-white transition-colors py-1 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#0054F9] after:transition-all"
          >
            Benefits
          </a>
          <a
            href="#features"
            className="font-body text-[13px] font-medium text-zinc-300 hover:text-white transition-colors py-1 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#0054F9] after:transition-all"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="font-body text-[13px] font-medium text-zinc-300 hover:text-white transition-colors py-1 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#0054F9] after:transition-all"
          >
            Pricing
          </a>
          <a
            href="#testimonials"
            className="font-body text-[13px] font-medium text-zinc-300 hover:text-white transition-colors py-1 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#0054F9] after:transition-all"
          >
            Reviews
          </a>
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/8 text-zinc-300 text-[11px] font-code font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0054F9] animate-pulse" />
            <span>Active: ISB · KHI · LHE</span>
          </div>

          {isAuthenticated ? (
            <Link href="/dashboard">
              <button
                ref={ctaRef}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover text-xs font-display font-bold py-2 px-4"
              >
                <span>Dashboard ({user?.role?.toUpperCase()})</span>
                <ArrowUpRight size={14} />
              </button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/provider/login"
                className="hidden lg:inline-flex items-center gap-1.5 text-xs font-code font-semibold text-[#D4A843] hover:text-[#F3CA68] px-3 py-1.5 rounded-full border border-[#D4A843]/30 bg-[#D4A843]/5 transition-colors"
              >
                <Wrench size={12} />
                <span>Artisan Portal</span>
              </Link>
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1 text-[13px] font-semibold text-zinc-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors"
              >
                <span>Sign In</span>
              </Link>
              <Link href="/signup">
                <button
                  ref={ctaRef}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover text-xs font-display font-bold py-2 px-4"
                >
                  <span>Get Started</span>
                  <ArrowUpRight size={14} />
                </button>
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden mt-2 p-5 bg-[#0D0D14]/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-3">
          <a
            href="#about"
            onClick={() => setMobileOpen(false)}
            className="text-[14px] font-medium text-zinc-200 py-2 px-3 rounded-xl hover:bg-white/5"
          >
            About
          </a>
          <a
            href="#benefits"
            onClick={() => setMobileOpen(false)}
            className="text-[14px] font-medium text-zinc-200 py-2 px-3 rounded-xl hover:bg-white/5"
          >
            Benefits
          </a>
          <a
            href="#features"
            onClick={() => setMobileOpen(false)}
            className="text-[14px] font-medium text-zinc-200 py-2 px-3 rounded-xl hover:bg-white/5"
          >
            Features
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileOpen(false)}
            className="text-[14px] font-medium text-zinc-200 py-2 px-3 rounded-xl hover:bg-white/5"
          >
            Pricing
          </a>
          <a
            href="#testimonials"
            onClick={() => setMobileOpen(false)}
            className="text-[14px] font-medium text-zinc-200 py-2 px-3 rounded-xl hover:bg-white/5"
          >
            Reviews
          </a>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover w-full py-2.5 text-center text-sm"
              >
                Go to Dashboard ({user?.role?.toUpperCase()})
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-medium text-xs"
                >
                  Customer Sign In (/login)
                </Link>
                <Link
                  href="/provider/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/30 text-[#D4A843] font-medium text-xs flex items-center justify-center gap-1.5"
                >
                  <Wrench size={13} />
                  <span>Artisan Supply Portal (/provider/login)</span>
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover w-full py-2.5 text-center text-xs"
                >
                  Get Started as Client
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
