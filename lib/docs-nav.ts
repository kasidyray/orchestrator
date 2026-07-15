import { API_ENDPOINTS } from "@/lib/constants"

export interface DocsNavItem {
  title: string
  href: string
}

export interface DocsNavSection {
  title: string
  items: DocsNavItem[]
}

/**
 * Sidebar manifest for the docs area — the single place that defines page
 * order (sidebar + prev/next pager). Adding a docs page = create its
 * page.mdx under app/docs/ and add one entry here.
 *
 * The API reference items are generated from API_ENDPOINTS: adding a resource
 * group in lib/constants.ts creates its page, sidebar entry, and pager slot.
 */
export const DOCS_NAV: DocsNavSection[] = [
  {
    title: "Getting started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Authentication", href: "/docs/authentication" },
      { title: "Environments & test mode", href: "/docs/environments" },
      { title: "Errors", href: "/docs/errors" },
    ],
  },
  {
    title: "Guides",
    items: [
      { title: "Customers & KYC", href: "/docs/guides/customers" },
      { title: "Wallets", href: "/docs/guides/wallets" },
      { title: "Transfers", href: "/docs/guides/transfers" },
      { title: "Webhooks", href: "/docs/guides/webhooks" },
    ],
  },
  {
    title: "API reference",
    items: [
      { title: "Overview", href: "/docs/api-reference" },
      ...API_ENDPOINTS.map((group) => ({
        title: group.resource,
        href: `/docs/api-reference/${group.resource.toLowerCase()}`,
      })),
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Code samples", href: "/docs/code-samples" },
      { title: "SDKs & tools", href: "/docs/sdks" },
    ],
  },
]

/** Reading order for the prev/next pager. */
export function flattenDocsNav(): DocsNavItem[] {
  return DOCS_NAV.flatMap((section) => section.items)
}
