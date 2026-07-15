# Maintaining the developer docs (`/docs`)

This is the handover guide for the standalone documentation area at `/docs`.
Read this before touching anything under `app/docs/`, `components/docs/`,
`lib/docs-nav.ts`, or `lib/shiki.ts`.

---

## Architecture in one minute

The docs area is a **public** route tree (`app/docs/`) outside the
authenticated `(dashboard)` group — no auth gate, no app shell. It has its own
layout (`app/docs/layout.tsx`): sticky header, left sidebar, article column,
and a right-hand "On this page" TOC.

Content pages come in two kinds:

1. **Authored pages** — `page.mdx` files under `app/docs/…`. MDX is wired via
   `@next/mdx` in `next.config.ts`; file location = URL.
2. **Generated pages** — TSX pages rendered from data in `lib/constants.ts`
   (the API reference `[resource]` route, the SDKs page). They have no prose
   files to edit; they update when the data updates.

Render flow for an MDX page:

```
app/docs/foo/page.mdx
  └─ compiled by @next/mdx (remark-gfm + rehype-slug, string-named plugins)
      └─ elements mapped through the registry (components/docs/mdx-components.tsx,
         re-exported by the root mdx-components.tsx that Next requires)
          └─ rendered inside app/docs/layout.tsx (sidebar, TOC, pager)
```

Key files:

| File | Role |
| --- | --- |
| `lib/docs-nav.ts` | `DOCS_NAV` — sidebar sections + page order (drives the sidebar and the prev/next pager) |
| `components/docs/mdx-components.tsx` | Element styling (`h2`, `p`, tables, fences) + custom components available in MDX without imports |
| `mdx-components.tsx` (repo root) | Required by Next; thin re-export of the registry. Don't add logic here |
| `lib/shiki.ts` | Cached highlighter singleton, language list, theme pair |
| `components/docs/code-block.tsx` | `DocsCodeBlock` — async RSC that runs shiki server-side |
| `lib/constants.ts` | `API_ENDPOINTS`, `WEBHOOK_EVENTS`, `API_BASE_URL(S)`, `SDK_DOWNLOADS` — the single source of truth the reference pages render from |

---

## Cookbook

### Add a new docs page

1. Create `app/docs/<section>/<slug>/page.mdx`.
2. Start it with a metadata export (required — it drives `<title>` and SEO):
   ```mdx
   export const metadata = {
     title: "Payment links",
     description: "One line for search engines and link previews.",
   }

   # Payment links

   Prose here…
   ```
3. Add one entry to `DOCS_NAV` in `lib/docs-nav.ts` in reading order. That's
   what puts it in the sidebar and the prev/next pager. Nothing else to wire.

### Add or change an API endpoint / resource

Edit `API_ENDPOINTS` in `lib/constants.ts` — nothing else. A new resource
group automatically gets its reference page
(`app/docs/api-reference/[resource]/page.tsx` + `generateStaticParams`), its
sidebar entry, and its pager slot. Same for webhook events
(`WEBHOOK_EVENTS`, rendered on the webhooks guide) and SDKs (`SDK_DOWNLOADS`,
rendered on `/docs/sdks`).

The `[resource]` slug is `group.resource.toLowerCase()` — keep resource names
single-word or accept the resulting slug.

### Write code samples

Always go through the shared components, never raw `<pre>`:

- Single block: fenced code (```` ```bash ````) or, when the sample
  interpolates constants, the explicit component:
  ```mdx
  import { API_BASE_URL } from "@/lib/constants"

  <CodeBlock lang="bash" label="cURL" code={`curl ${API_BASE_URL}/customers`} />
  ```
- Multi-language: `<CodeTabs labels={["cURL", "JavaScript"]}>` with one
  `<CodeBlock>` child per label, in order.
- **Base URLs are never hardcoded** — import them from `lib/constants.ts`.

### Add a code-sample language

Add it to `SHIKI_LANGS` in `lib/shiki.ts` (and an alias in `resolveLang` if
people will label it loosely, e.g. `"golang" → "go"`). Unknown languages fall
back to `bash` rather than crashing.

### Add a new MDX component

Build it in `components/docs/`, then register it in the component map at the
bottom of `components/docs/mdx-components.tsx`. Registered components are
usable in every `.mdx` file without an import line. Available today:
`Callout`, `CodeBlock`, `CodeTabs`, `EndpointList`, `ParamTable`,
`MethodBadge`, `BaseUrlCard`.

---

## Constraints — do not violate

1. **Turbopack only accepts string-named remark/rehype plugins.** Next 16
   builds with Turbopack; JS-function plugins can't cross into Rust. In
   `next.config.ts`, plugins must stay strings (`"remark-gfm"`,
   `"rehype-slug"`). This is why syntax highlighting lives in the
   `DocsCodeBlock` RSC, **not** a rehype plugin — don't "optimise" it back.
2. **The TOC depends on heading ids.** MDX pages get them free from
   `rehype-slug`. TSX docs pages must set `id=` and `scroll-mt-20` on their
   `h2`/`h3` manually (see the `[resource]` page). Only `h2`/`h3` appear in
   the TOC — deeper headings are invisible to it by design.
3. **Every page exports `metadata`.** The docs layout provides the
   `"%s — Optimus docs"` title template. Exception: `app/docs/page.mdx` sets
   its full title itself, because a layout's template only applies to child
   segments.
4. **Block comments in TS can't contain `**/` glob patterns** (`*/` ends the
   comment). Write "page.mdx under app/docs/" instead.
5. **Design tokens only** — all styling in docs components uses `globals.css`
   tokens (project-wide rule). The one shiki-specific CSS lives at the bottom
   of `globals.css` (`.shiki` background suppression + `.dark .shiki`
   variable flip). Keep it if you change themes.
6. **`sonner` toasts and other client interactivity** need `"use client"`
   leaf components (`CodeTabs`, `SdkCard`, `DocsHeader`, …). MDX pages and
   the registry stay server-side so shiki can run there.

## Conventions

- Sentence case everywhere, active verbs, errors name problem + fix
  (project-wide copy standards apply to docs).
- `Callout` for things a reader could get wrong (`info` default, `warning`
  for key-safety/failure modes, `danger` for security-critical); plain prose
  for everything else.
- Amounts in samples are kobo integers; IDs use the real prefixes
  (`cus_…`, `wlt_…`, `txn_…`); sample people/data follow the realistic
  Nigerian-fintech style used across the app.
- Cross-link liberally: guides ↔ API reference ↔ getting-started pages.

## Verify after any docs change

```bash
npm run build && npm run typecheck && npm run lint
```

Then click through (or curl) at minimum: the page you touched, `/docs`, one
`[resource]` page, and check:

- the sidebar and prev/next order still make sense (`lib/docs-nav.ts` is the
  order source),
- code blocks highlight in **both** light and dark mode,
- copy buttons copy, the TOC highlights while scrolling,
- `/docs` still loads logged-out (it must never end up behind the auth gate),
- the dashboard's top-bar **Docs** button still opens `/docs`.
