import { CopyButton } from "@/components/shared/copy-button"

interface CodeBlockProps {
  code: string
  /** Shown in the header (e.g. "bash", "javascript", or a filename). */
  label?: string
}

/** Monospace code block with a header label and a copy button. */
export function CodeBlock({ code, label = "bash" }: CodeBlockProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="flex items-center justify-between border-b border-border bg-muted/50 py-1 pr-1 pl-3">
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
        <CopyButton value={code} label="Copy code" size="icon-xs" />
      </div>
      <pre className="overflow-x-auto bg-card p-4">
        <code className="font-mono text-xs leading-relaxed whitespace-pre text-foreground">
          {code}
        </code>
      </pre>
    </div>
  )
}
