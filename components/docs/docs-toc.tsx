"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

interface TocEntry {
  id: string
  text: string
  level: 2 | 3
}

/**
 * "On this page" list. Heading ids come from rehype-slug (MDX pages) or are
 * set manually on TSX pages; the list is read from the rendered DOM on each
 * route change, so no per-page wiring is needed. IntersectionObserver drives
 * the scroll-spy highlight.
 */
export function DocsToc() {
  const pathname = usePathname()
  const [entries, setEntries] = React.useState<TocEntry[]>([])
  const [activeId, setActiveId] = React.useState<string>("")

  React.useEffect(() => {
    let observer: IntersectionObserver | null = null

    // Scan after paint so the article for the new route is in the DOM (and to
    // keep state updates out of the synchronous effect body).
    const frame = requestAnimationFrame(() => {
      const headings = Array.from(
        document.querySelectorAll<HTMLHeadingElement>(
          "article h2[id], article h3[id]"
        )
      )
      setEntries(
        headings.map((heading) => ({
          id: heading.id,
          text: heading.textContent ?? "",
          level: heading.tagName === "H2" ? 2 : 3,
        }))
      )
      setActiveId(headings[0]?.id ?? "")

      observer = new IntersectionObserver(
        (observed) => {
          const visible = observed.find((entry) => entry.isIntersecting)
          if (visible) setActiveId(visible.target.id)
        },
        // Track the band just below the sticky header.
        { rootMargin: "-80px 0px -70% 0px" }
      )
      headings.forEach((heading) => observer?.observe(heading))
    })

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [pathname])

  if (entries.length === 0) return null

  return (
    <nav aria-label="On this page" className="flex flex-col gap-2">
      <span className="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">
        On this page
      </span>
      <ul className="flex flex-col gap-1 border-l border-border">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className={cn(
                "-ml-px block border-l py-1 text-sm transition-colors duration-100",
                entry.level === 3 ? "pl-6" : "pl-3",
                activeId === entry.id
                  ? "border-primary font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
