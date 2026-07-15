import type { Metadata } from "next"
import Link from "next/link"

import { SdkCard } from "@/components/docs/sdk-card"
import { SDK_DOWNLOADS } from "@/lib/constants"

export const metadata: Metadata = {
  title: "SDKs & tools",
  description:
    "Official client libraries, the Postman collection, and the OpenAPI spec for the Optimus API.",
}

export default function SdksPage() {
  return (
    <div>
      <h1 className="mb-3 text-2xl font-semibold tracking-tight text-foreground">
        SDKs & tools
      </h1>
      <p className="my-4 text-sm leading-7 text-muted-foreground">
        Official client libraries and machine-readable definitions for the
        Optimus API. The SDKs wrap every endpoint in the{" "}
        <Link
          href="/docs/api-reference"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          API reference
        </Link>{" "}
        with typed methods, automatic retries, and idempotency keys.
      </p>

      <div className="my-6 grid gap-4 sm:grid-cols-2">
        {SDK_DOWNLOADS.map((download) => (
          <SdkCard key={download.name} download={download} />
        ))}
      </div>

      <p className="my-4 text-sm leading-7 text-muted-foreground">
        Prefer raw HTTP? Start from the{" "}
        <Link
          href="/docs/code-samples"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          code samples
        </Link>
        .
      </p>
    </div>
  )
}
