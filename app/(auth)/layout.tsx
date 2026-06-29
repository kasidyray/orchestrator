import type { ReactNode } from "react"

import { BrandMark } from "@/components/shared/brand-mark"
import {
  ComplianceIllustration,
  EmbeddedIllustration,
  PaymentsIllustration,
  WalletsIllustration,
} from "@/components/features/auth/value-illustrations"

const VALUE_POINTS = [
  {
    Illustration: ComplianceIllustration,
    title: "Bank-grade compliance",
    description:
      "KYC, KYB, and AML checks are built in, so you launch fully compliant from day one.",
  },
  {
    Illustration: WalletsIllustration,
    title: "Wallets and savings",
    description:
      "Spin up branded wallet and savings products for your customers in days, not months.",
  },
  {
    Illustration: PaymentsIllustration,
    title: "Unified payments",
    description:
      "One API for collections, payouts, and ledgers across every market you serve.",
  },
  {
    Illustration: EmbeddedIllustration,
    title: "Embedded finance",
    description:
      "Access APIs to programmatically move money or build your own financial products.",
  },
]

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[26rem_1fr]">
      <aside
        className="relative hidden flex-col justify-between overflow-hidden p-10 text-primary-foreground lg:flex"
        style={{
          backgroundColor: "var(--primary)",
          backgroundImage:
            "linear-gradient(150deg, var(--chart-5) 0%, var(--primary) 48%, var(--chart-3) 100%)",
        }}
      >
        {/* Depth layers — all built from blue chart tokens */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 size-[28rem] rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--chart-2) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-20 size-[26rem] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--chart-4) 0%, transparent 70%)",
          }}
        />
        {/* Faded grid lines — masked so they fall off toward the edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(var(--primary-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--primary-foreground) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(circle at 30% 25%, black, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(circle at 30% 25%, black, transparent 75%)",
          }}
        />
        {/* Fine dot grid for texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(var(--primary-foreground) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        {/* Top sheen */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--primary-foreground) 50%, transparent)",
            opacity: 0.2,
          }}
        />

        <div className="relative z-10">
          <BrandMark variant="inverted" />
        </div>

        <ul className="relative z-10 flex flex-col gap-7">
          {VALUE_POINTS.map(({ Illustration, title, description }) => (
            <li key={title} className="flex items-start gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/10 ring-1 ring-inset ring-primary-foreground/15 backdrop-blur-sm">
                <Illustration className="size-10" />
              </span>
              <div className="flex flex-col gap-1 pt-1.5">
                <h3 className="text-sm font-semibold tracking-tight text-primary-foreground">
                  {title}
                </h3>
                <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/70">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p className="relative z-10 text-xs text-primary-foreground/60">
          © 2026 Afrinvest Optimus. All rights reserved.
        </p>
      </aside>

      <main className="flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="flex w-full max-w-sm flex-col gap-8">
          <BrandMark className="lg:hidden" />
          {children}
        </div>
      </main>
    </div>
  )
}
