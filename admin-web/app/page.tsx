import { MarketingRoot } from "@/components/marketing/marketing-root";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { Hero } from "@/components/marketing/hero";
import { AgentBeat } from "@/components/marketing/agent-beat";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { TradesCoverage } from "@/components/marketing/trades-coverage";
import { Proof } from "@/components/marketing/proof";
import { PricingExplainer } from "@/components/marketing/pricing-explainer";
import { FinalCta } from "@/components/marketing/final-cta";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function HomePage() {
  return (
    <MarketingRoot>
      <MarketingNav />
      <main id="content">
        <Hero />
        <AgentBeat />
        <HowItWorks />
        <TradesCoverage />
        <Proof />
        <PricingExplainer />
        <FinalCta />
      </main>
      <MarketingFooter />
    </MarketingRoot>
  );
}
