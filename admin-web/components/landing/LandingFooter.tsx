"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, MapPin, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function LandingFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    toast.success("Thank you for subscribing to Atelier AI Dispatch updates!");
  };

  return (
    <footer className="pt-16 pb-12 px-4 sm:px-8 border-t border-white/8 bg-[#07070B] text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Main Footer Layout (Catalis footer_layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Brand & Newsletter (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0054F9] text-white flex items-center justify-center font-display font-black text-sm shadow-[0_0_15px_rgba(0,84,249,0.5)]">
                A
              </div>
              <span className="font-display text-lg font-extrabold tracking-tight text-white">
                ATELIER<span className="text-[#0054F9]">.AI</span>
              </span>
            </Link>

            <p className="font-body text-xs text-zinc-400 max-w-sm leading-relaxed">
              Pakistan's first autonomous multi-agent concierge network. 
              Delivering verified master artisans for HVAC, electrical, and plumbing repairs with sub-second dispatch.
            </p>

            {/* Newsletter Subscription Form (Catalis footer_form) */}
            <div className="space-y-2">
              <span className="text-xs font-display font-bold text-white block">
                Subscribe to our newsletter
              </span>
              {subscribed ? (
                <div className="text-xs text-[#0054F9] font-code flex items-center gap-1.5 p-3 rounded-full bg-[#0054F9]/10 border border-[#0054F9]/30">
                  <CheckCircle2 size={14} />
                  <span>Subscription confirmed. Thank you!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center p-1.5 rounded-full bg-[#12121A] border border-white/10 max-w-sm">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent px-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="catalis-btn catalis-btn-primary py-2 px-4 text-xs shrink-0 font-bold"
                  >
                    <span>Get Started</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right: Multi-Column Links (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs font-body">
            {/* Column 1 */}
            <div className="space-y-3">
              <span className="font-display font-bold text-white text-xs uppercase tracking-wider block">
                Platform
              </span>
              <ul className="space-y-2 text-zinc-400">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#benefits" className="hover:text-white transition-colors">Core Benefits</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">5-Agent Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Plans</a></li>
                <li><Link href="/services" className="hover:text-white transition-colors">AI Dispatch Sandbox</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <span className="font-display font-bold text-white text-xs uppercase tracking-wider block">
                Persona Gateways
              </span>
              <ul className="space-y-2 text-zinc-400">
                <li><Link href="/login" className="hover:text-white transition-colors">Customer Login</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Client Onboarding</Link></li>
                <li><Link href="/provider/login" className="hover:text-[#D4A843] transition-colors">Master Artisan Login</Link></li>
                <li><Link href="/provider/signup" className="hover:text-[#D4A843] transition-colors">Trade Registration</Link></li>
                <li><Link href="/admin/login" className="hover:text-white transition-colors font-code">Admin Terminal</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-3">
              <span className="font-display font-bold text-white text-xs uppercase tracking-wider block">
                Active Metros
              </span>
              <ul className="space-y-2 text-zinc-400">
                <li className="flex items-center gap-1.5"><MapPin size={10} className="text-[#0054F9]" /> Islamabad & Rawalpindi</li>
                <li className="flex items-center gap-1.5"><MapPin size={10} className="text-[#0054F9]" /> Karachi Metro Clusters</li>
                <li className="flex items-center gap-1.5"><MapPin size={10} className="text-[#0054F9]" /> Lahore Urban Core</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-code text-zinc-500">
          <div>
            © {new Date().getFullYear()} Atelier AI Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Escrow Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
