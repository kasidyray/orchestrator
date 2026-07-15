import { CopyButton } from "@/components/shared/copy-button"
import { getHighlighter, resolveLang, SHIKI_THEMES } from "@/lib/shiki"
import { cn } from "@/lib/utils"

interface DocsCodeBlockProps {
  code: string
  /** Loose language label ("cURL", "js", "bash") — resolved to a shiki grammar. */
  lang?: string
  /** Header label; defaults to the resolved language. */
  label?: string
  className?: string
}

/**
 * Syntax-highlighted code block for the docs area. Async Server Component:
 * shiki runs at render time on the server, so no highlighting JS ships to the
 * client. Dual light/dark palettes are inlined; `.dark .shiki` in globals.css
 * flips between them.
 */
export async function DocsCodeBlock({
  code,
  lang,
  label,
  className,
}: DocsCodeBlockProps) {
  const highlighter = await getHighlighter()
  const trimmed = code.replace(/\n+$/, "")
  const resolved = resolveLang(lang ?? label)
  const html = highlighter.codeToHtml(trimmed, {
    lang: resolved,
    themes: SHIKI_THEMES,
  })

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border bg-muted/50 py-1 pr-1 pl-3">
        <span className="font-mono text-xs text-muted-foreground">
          {label ?? resolved}
        </span>
        <CopyButton value={trimmed} label="Copy code" size="icon-xs" />
      </div>
      <div
        className="overflow-x-auto bg-card p-4 font-mono text-xs leading-relaxed [&_code]:whitespace-pre"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
