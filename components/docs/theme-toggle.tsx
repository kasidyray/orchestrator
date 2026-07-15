"use client"

import { useTheme } from "next-themes"
import { HugeiconsIcon } from "@hugeicons/react"
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"

/**
 * Light/dark switch for the docs header (the dashboard has its own in the
 * account menu). The icon swap is CSS-driven (`dark:` variants), so the
 * server render matches the client and no mounted-state dance is needed.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <HugeiconsIcon icon={Moon02Icon} className="dark:hidden" />
      <HugeiconsIcon icon={Sun03Icon} className="hidden dark:block" />
    </Button>
  )
}
