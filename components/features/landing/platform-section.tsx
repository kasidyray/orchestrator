import type * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { FingerPrintIcon } from "@hugeicons/core-free-icons"

import { Reveal } from "@/components/features/landing/reveal"
import { SectionIntro } from "@/components/features/landing/section-intro"

/** Concentric verification rings around a fingerprint mark. */
function IdentityVignette() {
  return (
    <div className="relative flex size-full items-center justify-center">
      <div className="absolute size-32 rounded-full border border-(--brand)/10" />
      <div className="absolute size-24 rounded-full border border-(--brand)/20" />
      <div className="absolute size-16 rounded-full border border-(--brand)/30" />
      <div className="relative flex size-11 items-center justify-center rounded-full bg-white text-(--brand) shadow-[0_8px_24px_-8px_oklch(0.488_0.19_264/0.5)] ring-1 ring-black/5">
        <HugeiconsIcon icon={FingerPrintIcon} className="size-5" />
      </div>
    </div>
  )
}

/** Overlapping NGN + USD wallet cards. */
function WalletVignette() {
  return (
    <div className="relative flex size-full items-center justify-center">
      <div className="absolute flex h-16 w-28 -translate-x-5 translate-y-2 -rotate-6 flex-col justify-between rounded-lg bg-linear-to-br from-(--brand) to-[oklch(0.45_0.17_290)] p-2.5 shadow-lg">
        <span className="text-[10px] font-semibold text-white/80">NGN</span>
        <span className="text-sm font-semibold text-white">₦</span>
      </div>
      <div className="relative flex h-16 w-28 translate-x-5 rotate-3 flex-col justify-between rounded-lg bg-white p-2.5 shadow-[0_12px_32px_-12px_oklch(0.488_0.19_264/0.45)] ring-1 ring-black/5">
        <span className="text-[10px] font-semibold text-(--gold-deep)">
          USD
        </span>
        <span className="text-sm font-semibold text-(--ink)">$</span>
      </div>
    </div>
  )
}

/** Miniature terminal running a first API call. */
function DeveloperVignette() {
  return (
    <div className="flex size-full items-center justify-center px-6">
      <div className="w-full max-w-56 rounded-lg bg-(--ink) p-3 font-mono text-[10px] leading-relaxed shadow-[0_16px_40px_-16px_oklch(0.22_0.045_270/0.7)]">
        <div className="mb-2 flex gap-1">
          <span className="size-1.5 rounded-full bg-white/20" />
          <span className="size-1.5 rounded-full bg-white/20" />
          <span className="size-1.5 rounded-full bg-white/20" />
        </div>
        <p className="text-white/80">$ curl -X POST /v1/wallets</p>
        <p className="text-[oklch(0.75_0.16_150)]">→ 201 Created</p>
        <p className="text-(--gold)">→ webhook wallet.created</p>
      </div>
    </div>
  )
}

interface Pillar {
  vignette: React.ReactNode
  heading: string
  body: string
}

const PILLARS: Pillar[] = [
  {
    vignette: <IdentityVignette />,
    heading: "Identity and verification",
    body: "Configurable KYC tiers matched to your risk model — from basic BVN checks to full document and liveness verification.",
  },
  {
    vignette: <WalletVignette />,
    heading: "Wallet infrastructure",
    body: "NGN and USD wallets, interest-bearing savings products, and automatic provisioning on customer signup — all configurable from your dashboard.",
  },
  {
    vignette: <DeveloperVignette />,
    heading: "Developer platform",
    body: "A clean REST API with tenant-scoped authentication, real-time webhooks, and a sandbox environment available from day one — no approval required to start building.",
  },
]

/** The three platform pillars: identity, wallets, and the developer platform. */
export function PlatformSection() {
  return (
    <section
      id="platform"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28"
    >
      <Reveal>
        <SectionIntro
          label="The platform"
          headline={
            <>
              Everything your customers need.{" "}
              <em className="font-serif font-normal italic">
                Nothing you have to build.
              </em>
            </>
          }
          subheading="Afrinvest Connect bundles the three hardest problems in embedded finance into one integration: compliant identity verification, a multi-product wallet ledger, and the developer tooling to connect it to your product."
        />
      </Reveal>
      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
        {PILLARS.map((pillar, index) => (
          <Reveal key={pillar.heading} delay={index * 90}>
            <article className="group h-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_oklch(0.488_0.19_264/0.35)]">
              <div className="h-40 border-b border-(--line) bg-linear-to-b from-(--wash) to-white">
                {pillar.vignette}
              </div>
              <div className="p-6">
                <h3 className="text-base font-semibold tracking-tight text-(--ink)">
                  {pillar.heading}
                </h3>
                <p className="mt-2 text-sm text-pretty text-(--ink-soft)">
                  {pillar.body}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
