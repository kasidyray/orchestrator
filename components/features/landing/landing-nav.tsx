import Link from "next/link"

import { Button } from "@/components/ui/button"
import { BrandMark } from "@/components/shared/brand-mark"

const NAV_LINKS = [
  { label: "Platform", href: "#platform", newTab: false },
  { label: "How it works", href: "#how-it-works", newTab: false },
  { label: "Why Afrinvest", href: "#why-afrinvest", newTab: false },
  { label: "Documentation", href: "/docs", newTab: true },
]

/** Sticky landing-page header: brand, section links, sign in + sandbox CTA. */
export function LandingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-(--line) bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandMark iconOnly />
          <span className="text-sm font-semibold tracking-tight text-(--ink)">
            Afrinvest Connect
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.newTab ? "_blank" : undefined}
              rel={link.newTab ? "noopener noreferrer" : undefined}
              className="rounded-md px-3 py-1.5 text-sm text-(--ink-soft) transition-colors duration-100 hover:bg-(--wash) hover:text-(--ink)"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/login" />}
            className="text-(--ink) hover:bg-(--wash) hover:text-(--ink) dark:hover:bg-(--wash)"
          >
            Sign in
          </Button>
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href="/register" />}
            className="bg-(--brand) text-white hover:bg-(--brand-strong)"
          >
            Get started
          </Button>
        </div>
      </div>
    </header>
  )
}
