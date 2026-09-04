"use client";

import React from "react";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProofStrip } from "@/components/landing/ProofStrip";
import { SpatialCardsCanvas } from "@/components/landing/SpatialCardsCanvas";
import { AgentSymphony } from "@/components/landing/AgentSymphony";
import { ServiceBentoGrid } from "@/components/landing/ServiceBentoGrid";
import { VoiceShowcase } from "@/components/landing/VoiceShowcase";
import { AuditObservability } from "@/components/landing/AuditObservability";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#090E0C] text-[#F2F7F4] font-body overflow-x-hidden">
      <LandingNav />
      <HeroSection />
      <ProofStrip />
      <SpatialCardsCanvas />
      <AgentSymphony />
      <ServiceBentoGrid />
      <VoiceShowcase />
      <AuditObservability />
      <LandingFooter />
    </div>
  );
}
