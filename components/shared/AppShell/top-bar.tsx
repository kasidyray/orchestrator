"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BookOpen01Icon,
  Megaphone01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { BrandMark } from "@/components/shared/brand-mark"
import { Breadcrumb } from "@/components/shared/AppShell/breadcrumb"
import { GoLiveSwitch } from "@/components/shared/AppShell/go-live-switch"
import { NotificationsMenu } from "@/components/shared/AppShell/notifications-menu"
import { SidebarNav } from "@/components/shared/AppShell/sidebar-nav"
import { AccountMenu } from "@/components/shared/AppShell/account-menu"
import { BusinessIdBadge } from "@/components/shared/AppShell/business-id-badge"

/**
 * Slim utility bar. A contextual breadcrumb orients on the left; quick actions
 * (feedback, docs), the environment switch, and notifications sit on the right.
 * The big page title still lives in the content (PageContainer + PageHeader).
 */
export function TopBar() {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              aria-label="Open navigation"
            >
              <HugeiconsIcon icon={Menu01Icon} />
            </Button>
          }
        />
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-full flex-col p-4">
            <div className="flex h-10 items-center px-1">
              <BrandMark />
            </div>
            <div className="mt-2 flex-1 overflow-y-auto">
              <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
            </div>
            <div className="border-t border-sidebar-border pt-3">
              <AccountMenu />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 items-center">
        <Breadcrumb />
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          className="hidden text-muted-foreground sm:inline-flex"
          onClick={() => toast("Thanks — feedback is coming soon")}
        >
          <HugeiconsIcon icon={Megaphone01Icon} />
          Feedback
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="hidden text-muted-foreground sm:inline-flex"
          nativeButton={false}
          render={<Link href="/developer" />}
        >
          <HugeiconsIcon icon={BookOpen01Icon} />
          Docs
        </Button>

        <BusinessIdBadge className="ml-1 hidden md:flex" />

        <span
          className="mx-1 hidden h-5 w-px bg-border sm:block"
          aria-hidden
        />

        <GoLiveSwitch />
        <NotificationsMenu />
      </div>
    </header>
  )
}
