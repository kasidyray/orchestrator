import * as React from "react"
import Link from "next/link"
import type { MDXComponents } from "mdx/types"

import { BaseUrlCard } from "@/components/docs/base-url-card"
import { Callout } from "@/components/docs/callout"
import { DocsCodeBlock } from "@/components/docs/code-block"
import { CodeTabs } from "@/components/docs/code-tabs"
import { EndpointList } from "@/components/docs/endpoint-list"
import { ParamTable } from "@/components/docs/param-table"
import { MethodBadge } from "@/components/shared/method-badge"
import { cn } from "@/lib/utils"

/**
 * Pull the raw code string and language out of a fenced block's rendered
 * child (`<pre><code className="language-bash">…</code></pre>`). Defensive:
 * falls back to a plain <pre> when the shape is unexpected.
 */
function extractCode(children: React.ReactNode): {
  code: string
  lang?: string
} {
  if (React.isValidElement(children)) {
    const props = children.props as {
      className?: string
      children?: React.ReactNode
    }
    return {
      code: typeof props.children === "string" ? props.children : "",
      lang: props.className?.match(/language-([\w-]+)/)?.[1],
    }
  }
  return { code: typeof children === "string" ? children : "" }
}

function MdxPre({ children }: React.ComponentProps<"pre">) {
  const { code, lang } = extractCode(children)
  if (!code) {
    return (
      <pre className="my-4 overflow-x-auto rounded-lg border border-border bg-card p-4 font-mono text-xs">
        {children}
      </pre>
    )
  }
  return <DocsCodeBlock code={code} lang={lang} label={lang} className="my-4" />
}

function heading(
  Tag: "h1" | "h2" | "h3" | "h4",
  className: string
): (props: React.ComponentProps<typeof Tag>) => React.ReactElement {
  function MdxHeading({
    className: extra,
    ...props
  }: React.ComponentProps<typeof Tag>) {
    return <Tag className={cn(className, extra)} {...props} />
  }
  return MdxHeading
}

/**
 * Element + component registry for every MDX docs page. Elements are styled
 * with design tokens only; custom components are available in .mdx files
 * without imports.
 */
export const docsMdxComponents: MDXComponents = {
  h1: heading(
    "h1",
    "mb-3 text-2xl font-semibold tracking-tight text-foreground"
  ),
  h2: heading(
    "h2",
    "mt-10 mb-4 scroll-mt-20 border-b border-border pb-2 text-lg font-semibold tracking-tight text-foreground"
  ),
  h3: heading(
    "h3",
    "mt-8 mb-3 scroll-mt-20 text-base font-semibold text-foreground"
  ),
  h4: heading("h4", "mt-6 mb-2 text-sm font-semibold text-foreground"),
  p: (props) => (
    <p
      className="my-4 text-sm leading-7 text-muted-foreground [&_strong]:font-medium [&_strong]:text-foreground"
      {...props}
    />
  ),
  a: ({ href = "", children, ...props }) => (
    <Link
      href={href}
      className="font-medium text-primary underline-offset-4 hover:underline"
      {...props}
    >
      {children}
    </Link>
  ),
  ul: (props) => (
    <ul
      className="my-4 flex list-disc flex-col gap-2 pl-5 text-sm leading-6 text-muted-foreground marker:text-border"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="my-4 flex list-decimal flex-col gap-2 pl-5 text-sm leading-6 text-muted-foreground marker:text-muted-foreground"
      {...props}
    />
  ),
  li: (props) => (
    <li className="[&_code]:text-foreground [&_strong]:font-medium [&_strong]:text-foreground" {...props} />
  ),
  code: (props) => (
    <code
      className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground"
      {...props}
    />
  ),
  pre: MdxPre,
  blockquote: (props) => (
    <blockquote
      className="my-4 border-l-2 border-border pl-4 text-sm text-muted-foreground italic"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-border" />,
  table: (props) => (
    <div className="my-4 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-muted/50" {...props} />,
  tbody: (props) => <tbody className="divide-y divide-border" {...props} />,
  tr: (props) => <tr className="border-b border-border last:border-0" {...props} />,
  th: (props) => (
    <th
      className="px-3 py-2 text-left font-medium text-muted-foreground"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="px-3 py-2 align-top text-muted-foreground [&_code]:text-foreground"
      {...props}
    />
  ),
  // Custom docs components — usable in .mdx without imports.
  Callout,
  CodeBlock: DocsCodeBlock,
  CodeTabs,
  EndpointList,
  ParamTable,
  MethodBadge,
  BaseUrlCard,
}
