"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, Settings02Icon } from "@hugeicons/core-free-icons"

import { MAIN_NAV, MANAGE_GROUP } from "@/lib/constants"
import { cn, truncateId } from "@/lib/utils"
import type { IconSvgElement } from "@hugeicons/react"

interface Section {
  label: string
  icon: IconSvgElement
  /** False for grouping segments that have no page of their own (e.g. /manage). */
  linkable: boolean
}

/** Maps a route prefix to its breadcrumb label + icon, built from the nav config. */
const SECTIONS: Record<string, Section> = {
  "/settings": { label: "Organisation settings", icon: Settings02Icon, linkable: true },
  "/manage": { label: MANAGE_GROUP.label, icon: MANAGE_GROUP.icon, linkable: false },
}
for (const item of MAIN_NAV) {
  SECTIONS[item.href] = { label: item.label, icon: item.icon, linkable: true }
}
for (const child of MANAGE_GROUP.children) {
  SECTIONS[child.href] = { label: child.label, icon: child.icon, linkable: true }
}

function formatSegment(segment: string) {
  // Resource ids (cus_…, txn_…) get truncated; everything else is title-ised.
  if (/^[a-z0-9]+_/.test(segment)) return truncateId(segment)
  return segment
    .replace(/-/g, " ")
    .replace(/^\w/, (char) => char.toUpperCase())
}

/**
 * Contextual breadcrumb for the top bar. Derives crumbs from the pathname and
 * the nav config — section icon, then one crumb per path segment, the last
 * rendered as the current page.
 */
export function Breadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) return null

  const sectionIcon = SECTIONS[`/${segments[0]}`]?.icon

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`
    const section = SECTIONS[href]
    return {
      href,
      label: section?.label ?? formatSegment(segment),
      linkable: section?.linkable ?? false,
      isLast: index === segments.length - 1,
    }
  })

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 items-center gap-1.5 text-sm"
    >
      {sectionIcon ? (
        <HugeiconsIcon
          icon={sectionIcon}
          className="size-4 shrink-0 text-muted-foreground"
        />
      ) : null}
      <ol className="flex min-w-0 items-center gap-1.5">
        {crumbs.map((crumb) => (
          <React.Fragment key={crumb.href}>
            <li className="flex min-w-0 items-center">
              {crumb.isLast || !crumb.linkable ? (
                <span
                  aria-current={crumb.isLast ? "page" : undefined}
                  className={cn(
                    "truncate",
                    crumb.isLast
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="truncate text-muted-foreground transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
            {crumb.isLast ? null : (
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="size-3.5 shrink-0 text-muted-foreground/60"
              />
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}
