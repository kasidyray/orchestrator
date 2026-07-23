import Link from "next/link"

import { BrandMark } from "@/components/shared/brand-mark"

interface FooterLink {
  label: string
  href: string
  newTab?: boolean
}

interface FooterColumn {
  heading: string
  links: FooterLink[]
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Platform",
    links: [
      { label: "What's included", href: "#platform" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Why Afrinvest", href: "#why-afrinvest" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "Documentation", href: "/docs", newTab: true },
      { label: "API reference", href: "/docs/api-reference", newTab: true },
      { label: "Create a sandbox", href: "/register" },
    ],
  },
  {
    heading: "Get in touch",
    links: [
      { label: "Talk to our team", href: "mailto:connect@afrinvest.com" },
      { label: "Sign in", href: "/login" },
      { label: "Create an account", href: "/register" },
    ],
  },
]

/** Landing footer: brand column plus three balanced link columns. */
export function LandingFooter() {
  return (
    <footer className="border-t border-(--line) bg-(--wash)">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-8 gap-y-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="col-span-2 max-w-sm md:col-span-1">
          <div className="flex items-center gap-2.5">
            <BrandMark iconOnly />
            <span className="text-sm font-semibold tracking-tight text-(--ink)">
              Afrinvest Connect
            </span>
          </div>
          <p className="mt-4 text-sm text-pretty text-(--ink-soft)">
            Regulated wallet, savings, and identity infrastructure for financial
            institutions in Nigeria — backed by 30+ years in Nigerian capital
            markets.
          </p>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h3 className="text-xs font-semibold tracking-[0.14em] text-(--ink-2) uppercase">
              {column.heading}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target={link.newTab ? "_blank" : undefined}
                    rel={link.newTab ? "noopener noreferrer" : undefined}
                    className="text-sm text-(--ink-soft) transition-colors duration-100 hover:text-(--ink)"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-(--line)">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-(--ink-soft)">
            © 2026 Afrinvest. All rights reserved.
          </p>
          <p className="text-xs text-(--ink-soft)">
            CBN-regulated infrastructure
          </p>
        </div>
      </div>
    </footer>
  )
}
