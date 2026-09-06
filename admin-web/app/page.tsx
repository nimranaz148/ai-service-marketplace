"use client";

import React from "react";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { SpatialCardsCanvas } from "@/components/landing/SpatialCardsCanvas";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { JoinCTASection } from "@/components/landing/JoinCTASection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F4F4F6] font-body overflow-x-hidden selection:bg-[#0054F9] selection:text-white">
      {/* 1. Floating Capsule Navbar */}
      <LandingNav />

      {/* 2. Hero Section with 3D floating perspective cards */}
      <HeroSection />

      {/* 3. About Section with Catalis stats grid */}
      <AboutSection />

      {/* 4. Benefits Section (4-Card Bento Grid) */}
      <BenefitsSection />

      {/* 5. Spatial Interactive Showcase (Untouched Preservation) */}
      <SpatialCardsCanvas />

      {/* 6. Sticky Stacking Features Cards */}
      <FeaturesSection />

      {/* 7. Pricing Tiers with Featured Cobalt Plan */}
      <PricingSection />

      {/* 8. Testimonials with Floating Circular Avatars */}
      <TestimonialsSection />

      {/* 9. Grand Finale Join Us CTA Card */}
      <JoinCTASection />

      {/* 10. Catalis Multi-Column Footer with Newsletter */}
      <LandingFooter />
    </div>
  );
}
