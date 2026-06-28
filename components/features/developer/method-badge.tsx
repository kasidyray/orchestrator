import { cn } from "@/lib/utils"
import type { HttpMethod } from "@/lib/constants"

const METHOD_CLASS: Record<HttpMethod, string> = {
  GET: "bg-info/10 text-info",
  POST: "bg-success/10 text-success",
  PUT: "bg-warning/10 text-warning",
  PATCH: "bg-warning/10 text-warning",
  DELETE: "bg-destructive/10 text-destructive",
}

export function MethodBadge({ method }: { method: HttpMethod }) {
  return (
    <span
      className={cn(
        "inline-flex w-15 shrink-0 justify-center rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold",
        METHOD_CLASS[method]
      )}
    >
      {method}
    </span>
  )
}
