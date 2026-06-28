"use client"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Download01Icon,
  Globe02Icon,
  Key01Icon,
  PackageIcon,
  WebhookIcon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "@/components/shared/code-block"
import { CopyButton } from "@/components/shared/copy-button"
import { SectionCard } from "@/components/shared/section-card"
import { MethodBadge } from "@/components/features/developer/method-badge"
import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_SANDBOX_BASE_URL,
  SDK_DOWNLOADS,
  WEBHOOK_EVENTS,
} from "@/lib/constants"

const AUTH_SAMPLE = `curl ${API_BASE_URL}/customers \\
  -H "Authorization: Bearer sk_live_your_secret_key"`

const CREATE_CUSTOMER_CURL = `curl -X POST ${API_BASE_URL}/customers \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "first_name": "Adaeze",
    "last_name": "Okonkwo",
    "email": "adaeze@example.com",
    "phone": "+2348032214590"
  }'`

const CREATE_CUSTOMER_JS = `const res = await fetch("${API_BASE_URL}/customers", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.OPTIMUS_SECRET_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    first_name: "Adaeze",
    last_name: "Okonkwo",
    email: "adaeze@example.com",
  }),
})

const customer = await res.json()`

const TRANSFER_CURL = `curl -X POST ${API_BASE_URL}/transactions/transfer \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "wallet_id": "wlt_a1b2c3d4e5",
    "amount": 150000,
    "narration": "Vendor payout"
  }'`

const VERIFY_SIGNATURE_JS = `import { createHmac } from "crypto"

function verifySignature(payload, signature, secret) {
  const expected = createHmac("sha256", secret)
    .update(payload)
    .digest("hex")
  return signature === expected
}`

export function DeveloperTabs() {
  return (
    <Tabs defaultValue="overview" className="gap-6">
      <div className="overflow-x-auto">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="reference">API reference</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="samples">Code samples</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
        </TabsList>
      </div>

      {/* Overview */}
      <TabsContent value="overview" className="flex flex-col gap-5">
        <SectionCard
          title="The Optimus API"
          description="A single REST API for customers, wallets, KYC, transactions, and investments. All requests are made over HTTPS and authenticated with a secret key."
        >
          <div className="flex flex-col gap-3">
            <BaseUrlRow label="Live base URL" url={API_BASE_URL} />
            <BaseUrlRow label="Sandbox base URL" url={API_SANDBOX_BASE_URL} />
          </div>
        </SectionCard>

        <div className="grid gap-4 sm:grid-cols-3">
          <QuickLink
            icon={Key01Icon}
            title="Authentication"
            description="Authenticate requests with your secret key."
          />
          <QuickLink
            icon={Globe02Icon}
            title="API reference"
            description="Browse every endpoint by resource."
          />
          <QuickLink
            icon={WebhookIcon}
            title="Webhooks"
            description="Receive real-time event notifications."
          />
        </div>
      </TabsContent>

      {/* Authentication */}
      <TabsContent value="authentication" className="flex flex-col gap-5">
        <SectionCard
          title="Authenticating requests"
          description="Pass your secret key as a bearer token on every request. Keep live keys secret — never expose them in client-side code."
        >
          <div className="flex flex-col gap-4">
            <CodeBlock code={AUTH_SAMPLE} label="bash" />
            <p className="text-sm text-muted-foreground">
              Use test keys (<code className="font-mono text-xs">sk_test_…</code>
              ) against the sandbox, and live keys (
              <code className="font-mono text-xs">sk_live_…</code>) in
              production. Manage keys from the{" "}
              <Link
                href="/setup/api-keys"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                API keys
              </Link>{" "}
              page.
            </p>
          </div>
        </SectionCard>
      </TabsContent>

      {/* API reference */}
      <TabsContent value="reference" className="flex flex-col gap-5">
        {API_ENDPOINTS.map((group) => (
          <SectionCard key={group.resource} title={group.resource}>
            <ul className="flex flex-col divide-y divide-border">
              {group.endpoints.map((endpoint) => (
                <li
                  key={`${endpoint.method}-${endpoint.path}`}
                  className="flex items-center gap-3 py-2.5"
                >
                  <MethodBadge method={endpoint.method} />
                  <code className="font-mono text-xs text-foreground">
                    {endpoint.path}
                  </code>
                  <span className="ml-auto truncate text-right text-sm text-muted-foreground">
                    {endpoint.description}
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>
        ))}
      </TabsContent>

      {/* Webhooks */}
      <TabsContent value="webhooks" className="flex flex-col gap-5">
        <SectionCard
          title="Events"
          description="We POST a signed payload to your endpoint whenever one of these events occurs."
        >
          <ul className="flex flex-col divide-y divide-border">
            {WEBHOOK_EVENTS.map((item) => (
              <li
                key={item.event}
                className="flex items-center gap-3 py-2.5"
              >
                <code className="font-mono text-xs font-medium text-foreground">
                  {item.event}
                </code>
                <span className="ml-auto truncate text-right text-sm text-muted-foreground">
                  {item.description}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Verifying signatures"
          description="Compute an HMAC SHA-256 of the raw payload with your signing secret and compare it to the X-Optimus-Signature header."
        >
          <CodeBlock code={VERIFY_SIGNATURE_JS} label="javascript" />
        </SectionCard>
      </TabsContent>

      {/* Code samples */}
      <TabsContent value="samples" className="flex flex-col gap-5">
        <SectionCard title="Create a customer">
          <div className="flex flex-col gap-4">
            <CodeBlock code={CREATE_CUSTOMER_CURL} label="cURL" />
            <CodeBlock code={CREATE_CUSTOMER_JS} label="javascript" />
          </div>
        </SectionCard>
        <SectionCard title="Initiate a transfer">
          <CodeBlock code={TRANSFER_CURL} label="cURL" />
        </SectionCard>
      </TabsContent>

      {/* Downloads */}
      <TabsContent value="downloads" className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {SDK_DOWNLOADS.map((download) => (
            <SectionCard key={download.name}>
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <HugeiconsIcon icon={PackageIcon} className="size-5" />
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">
                    {download.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {download.description}
                  </span>
                  <span className="mt-1 font-mono text-xs text-muted-foreground">
                    {download.version}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success(`Downloading ${download.name}…`)}
                >
                  <HugeiconsIcon icon={Download01Icon} />
                  Download
                </Button>
              </div>
            </SectionCard>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}

function BaseUrlRow({ label, url }: { label: string; url: string }) {
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

function QuickLink({
  icon,
  title,
  description,
}: {
  icon: typeof Key01Icon
  title: string
  description: string
}) {
  return (
    <SectionCard>
      <div className="flex flex-col gap-2">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <HugeiconsIcon icon={icon} className="size-5" />
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1 text-sm font-medium text-foreground">
            {title}
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
          </span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      </div>
    </SectionCard>
  )
}
