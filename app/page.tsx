import type { Metadata } from "next"

import { LandingNav } from "@/components/features/landing/landing-nav"
import { LandingHero } from "@/components/features/landing/landing-hero"
import { TrustStrip } from "@/components/features/landing/trust-strip"
import { PlatformSection } from "@/components/features/landing/platform-section"
import { HowItWorksSection } from "@/components/features/landing/how-it-works-section"
import { WhySection } from "@/components/features/landing/why-section"
import { ClosingSection } from "@/components/features/landing/closing-section"
import { LandingFooter } from "@/components/features/landing/landing-footer"

export const metadata: Metadata = {
  title:
    "Afrinvest Connect — wallet and verification infrastructure for financial institutions",
  description:
    "Afrinvest Connect gives your business a complete, regulated financial backbone: identity verification, multi-product wallets, and a developer API — all production-ready on day one.",
}

/** Public landing page for Afrinvest Connect. */
export default function Page() {
  return (
    <div className="landing flex min-h-svh flex-col bg-white text-(--ink)">
      <LandingNav />
      <main className="flex-1">
        <LandingHero />
        <TrustStrip />
        <PlatformSection />
        <HowItWorksSection />
        <WhySection />
        <ClosingSection />
      </main>
      <LandingFooter />
    </div>
  )
}
