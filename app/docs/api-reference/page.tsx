import type { Metadata } from "next"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"

import { BaseUrlCard } from "@/components/docs/base-url-card"
import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_SANDBOX_BASE_URL,
} from "@/lib/constants"

export const metadata: Metadata = {
  title: "API reference",
  description:
    "Every Optimus API endpoint by resource — customers, wallets, KYC, transactions, and investments.",
}

export default function ApiReferenceOverviewPage() {
  return (
    <div>
      <h1 className="mb-3 text-2xl font-semibold tracking-tight text-foreground">
        API reference
      </h1>
      <p className="my-4 text-sm leading-7 text-muted-foreground">
        The Optimus API is organised around REST. Endpoints are grouped by
        resource; every path below is relative to a base URL. The reference is
        generated from the same definitions that power the dashboard, so it is
        always in sync.
      </p>

      <div className="my-4 flex flex-col gap-3">
        <BaseUrlCard label="Live base URL" url={API_BASE_URL} />
        <BaseUrlCard label="Sandbox base URL" url={API_SANDBOX_BASE_URL} />
      </div>

      <h2
        id="conventions"
        className="mt-10 mb-4 scroll-mt-20 border-b border-border pb-2 text-lg font-semibold tracking-tight text-foreground"
      >
        Conventions
      </h2>
      <ul className="my-4 flex list-disc flex-col gap-2 pl-5 text-sm leading-6 text-muted-foreground marker:text-border">
        <li>
          Authenticate with{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            Authorization: Bearer sk_…
          </code>{" "}
          on every request — see{" "}
          <Link
            href="/docs/authentication"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Authentication
          </Link>
          .
        </li>
        <li>
          Request and response bodies are JSON with{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            snake_case
          </code>{" "}
          fields.
        </li>
        <li>Amounts are integers in kobo: 150000 is ₦1,500.00.</li>
        <li>
          List endpoints paginate with{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            page
          </code>{" "}
          and{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            per_page
          </code>{" "}
          query parameters (default 25, max 100).
        </li>
        <li>
          Errors share one body shape — see{" "}
          <Link
            href="/docs/errors"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Errors
          </Link>
          .
        </li>
      </ul>

      <h2
        id="resources"
        className="mt-10 mb-4 scroll-mt-20 border-b border-border pb-2 text-lg font-semibold tracking-tight text-foreground"
      >
        Resources
      </h2>
      <div className="my-4 grid gap-3 sm:grid-cols-2">
        {API_ENDPOINTS.map((group) => (
          <Link
            key={group.resource}
            href={`/docs/api-reference/${group.resource.toLowerCase()}`}
            className="group flex flex-col gap-1 rounded-lg border border-border px-4 py-3 transition-colors duration-100 hover:bg-muted/50"
          >
            <span className="flex items-center gap-1 text-sm font-medium text-foreground group-hover:text-primary">
              {group.resource}
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
            </span>
            <span className="text-xs text-muted-foreground">
              {group.endpoints.length} endpoint
              {group.endpoints.length === 1 ? "" : "s"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
