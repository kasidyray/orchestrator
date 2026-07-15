import createMDX from "@next/mdx"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
}

/*
 * Turbopack constraint (Next 16 uses Turbopack for dev AND build): remark/rehype
 * plugins must be passed as string names — JS-function plugins cannot cross into
 * Rust. Syntax highlighting therefore happens in an RSC (components/docs/
 * code-block.tsx), never as a rehype plugin.
 */
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-slug"],
  },
})

export default withMDX(nextConfig)
