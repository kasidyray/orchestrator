import type { MDXComponents } from "mdx/types"

import { docsMdxComponents } from "@/components/docs/mdx-components"

/**
 * Required by @next/mdx — must live next to app/. The actual registry is kept
 * in components/docs/mdx-components.tsx; this file only re-exports it.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...docsMdxComponents, ...components }
}
