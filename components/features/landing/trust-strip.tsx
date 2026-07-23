import { HugeiconsIcon } from "@hugeicons/react"
import {
  ApiIcon,
  BankIcon,
  FaceIdIcon,
  Shield01Icon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

import { Reveal } from "@/components/features/landing/reveal"

interface TrustSignal {
  icon: IconSvgElement
  text: string
}

const TRUST_SIGNALS: TrustSignal[] = [
  { icon: Shield01Icon, text: "CBN-regulated infrastructure" },
  { icon: FaceIdIcon, text: "BVN + liveness verification built in" },
  {
    icon: BankIcon,
    text: "Backed by Afrinvest — 30+ years in Nigerian capital markets",
  },
  { icon: ApiIcon, text: "REST API + webhooks" },
]

/** Credibility strip below the hero — answers "can I trust this?" before the product pitch. */
export function TrustStrip() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
      <Reveal>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 rounded-2xl bg-white/80 p-6 shadow-[0_20px_60px_-30px_oklch(0.488_0.19_264/0.35)] ring-1 ring-black/5 backdrop-blur-xl sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
          {TRUST_SIGNALS.map((signal) => (
            <div key={signal.text} className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-(--brand)/10 text-(--brand)">
                <HugeiconsIcon icon={signal.icon} className="size-5" />
              </div>
              <p className="pt-1 text-sm font-medium text-pretty text-(--ink)">
                {signal.text}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
