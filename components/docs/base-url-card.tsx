import { CopyButton } from "@/components/shared/copy-button"

/** Labelled base-URL row with a copy control (docs + developer hub). */
export function BaseUrlCard({ label, url }: { label: string; url: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2">
      <div className="flex min-w-0 flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <code className="truncate font-mono text-sm text-foreground">
          {url}
        </code>
      </div>
      <CopyButton value={url} label="Copy URL" />
    </div>
  )
}
