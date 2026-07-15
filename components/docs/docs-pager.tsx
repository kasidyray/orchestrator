"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

import { flattenDocsNav } from "@/lib/docs-nav"
import { cn } from "@/lib/utils"

/** Prev/next links at the bottom of each docs page, ordered by DOCS_NAV. */
export function DocsPager() {
  const pathname = usePathname()
  const pages = flattenDocsNav()
  const index = pages.findIndex((page) => page.href === pathname)
  if (index === -1) return null

  const prev = index > 0 ? pages[index - 1] : null
  const next = index < pages.length - 1 ? pages[index + 1] : null

  return (
    <div className="mt-12 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
      {prev ? (
        <PagerLink href={prev.href} title={prev.title} direction="prev" />
      ) : (
        <span />
      )}
      {next ? (
        <PagerLink href={next.href} title={next.title} direction="next" />
      ) : null}
    </div>
  )
}

function PagerLink({
  href,
  title,
  direction,
}: {
  href: string
  title: string
  direction: "prev" | "next"
}) {
  const next = direction === "next"
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col gap-1 rounded-lg border border-border px-4 py-3 transition-colors duration-100 hover:bg-muted/50",
        next ? "items-end text-right sm:col-start-2" : "items-start"
      )}
    >
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        {next ? null : (
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
        )}
        {next ? "Next" : "Previous"}
        {next ? (
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
        ) : null}
      </span>
      <span className="text-sm font-medium text-foreground group-hover:text-primary">
        {title}
      </span>
    </Link>
  )
}
