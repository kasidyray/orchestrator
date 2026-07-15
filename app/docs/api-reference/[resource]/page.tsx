import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { DocsCodeBlock } from "@/components/docs/code-block"
import { EndpointList } from "@/components/docs/endpoint-list"
import { CopyButton } from "@/components/shared/copy-button"
import { MethodBadge } from "@/components/shared/method-badge"
import {
  API_BASE_URL,
  API_ENDPOINTS,
  type ApiEndpoint,
} from "@/lib/constants"

/**
 * One reference page per resource group, generated from API_ENDPOINTS in
 * lib/constants.ts. Adding an endpoint or a resource group there updates this
 * page, the sidebar, and the pager — no docs edit needed.
 */

interface PageProps {
  params: Promise<{ resource: string }>
}

function findGroup(resource: string) {
  return API_ENDPOINTS.find(
    (group) => group.resource.toLowerCase() === resource
  )
}

export function generateStaticParams() {
  return API_ENDPOINTS.map((group) => ({
    resource: group.resource.toLowerCase(),
  }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { resource } = await params
  const group = findGroup(resource)
  if (!group) return {}
  return {
    title: `${group.resource} API`,
    description: `Endpoints for the ${group.resource} resource on the Optimus API.`,
  }
}

function endpointId(endpoint: ApiEndpoint): string {
  return `${endpoint.method}-${endpoint.path}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function curlFor(endpoint: ApiEndpoint): string {
  const method = endpoint.method === "GET" ? "" : ` -X ${endpoint.method}`
  const hasBody = ["POST", "PUT", "PATCH"].includes(endpoint.method)
  const lines = [
    `curl${method} ${API_BASE_URL}${endpoint.path} \\`,
    `  -H "Authorization: Bearer sk_live_..."${hasBody ? " \\" : ""}`,
  ]
  if (hasBody) {
    lines.push(`  -H "Content-Type: application/json" \\`)
    lines.push(`  -d '{}'`)
  }
  return lines.join("\n")
}

export default async function ApiResourcePage({ params }: PageProps) {
  const { resource } = await params
  const group = findGroup(resource)
  if (!group) notFound()

  return (
    <div>
      <h1 className="mb-3 text-2xl font-semibold tracking-tight text-foreground">
        {group.resource}
      </h1>
      <p className="my-4 text-sm leading-7 text-muted-foreground">
        Endpoints for the {group.resource} resource. Paths are relative to the
        base URLs on the{" "}
        <Link
          href="/docs/api-reference"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          API reference overview
        </Link>
        .
      </p>

      <EndpointList group={group} />

      {group.endpoints.map((endpoint) => (
        <section key={endpointId(endpoint)}>
          <h2
            id={endpointId(endpoint)}
            className="mt-10 mb-4 scroll-mt-20 border-b border-border pb-2 text-lg font-semibold tracking-tight text-foreground"
          >
            {endpoint.description}
          </h2>
          <div className="my-4 flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2">
            <div className="flex min-w-0 items-center gap-3">
              <MethodBadge method={endpoint.method} />
              <code className="truncate font-mono text-sm text-foreground">
                {endpoint.path}
              </code>
            </div>
            <CopyButton
              value={`${API_BASE_URL}${endpoint.path}`}
              label="Copy URL"
            />
          </div>
          <DocsCodeBlock
            code={curlFor(endpoint)}
            lang="bash"
            label="cURL"
            className="my-4"
          />
        </section>
      ))}
    </div>
  )
}
