import { createHighlighter, type Highlighter } from "shiki"

/** Languages available in docs code blocks. Extend here when a sample needs more. */
export const SHIKI_LANGS = [
  "bash",
  "typescript",
  "javascript",
  "json",
  "python",
] as const

export type ShikiLang = (typeof SHIKI_LANGS)[number]

/**
 * Dual themes rendered as CSS variables: `.dark .shiki` overrides in
 * globals.css switch the palette without re-highlighting.
 */
export const SHIKI_THEMES = {
  light: "github-light-default",
  dark: "github-dark-default",
} as const

let highlighterPromise: Promise<Highlighter> | null = null

/** Cached singleton — shiki grammars are expensive to load, share one instance. */
export function getHighlighter(): Promise<Highlighter> {
  highlighterPromise ??= createHighlighter({
    themes: Object.values(SHIKI_THEMES),
    langs: [...SHIKI_LANGS],
  })
  return highlighterPromise
}

/** Normalise loose labels ("cURL", "js", "node") to a supported shiki language. */
export function resolveLang(label: string | undefined): ShikiLang {
  const normalized = (label ?? "").toLowerCase()
  const aliases: Record<string, ShikiLang> = {
    curl: "bash",
    shell: "bash",
    sh: "bash",
    js: "javascript",
    node: "javascript",
    ts: "typescript",
    py: "python",
  }
  if (aliases[normalized]) return aliases[normalized]
  if ((SHIKI_LANGS as readonly string[]).includes(normalized)) {
    return normalized as ShikiLang
  }
  return "bash"
}
