"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { DOCS_NAV } from "@/lib/docs-nav"
import { cn } from "@/lib/utils"

interface DocsSidebarProps {
  /** Called after a nav item is clicked — used to close the mobile sheet. */
  onNavigate?: () => void
}

/** Left-hand docs navigation, data-driven from DOCS_NAV in lib/docs-nav.ts. */
export function DocsSidebar({ onNavigate }: DocsSidebarProps) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-6">
      {DOCS_NAV.map((section) => (
        <div key={section.title} className="flex flex-col gap-1">
          <span className="px-3 pb-1 text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">
            {section.title}
          </span>
          {section.items.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-1.5 text-sm transition-colors duration-100",
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                {active ? (
                  <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-sidebar-primary" />
                ) : null}
                {item.title}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
