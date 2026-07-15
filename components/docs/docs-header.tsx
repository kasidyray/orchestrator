"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { BrandMark } from "@/components/shared/brand-mark"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { ThemeToggle } from "@/components/docs/theme-toggle"

/** Sticky docs header: brand, search placeholder, theme toggle, dashboard link. */
export function DocsHeader() {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center gap-3 px-4 md:px-6">
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="lg:hidden"
                aria-label="Open docs navigation"
              >
                <HugeiconsIcon icon={Menu01Icon} />
              </Button>
            }
          />
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Docs navigation</SheetTitle>
            <div className="flex h-full flex-col p-4">
              <div className="flex h-10 items-center px-1">
                <BrandMark />
              </div>
              <div className="mt-2 flex-1 overflow-y-auto">
                <DocsSidebar onNavigate={() => setMobileNavOpen(false)} />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/docs" className="flex items-center gap-2.5">
          <BrandMark iconOnly className="sm:hidden" />
          <BrandMark className="hidden sm:flex" />
          <span className="hidden rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground sm:block">
            Docs
          </span>
        </Link>

        <div className="flex flex-1 justify-center">
          <button
            type="button"
            onClick={() => toast("Search is coming soon")}
            className="hidden w-full max-w-xs items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-100 hover:bg-muted/50 md:flex"
          >
            <HugeiconsIcon icon={Search01Icon} className="size-4" />
            Search docs
            <kbd className="ml-auto rounded border border-border bg-muted px-1.5 font-mono text-[11px] text-muted-foreground">
              ⌘K
            </kbd>
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            aria-label="Search docs"
            onClick={() => toast("Search is coming soon")}
          >
            <HugeiconsIcon icon={Search01Icon} />
          </Button>
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/dashboard" />}
          >
            Go to dashboard
          </Button>
        </div>
      </div>
    </header>
  )
}
