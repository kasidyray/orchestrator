import type { ReactNode } from "react"

import { BrandMark } from "@/components/shared/brand-mark"

/**
 * Auth shell — a single centred column over a soft backdrop that concentrates
 * toward the bottom of the page. Shared by login, register, and verify-email so
 * the whole flow reads as one look.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-6 py-12">
      {/* Soft backdrop — subtle, concentrated toward the bottom of the page */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {/* Colour wash rising from the bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, var(--chart-1) -10%, transparent 45%)",
            opacity: 0.13,
          }}
        />

        {/* Blurred blobs along the bottom edge */}
        <div
          className="absolute -bottom-32 left-[6%] size-[26rem] rounded-full opacity-25 blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--chart-1), transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-40 right-[4%] size-[26rem] rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--swatch-5), transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-28 left-[40%] size-[24rem] rounded-full opacity-[0.16] blur-3xl"
          style={{
            background: "radial-gradient(circle, var(--chart-2), transparent 70%)",
          }}
        />

        {/* Faded dot grid — strongest at the bottom, fading upward */}
        <div
          className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(var(--foreground) 1.2px, transparent 1.2px)",
            backgroundSize: "24px 24px",
            maskImage: "linear-gradient(to top, black, transparent 55%)",
            WebkitMaskImage: "linear-gradient(to top, black, transparent 55%)",
          }}
        />
      </div>

      <div className="relative z-10 flex w-full max-w-sm flex-col gap-6">
        <div className="flex justify-center">
          <BrandMark iconOnly />
        </div>
        {children}
      </div>
    </div>
  )
}
