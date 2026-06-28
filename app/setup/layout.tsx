import type { ReactNode } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { BrandMark } from "@/components/shared/brand-mark"

export default function SetupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
        <BrandMark />
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/dashboard" />}
          nativeButton={false}
        >
          <HugeiconsIcon icon={Cancel01Icon} />
          Exit setup
        </Button>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}
