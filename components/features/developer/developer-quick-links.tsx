import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowUpRight01Icon,
  CodeIcon,
  Globe02Icon,
  Key01Icon,
  WebhookIcon,
} from "@hugeicons/core-free-icons"

import { SectionCard } from "@/components/shared/section-card"

const DOC_LINKS = [
  {
    icon: Key01Icon,
    title: "Authentication",
    description: "Authenticate requests with your secret key.",
    href: "/docs/authentication",
  },
  {
    icon: Globe02Icon,
    title: "API reference",
    description: "Browse every endpoint by resource.",
    href: "/docs/api-reference",
  },
  {
    icon: WebhookIcon,
    title: "Webhooks",
    description: "Receive real-time event notifications.",
    href: "/docs/guides/webhooks",
  },
  {
    icon: CodeIcon,
    title: "Code samples",
    description: "Copy-paste starting points for common calls.",
    href: "/docs/code-samples",
  },
] as const

/** Cards linking out to the standalone docs site — opens in a new tab. */
export function DeveloperQuickLinks() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {DOC_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener"
          className="group"
        >
          <SectionCard className="h-full transition-colors duration-100 group-hover:border-primary/40">
            <div className="flex flex-col gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HugeiconsIcon icon={link.icon} className="size-5" />
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="flex items-center gap-1 text-sm font-medium text-foreground group-hover:text-primary">
                  {link.title}
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    className="size-3.5"
                  />
                </span>
                <span className="text-xs text-muted-foreground">
                  {link.description}
                </span>
              </div>
            </div>
          </SectionCard>
        </Link>
      ))}
    </div>
  )
}
