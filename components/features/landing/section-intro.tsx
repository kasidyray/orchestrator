import type * as React from "react"

import { cn } from "@/lib/utils"

interface SectionIntroProps {
  label: string
  /** Accepts nodes so headlines can carry serif-italic accents. */
  headline: React.ReactNode
  subheading: string
  /** "dark" suits the deep-ink sections. */
  tone?: "light" | "dark"
  centered?: boolean
  className?: string
}

/** Label + headline + subheading block that opens each landing section. */
export function SectionIntro({
  label,
  headline,
  subheading,
  tone = "light",
  centered = false,
  className,
}: SectionIntroProps) {
  return (
    <div
      className={cn("max-w-2xl", centered && "mx-auto text-center", className)}
    >
      <p
        className={cn(
          "text-xs font-semibold tracking-[0.16em] uppercase",
          tone === "dark" ? "text-(--gold)" : "text-(--brand)"
        )}
      >
        {label}
      </p>
      <h2
        className={cn(
          "mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl",
          tone === "dark" ? "text-white" : "text-(--ink)"
        )}
      >
        {headline}
      </h2>
      <p
        className={cn(
          "mt-4 text-base text-pretty sm:text-lg",
          tone === "dark" ? "text-white/65" : "text-(--ink-soft)"
        )}
      >
        {subheading}
      </p>
    </div>
  )
}
