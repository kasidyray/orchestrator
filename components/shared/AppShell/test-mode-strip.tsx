"use client"

import { useAppStore } from "@/store"

/**
 * Sandbox ("test mode") indicator pinned beneath the topbar: a coloured rule
 * with a centred "Test data" tab. Shown only while the app is in the sandbox
 * environment, so it disappears the moment the operator switches to live.
 */
export function TestModeStrip() {
  const environment = useAppStore((state) => state.environment)

  if (environment !== "sandbox") return null

  return (
    <div className="sticky top-14 z-20 h-0.5 bg-warning">
      <span className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-md bg-warning px-2.5 pt-px pb-0.5 text-[10px] font-semibold tracking-wider text-warning-foreground uppercase shadow-sm">
        Test Mode
      </span>
    </div>
  )
}
