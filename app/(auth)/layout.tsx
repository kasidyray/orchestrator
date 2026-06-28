import type { ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Coins01Icon,
  SecurityValidationIcon,
  ZapIcon,
} from "@hugeicons/core-free-icons"

import { BrandMark } from "@/components/shared/brand-mark"

const VALUE_POINTS = [
  { icon: SecurityValidationIcon, label: "Bank-grade KYC and compliance built in" },
  { icon: Coins01Icon, label: "Launch wallet and savings products in days" },
  { icon: ZapIcon, label: "One API for payments, payouts, and ledgers" },
]

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <BrandMark variant="inverted" />

        <div className="flex flex-col gap-8">
          <h2 className="max-w-md text-2xl leading-snug font-semibold tracking-tight">
            Serious financial infrastructure for African businesses.
          </h2>
          <ul className="flex flex-col gap-4 text-sm text-primary-foreground/80">
            {VALUE_POINTS.map((point) => (
              <li key={point.label} className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary-foreground/10">
                  <HugeiconsIcon icon={point.icon} className="size-4" />
                </span>
                {point.label}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-primary-foreground/60">
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
