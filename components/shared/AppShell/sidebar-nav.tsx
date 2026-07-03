"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"

import { MAIN_NAV, MANAGE_GROUP } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { NavItem } from "@/lib/types"

interface SidebarNavProps {
  /** Called after a nav item is clicked — used to close the mobile sheet. */
  onNavigate?: () => void
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {MAIN_NAV.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          active={isActive(pathname, item.href)}
          onNavigate={onNavigate}
        />
      ))}

      <ManageGroup pathname={pathname} onNavigate={onNavigate} />
    </nav>
  )
}

function NavLink({
  item,
  active,
  nested = false,
  onNavigate,
}: {
  item: NavItem
  active: boolean
  nested?: boolean
  onNavigate?: () => void
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-100",
        nested && "py-1.5 pl-11",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      {active ? (
        <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-sidebar-primary" />
      ) : null}
      {nested ? null : (
        <HugeiconsIcon
          icon={item.icon}
          className={cn(
            "size-4.5 shrink-0 transition-colors duration-100",
            active && "text-sidebar-primary"
          )}
        />
      )}
      {item.label}
    </Link>
  )
}

/** Collapsible "Manage" section — auto-opens when on one of its routes. */
function ManageGroup({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) {
  const groupActive = MANAGE_GROUP.children.some((child) =>
    isActive(pathname, child.href)
  )
  const [open, setOpen] = React.useState(groupActive)

  // Re-open the section when navigation lands inside it — derived during render
  // (no effect) by comparing against the active state from the previous render.
  const [wasActive, setWasActive] = React.useState(groupActive)
  if (groupActive !== wasActive) {
    setWasActive(groupActive)
    if (groupActive) setOpen(true)
  }

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-100",
          groupActive && !open
            ? "text-sidebar-accent-foreground"
            : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )}
      >
        <HugeiconsIcon icon={MANAGE_GROUP.icon} className="size-4.5 shrink-0" />
        {MANAGE_GROUP.label}
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          className={cn(
            "ml-auto size-4 shrink-0 transition-transform duration-200",
            open ? "rotate-0" : "-rotate-90"
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-200 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="mt-1 flex flex-col gap-1">
            {MANAGE_GROUP.children.map((child) => (
              <NavLink
                key={child.href}
                item={child}
                active={isActive(pathname, child.href)}
                nested
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
