import { MethodBadge } from "@/components/shared/method-badge"
import type { ApiResourceGroup } from "@/lib/constants"

/** Endpoint rows for one API resource group, straight from lib/constants.ts. */
export function EndpointList({ group }: { group: ApiResourceGroup }) {
  return (
    <ul className="my-4 flex flex-col divide-y divide-border rounded-lg border border-border px-4">
      {group.endpoints.map((endpoint) => (
        <li
          key={`${endpoint.method}-${endpoint.path}`}
          className="flex items-center gap-3 py-2.5"
        >
          <MethodBadge method={endpoint.method} />
          <code className="font-mono text-xs text-foreground">
            {endpoint.path}
          </code>
          <span className="ml-auto hidden truncate text-right text-sm text-muted-foreground sm:block">
            {endpoint.description}
          </span>
        </li>
      ))}
    </ul>
  )
}
