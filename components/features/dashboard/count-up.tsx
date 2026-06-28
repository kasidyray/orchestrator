"use client"

import * as React from "react"

interface CountUpProps {
  value: number
  durationMs?: number
  /** Formats the live (and final) value for display. */
  format: (value: number) => string
}

/**
 * Animates a number from 0 to `value` with an ease-out curve on first render.
 * Dashboard-only delight — respects prefers-reduced-motion.
 */
export function CountUp({ value, durationMs = 600, format }: CountUpProps) {
  const [display, setDisplay] = React.useState(0)

  React.useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (reduceMotion) {
      const frame = requestAnimationFrame(() => setDisplay(value))
      return () => cancelAnimationFrame(frame)
    }

    let frame = 0
    let startTime: number | null = null

    const tick = (now: number) => {
      if (startTime === null) startTime = now
      const progress = Math.min((now - startTime) / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(progress < 1 ? value * eased : value)
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, durationMs])

  return <>{format(display)}</>
}
