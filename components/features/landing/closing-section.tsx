import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight02Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/features/landing/reveal"

/** The close: two equal conversion paths — sandbox or a conversation. */
export function ClosingSection() {
  return (
    <section className="bg-linear-to-b from-(--wash) to-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-balance text-(--ink) sm:text-4xl">
              Ready to start{" "}
              <em className="font-serif font-normal italic">building?</em>
            </h2>
            <p className="mt-4 text-base text-pretty text-(--ink-soft) sm:text-lg">
              Your sandbox environment is ready in minutes. Talk to our team
              when you&apos;re ready for the details.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Sandbox path — dark, structured */}
          <Reveal delay={90} className="h-full">
            <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border-t-2 border-(--gold) bg-(--ink) p-7 shadow-[0_28px_70px_-28px_oklch(0.22_0.045_270/0.8)]">
              <h3 className="relative text-lg font-semibold tracking-tight text-white">
                Start with sandbox
              </h3>
              <p className="relative mt-2 flex-1 text-sm text-pretty text-white/70">
                Register, configure your product, and start building against
                real APIs — no approval needed to begin.
              </p>
              <div className="relative mt-6">
                <Button
                  nativeButton={false}
                  render={<Link href="/register" />}
                  className="bg-white text-(--ink) hover:bg-white/90 hover:text-(--ink)"
                >
                  Create a free sandbox
                  <HugeiconsIcon
                    icon={ArrowRight02Icon}
                    data-icon="inline-end"
                  />
                </Button>
              </div>
            </div>
          </Reveal>

          {/* Conversation path — light, calm */}
          <Reveal delay={180} className="h-full">
            <div className="flex h-full flex-col rounded-2xl border-t-2 border-(--brand) bg-white p-7 shadow-sm ring-1 ring-black/5">
              <h3 className="text-lg font-semibold tracking-tight text-(--ink)">
                Talk to our team
              </h3>
              <p className="mt-2 flex-1 text-sm text-pretty text-(--ink-soft)">
                For enterprise integrations, volume pricing, or a technical
                walkthrough before you commit.
              </p>
              <div className="mt-6">
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<Link href="mailto:connect@afrinvest.com" />}
                  className="border-(--line) bg-white text-(--ink) hover:bg-(--wash) hover:text-(--ink) dark:border-(--line) dark:bg-white dark:hover:bg-(--wash)"
                >
                  Book a conversation
                  <HugeiconsIcon
                    icon={ArrowRight02Icon}
                    data-icon="inline-end"
                  />
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
