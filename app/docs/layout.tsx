import type { Metadata } from "next"

import { DocsHeader } from "@/components/docs/docs-header"
import { DocsPager } from "@/components/docs/docs-pager"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { DocsToc } from "@/components/docs/docs-toc"

export const metadata: Metadata = {
  title: {
    template: "%s — Optimus docs",
    default: "Optimus docs",
  },
  description:
    "Integrate wallets, KYC, transactions, and investments with the Afrinvest Optimus API.",
}

/**
 * Standalone public docs shell — outside the (dashboard) group, so no auth
 * gate and no app chrome. Header on top; sidebar / article / "on this page"
 * TOC in a three-column layout that collapses on smaller screens.
 */
export default function DocsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <DocsHeader />
      <div className="mx-auto flex w-full max-w-screen-2xl flex-1 gap-8 px-4 md:px-6">
        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-60 shrink-0 overflow-y-auto py-8 pr-2 lg:block">
          <DocsSidebar />
        </aside>
        <main className="min-w-0 flex-1 py-8">
          <article className="mx-auto w-full max-w-3xl">
            {children}
            <DocsPager />
          </article>
        </main>
        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 xl:block">
          <DocsToc />
        </aside>
      </div>
    </div>
  )
}
