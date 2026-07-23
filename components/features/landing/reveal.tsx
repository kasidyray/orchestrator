"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface RevealProps {
  children: React.ReactNode
  /** Transition delay in ms, for gentle staggering within a group. */
  delay?: number
  className?: string
}

/**
 * Fades content up the first time it scrolls into view. The hidden state is
 * motion-safe-only, so reduced-motion users always see content in place.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -48px 0px" }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "transition-[opacity,translate] duration-700 ease-out motion-reduce:transition-none",
        visible
          ? "translate-y-0 opacity-100"
          : "motion-safe:translate-y-4 motion-safe:opacity-0",
        className
      )}
    >
      {children}
    </div>
  )
}
