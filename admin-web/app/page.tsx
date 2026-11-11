import { MarketingRoot } from "@/components/marketing/marketing-root";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { Hero } from "@/components/marketing/hero";
import { ServicesGrid } from "@/components/marketing/services-grid";
import { DispatchFilm } from "@/components/marketing/dispatch-film";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Proof } from "@/components/marketing/proof";
import { PricingExplainer } from "@/components/marketing/pricing-explainer";
import { ProviderCta } from "@/components/marketing/provider-cta";
import { FinalCta } from "@/components/marketing/final-cta";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function HomePage() {
  return (
    <MarketingRoot>
      <MarketingNav />
      <main id="content">
        <Hero />
        <ServicesGrid />
        <DispatchFilm />
        <HowItWorks />
        <Proof />
        <PricingExplainer />
        <ProviderCta />
        <FinalCta />
      </main>
      <MarketingFooter />
    </MarketingRoot>
  );
}
