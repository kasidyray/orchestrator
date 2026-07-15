# Afrinvest Optimus — Project Intelligence & Build Standards

> This file is read at the start of every session. It is the law. If it conflicts
> with default instincts, **this file wins.**

---

## PART 1 — PROJECT INTELLIGENCE

### Product identity

- **Product:** Afrinvest Optimus
- **Type:** B2B SaaS — financial infrastructure portal
- **Primary user:** Business operators at fintechs, cooperatives, and financial
  brands in Nigeria/Africa who launch branded wallet and savings products for
  their customers.
- **The one feeling this product must produce:** _"This is serious financial
  infrastructure. I trust it with my business."_
- **Inspiration:** Stripe Dashboard, Clerk, Resend, Vercel, Linear, Mercury.
  Enterprise financial aesthetic — clean, dense, precise. Not flashy, not
  playful. Trustworthy through restraint. Mercury sets the bar: financial data
  that feels calm, considered, and human without losing authority.

### Frontend-only, mock-data build

- No backend, no API calls, no auth logic. All data is static mock data from
  `lib/mock-data.ts`.
- Forms never submit to a backend: show an 800ms mock loading state → success
  toast → update local UI state.

---

## ⚠️ ACTUAL STACK (verified — not the generic spec)

This project is **not** the classic Next 14 / Tailwind-config / Radix-shadcn /
lucide setup. The real, on-disk stack is:

| Area | Reality |
|---|---|
| Framework | **Next.js 16.2.6** (App Router, Turbopack), React 19.2.4 |
| Language | TypeScript **strict** — zero `any`, zero `@ts-ignore` |
| Styling | **Tailwind v4, CSS-first** — there is **NO `tailwind.config.ts`**. All tokens live in `app/globals.css` |
| Components | **shadcn `base-vega` on `@base-ui/react`** (NOT Radix) — namespace-part API: `<Dialog.Root>`, `<Select.Trigger>`, etc. |
| Icons | **Hugeicons** (`components.json` `iconLibrary: "hugeicons"`) — `@hugeicons/react` + `@hugeicons/core-free-icons` |
| State | **Zustand** (`store/index.ts`, placeholder slice — installed, not actively used) |
| Server state | **TanStack Query** (configured in `providers/index.tsx` — not actively used) |
| Page loading | **nextjs-toploader** (wired in `providers/index.tsx`) |
| Toasts | **sonner** (`<Toaster>` in `providers/index.tsx`) |

### Next.js 16 gotchas (differ from training data)

- **Dynamic `params`/`searchParams` are Promises.** Dynamic pages must
  `await params`:
  ```tsx
  export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
  }
  ```
  In Client Components, unwrap with React's `use()`.
- Layouts/pages are **Server Components** by default. Add `"use client"` only on
  the specific interactive leaf (providers, toploader, copy button, forms, etc.).
  Keep `app/layout.tsx` a Server Component — all client providers live in
  `providers/index.tsx`.
- Read `node_modules/next/dist/docs/` before relying on any App Router API.

### Hugeicons usage

```tsx
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"

<HugeiconsIcon icon={Search01Icon} className="size-4" />
```

- **base-ui `Button` rendering a link:** when you do `<Button render={<Link .../>}>`
  you must also pass `nativeButton={false}` (it renders an anchor, not a `<button>`).
  `DropdownMenuItem`/`MenuItem` rendering a `<Link>` does NOT need this.

- Icon constants are passed as **values** (e.g. `NavItem.icon: IconSvgElement`),
  rendered through `<HugeiconsIcon icon={...} />` — they are not components.
- **Verify an icon name exists** in `@hugeicons/core-free-icons` before importing
  (names vary: `ApiIcon` not `Api01Icon`, `WebhookIcon` not `Webhook01Icon`,
  `UserMultipleIcon` not `UserMulti02Icon`).
- `@tabler/icons-react` was removed in cleanup — do not introduce Tabler imports.

---

## Design system

### `globals.css` is the single source of truth

All colour, background, border, and ring values must use the CSS custom
properties defined in `app/globals.css`. Before using any colour in a component,
confirm a corresponding token exists. If it doesn't, **add it to `globals.css`
first** — then use it. Never work around the token system.

**Existing token values are locked.** You may only **append** new tokens
(additive edits). To add a colour utility in Tailwind v4 you must add it in
**three** places:

> **Re-baseline (owner-approved, Jul 2026):** `--radius` 0.875→0.75rem;
> `--primary` chroma 0.243→0.19 (light) / 0.199→0.17 (dark); `--sidebar-primary`
> chroma 0.245→0.19 (light) / 0.214→0.18 (dark). The values now in
> `globals.css` are the canonical locked set — do not "restore" the old ones,
> and do not change any token value again without explicit owner approval.
1. raw var in `:root`
2. raw var in `.dark`
3. `--color-*` mapping in the `@theme inline` block (mandatory — without it the
   `bg-*`/`text-*` utility will not generate)

**Tokens already available:** `background`, `foreground`, `card(/-foreground)`,
`popover(/-foreground)`, `primary(/-foreground)`, `secondary(/-foreground)`,
`muted(/-foreground)`, `accent(/-foreground)`, `destructive`, `border`, `input`,
`ring`, `chart-1..5`, `sidebar(/-*)`, plus the radius scale.

**Tokens added for this build:** `success(/-foreground)`,
`warning(/-foreground)`, `info(/-foreground)`, `env-sandbox(/-foreground)`,
`env-live(/-foreground)`, `env-live-locked(/-foreground)`.

#### ✅ Correct — semantic tokens
`bg-background` · `text-foreground` · `border-border` · `bg-card` · `bg-muted`
· `text-muted-foreground` · `bg-primary` · `bg-destructive` · `bg-success/10
text-success` · `ring-ring`

#### ❌ Never — raw palette / hex
`bg-blue-100` · `text-green-900` · `border-gray-200` · `text-slate-600` · any
inline hex in JSX or CSS.

**Before every component:** list the tokens it will use; confirm each exists in
`globals.css`; add any missing one first.

### shadcn component usage

- **Always check shadcn first.** Before writing any UI element, confirm whether a
  primitive exists (`Button`, `Card`, `Dialog`, `Drawer`/Sheet, `Table`, `Tabs`,
  `Badge`, `Input`, `Select`, `Skeleton`, `Avatar`, `Menu`/DropdownMenu,
  `Tooltip`, `Separator`, `Progress`, `Switch`, `Textarea`, etc.).
- If it exists — **use or wrap it.** Never rebuild it, never build a parallel version.
- **Customise by wrapping** in `components/shared/`. Pass `className` to override
  tokens. **Never hand-edit files in `components/ui/`** — shadcn regenerates them.
- Extensions must only use tokens that also exist in `globals.css`. Never fight a
  component's internal styling with hardcoded values.
- **Declare before you build.** At the start of a phase, list every shadcn
  component it needs and confirm it is installed (`components/ui/`). Install
  missing ones via `npx shadcn@latest add <name>` **before** feature code. On
  base-ui: Sheet = the `drawer` primitive; toasts = `sonner` (already wired).

---

## UX standards (non-negotiable)

### Top progress bar
Every route transition shows the `nextjs-toploader` bar — already wired in
`providers/index.tsx` (`color="var(--primary)"`, `height={3}`, `showSpinner={false}`).
Do not add a separate full-page spinner.

### Three screen states — every screen, every time
1. **Loading** — skeletons that mirror the exact shape and density of real
   content (a table skeleton has the same column/row count). Never a generic grey block.
2. **Empty** — Hugeicons icon + confident headline + one line of direction + a
   single primary CTA. Never "No data found." Use the shared `EmptyState`.
3. **Populated** — realistic mock data, 8–12+ records, with edge cases (long
   names, failed states, zero-wallet customers, expired keys).

### Feedback & async
- Every state-changing button shows an inline spinner while processing; it keeps
  its place and width — no layout shift.
- **Success:** sonner toast, top-right, 4s. Specific copy: "API key created",
  "Webhook saved" — never generic "Success."
- **Error:** sonner toast with an inline retry. Specific copy that names the
  problem and the fix: "Couldn't save webhook — check the URL and try again."
- **Optimistic UI** for low-risk actions (toggle, enable/disable, rename); revert on error.

### Motion (functional, not decorative)
Page fade + translateY(6→0) 120ms · modal scale(0.97→1) 180ms · overlay fade
150ms · drawer translateX 240ms · toast translateY(-6) 180ms · skeleton shimmer
1.4s · row hover bg 80ms + 2px primary left accent · button hover 80ms · nav
active bg 100ms · switch thumb 150ms · accordion height+opacity 200ms. **No
bounce, no spring, no staggered lists.** `prefers-reduced-motion` → no transitions.

### Delight (earned, not decorative)
Checklist tick stroke-fills + progress advances · `CopyButton` swaps to check for
2s · enabling a product transitions muted→full contrast · dashboard metric cards
count up 0→value 600ms (dashboard only) · row hover 2px primary left accent ·
contextual empty-state icons + copy with personality.

### Information density
Operators are professionals — default to density. Tables show all relevant
columns (6–7+). Metric cards show number + trend + label. Detail views show all
fields in labelled sections; no "show more" for primary data.

### Copy standards
- **Sentence case everywhere** — no Title Case In Buttons Or Headings.
- Active verbs on controls: "Save changes", "Revoke key", "Enable product."
- Status labels are nouns: "Active", "Revoked", "Under review", "Rejected."
- Errors name problem + fix: "HTTPS required — your URL must start with https://".
- Confirmation dialogs state the consequence before the action button.

### Destructive actions
Always gated by a Dialog with a consequence statement and a clearly labelled
action button ("Revoke key", "Remove member") — never "Confirm"/"OK". Use
`variant="destructive"` (the `destructive` token). Nothing custom.

---

## PART 2 — BUILD STANDARDS

### File structure

```
app/
  (auth)/            login, register, verify-email      ← centered, no shell
  (dashboard)/       layout.tsx (AppShell) + dashboard, customers/[id],
                     transactions, developer, settings
  docs/              PUBLIC standalone developer docs (own layout, no auth)
  setup/             layout.tsx + organisation, kyc, wallets, webhooks, api-keys
  layout.tsx         root (fonts) → <Providers>
  globals.css        all tokens (DO NOT restructure; additive only)
components/
  ui/                shadcn primitives — DO NOT hand-edit
  shared/            extended/composed: AppShell/, DataTable/, StatusBadge,
                     EmptyState, PageHeader, SectionCard, CopyButton
  features/          feature-specific: auth/ dashboard/ customers/ transactions/
                     setup/ developer/ settings/
  docs/              docs-only: layout shell, MDX registry, CodeBlock (shiki)
lib/                 mock-data.ts · types.ts · constants.ts · utils.ts ·
                     docs-nav.ts · shiki.ts
store/               index.ts (Zustand)
providers/           index.tsx (Theme + QueryClient + toploader + Toaster)
hooks/               use-environment.ts, etc.
```

### Developer docs area (`/docs`)

Standalone public MDX docs (Paystack-style) under `app/docs/`. **Before
editing anything docs-related, read `docs/MAINTAINING-DOCS.md`** — it has the
cookbook (add a page, add an endpoint, add an MDX component) and the
constraints. The two that bite:

- Turbopack only accepts **string-named** remark/rehype plugins in
  `next.config.ts`; syntax highlighting therefore lives in the
  `DocsCodeBlock` RSC (shiki), never a rehype plugin.
- The API reference, webhook catalog, and SDK list render from
  `lib/constants.ts` (`API_ENDPOINTS`, `WEBHOOK_EVENTS`, `SDK_DOWNLOADS`) —
  update the data, never duplicate it as prose. Sidebar + pager order live in
  `lib/docs-nav.ts`.

### Component rules
- **Named exports only** (except `page.tsx`, which is default).
- Every component receives **typed props from `lib/types.ts`** — no inline type
  defs for domain shapes.
- **No component imports from `lib/mock-data.ts`.** Pages import the data and pass
  it as props; components render props. Shared components stay data-agnostic.
- Never modify `components/ui/`. Extend/compose in `components/shared/` or `features/`.
- Max prop-drilling depth 2; beyond that use local context or the Zustand store.

### Code rules
- Strict TypeScript. Zero `any`, zero `@ts-ignore`.
- All formatting helpers in `lib/utils.ts`: `cn`, `formatCurrency`, `formatDate`,
  `truncateId`, `copyToClipboard`.
- **Currency:** `₦` with comma separators, 2dp (`₦1,250,000.00`) via `formatCurrency`.
- **Dates:** `formatDate` → "12 Jun 2024" / "12 Jun 2024, 14:30" — never raw ISO in UI.
- **IDs in UI:** truncated (`truncateId` → `cus_xk...f93`) with a `CopyButton`.
- No hardcoded colours in JSX — tokens only.
- Forms: controlled `useState`; on submit show 800ms loading → success toast →
  update UI state. (`react-hook-form`/`zod` are not used.)
- **Dates are ISO strings** in data; format at render to avoid hydration drift.

### Mock-data rules
One file (`lib/mock-data.ts`), one source of truth; all types in `lib/types.ts`.
Minimum volumes: Customers 12 · Transactions 25 · Webhooks 8 · Audit 15 · API
keys 3 (active/revoked/expired) · Team 4 (owner/admin/developer/support). Include
edge cases: long names/emails, zero-wallet customer, frozen wallet, failed/reversed
transactions, expired key, in-review KYB. Avatars `https://i.pravatar.cc/150?img=N`.
No Lorem Ipsum — realistic Nigerian fintech copy. Org: "Kuda Lite Technologies Ltd".

---

## Per-session workflow (the build prompt)

One session = one phase. Do not combine phases — drift increases with scope.

Before writing any code each session:
1. Confirm you've read this file.
2. List the shadcn components the phase needs; confirm installed or `add` them first.
3. List the `globals.css` tokens the phase uses; confirm each exists (add first if not).
4. Check `components/shared/` for existing components (EmptyState, StatusBadge,
   DataTable, etc.) — **reuse, never recreate.**
5. Build any missing shared component first, then the feature.
6. Build all three states for every screen (loading → empty → populated).
7. Build one screen completely before the next.

**Phase order:** 0 Foundation ✅ → 1 Auth → 2 App Shell → 3 Dashboard →
4 Org setup → 5 KYC → 6 Wallets → 7 Webhooks + API keys → 8 Customers
(list + `[id]`) → 9 Transactions (+ drawer) → 10 Settings → 11 Developer portal →
12 Polish & responsive. Final deliverable: `HANDOFF.md`.

### Foundation (Session 0) — done
Installed Hugeicons / Zustand / TanStack Query / nextjs-toploader / sonner; added
`badge card skeleton tooltip separator`; appended success/warning/info + env
tokens to `globals.css`; built `lib/{types,mock-data,constants,utils}.ts`,
`providers/index.tsx`, `store/index.ts`, and shared `EmptyState`, `StatusBadge`,
`PageHeader`, `SectionCard`, `CopyButton`. (The `/demo` exercise route and the
unused `SkeletonCard`/`Stepper` were removed in a later cleanup.)

---

## Key principles — never violate
1. One session = one phase.
2. Foundation before pages (types, mock data, shared components first).
3. Declare before you build (shadcn components + tokens).
4. `globals.css` is the only colour source — no raw palette, no hex, ever (additive token edits only).
5. shadcn first, always — wrap to customise, never rebuild.
6. No conflicts with shadcn's token system.
7. Top loading bar on every navigation (already wired).
8. Reuse `components/shared/` before building anything new.
9. Realistic data always — a real product, not a wireframe.
10. All three states on every screen — no exceptions.
