import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight02Icon,
  CheckmarkBadge01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"

/** Decorative balance sparkline for the hero's wallet card. */
function BalanceSparkline() {
  return (
    <svg
      viewBox="0 0 240 56"
      className="mt-4 h-14 w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero-spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="oklch(0.488 0.19 264)"
            stopOpacity="0.18"
          />
          <stop
            offset="100%"
            stopColor="oklch(0.488 0.19 264)"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
      <path
        d="M0 44 C28 41 44 30 68 31 C94 32 108 19 138 21 C166 23 190 12 240 14 L240 56 L0 56 Z"
        fill="url(#hero-spark-fill)"
      />
      <path
        d="M0 44 C28 41 44 30 68 31 C94 32 108 19 138 21 C166 23 190 12 240 14"
        fill="none"
        stroke="oklch(0.488 0.19 264)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Illustrative product composition: wallet card flanked by KYC + webhook cards. */
function ProductStage() {
  return (
    <div className="animate-rise-in relative mx-auto mt-16 max-w-3xl [animation-delay:280ms] sm:mt-20">
      {/* Main wallet card */}
      <div className="relative z-10 mx-auto w-full max-w-sm rounded-2xl bg-white/85 p-5 shadow-[0_32px_80px_-24px_oklch(0.488_0.19_264/0.4)] ring-1 ring-black/5 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-(--ink-soft)">
            Operating balance
          </p>
          <span className="rounded-full bg-(--brand)/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-(--brand) uppercase">
            Sandbox
          </span>
        </div>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-(--ink) tabular-nums">
          ₦12,480,250.00
        </p>
        <BalanceSparkline />
        <div className="mt-4 space-y-2 border-t border-(--line) pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-(--ink-2)">
              <span className="flex size-6 items-center justify-center rounded-full bg-(--wash-2) text-[10px] font-semibold text-(--brand)">
                ₦
              </span>
              NGN wallet
            </span>
            <span className="font-medium text-(--ink) tabular-nums">
              ₦12,480,250.00
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-(--ink-2)">
              <span className="flex size-6 items-center justify-center rounded-full bg-(--wash-2) text-[10px] font-semibold text-(--brand)">
                $
              </span>
              USD wallet
            </span>
            <span className="font-medium text-(--ink) tabular-nums">
              $18,940.12
            </span>
          </div>
        </div>
      </div>

      {/* KYC verification card — floats left */}
      <div className="animate-float-soft absolute top-6 left-0 z-20 hidden w-60 -rotate-[5deg] rounded-xl bg-white/90 p-4 shadow-[0_20px_50px_-20px_oklch(0.488_0.19_264/0.35)] ring-1 ring-black/5 backdrop-blur-xl md:block lg:-left-14">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-(--wash-2) text-xs font-semibold text-(--brand)">
            AO
          </span>
          <div>
            <p className="text-sm font-medium text-(--ink)">Adaeze Okafor</p>
            <p className="flex items-center gap-1 text-xs text-(--ink-soft)">
              <HugeiconsIcon
                icon={CheckmarkBadge01Icon}
                className="size-3.5 text-[oklch(0.62_0.17_150)]"
              />
              Tier 2 · Verified
            </p>
          </div>
        </div>
      </div>

      {/* Webhook event card — floats right */}
      <div className="animate-float-soft absolute right-0 bottom-10 z-20 hidden w-64 rotate-[4deg] rounded-xl bg-white/90 p-4 font-mono shadow-[0_20px_50px_-20px_oklch(0.488_0.19_264/0.35)] ring-1 ring-black/5 backdrop-blur-xl [animation-delay:600ms] md:block lg:-right-14">
        <p className="flex items-center gap-2 text-xs font-medium text-(--ink)">
          <span className="size-1.5 rounded-full bg-[oklch(0.62_0.17_150)]" />
          wallet.credited
        </p>
        <p className="mt-1.5 text-[11px] text-(--ink-soft)">
          200 OK · 42 ms · evt_8f2…c41
        </p>
      </div>
    </div>
  )
}

/** First screen: atmosphere, benefit headline, both conversion paths, product stage. */
export function LandingHero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Atmosphere: wash gradient, grid, grain */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-(--wash-2) via-(--wash) to-white"
      />
      <div
        aria-hidden="true"
        className="landing-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="landing-noise absolute inset-0 -z-10 opacity-[0.035]"
      />

      <div className="mx-auto w-full max-w-6xl px-4 pt-20 pb-20 sm:px-6 sm:pt-28 sm:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="animate-rise-in inline-flex items-center gap-2 rounded-full border border-(--line) bg-white/60 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-(--ink-2) uppercase backdrop-blur">
            <span className="size-1.5 rounded-full bg-(--gold-deep)" />
            Built for financial institutions
          </p>
          <h1 className="animate-rise-in mt-6 text-4xl font-semibold tracking-tight text-balance text-(--ink) [animation-delay:80ms] sm:text-5xl md:text-6xl">
            Launch wallet and verification infrastructure —{" "}
            <em className="font-serif font-normal italic">
              without building it yourself
            </em>
          </h1>
          <p className="animate-rise-in mx-auto mt-6 max-w-2xl text-lg text-pretty text-(--ink-soft) [animation-delay:160ms]">
            Afrinvest Connect gives your business a complete, regulated
            financial backbone: identity verification, multi-product wallets,
            and a developer API — all production-ready on day one.
          </p>
          <div className="animate-rise-in mt-10 flex flex-col items-center justify-center gap-3 [animation-delay:220ms] sm:flex-row">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/register" />}
              className="w-full bg-(--brand) px-5 text-white hover:bg-(--brand-strong) sm:w-auto"
            >
              Get started
              <HugeiconsIcon icon={ArrowRight02Icon} data-icon="inline-end" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<Link href="mailto:connect@afrinvest.com" />}
              className="w-full border-(--line) bg-white/70 px-5 text-(--ink) backdrop-blur hover:bg-white hover:text-(--ink) sm:w-auto dark:border-(--line) dark:bg-white/70 dark:hover:bg-white"
            >
              Talk to our team
            </Button>
          </div>
        </div>

        <ProductStage />
      </div>
    </section>
  )
}
