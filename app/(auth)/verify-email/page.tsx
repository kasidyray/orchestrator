import { HugeiconsIcon } from "@hugeicons/react"
import { MailValidation01Icon } from "@hugeicons/core-free-icons"

import { VerifyEmailActions } from "@/components/features/auth/verify-email-actions"

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <HugeiconsIcon icon={MailValidation01Icon} className="size-7" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Verify your email
        </h1>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">
            ikedi@kudalite.africa
          </span>
          . Enter it below to activate your account.
        </p>
      </div>

      <VerifyEmailActions />

    </div>
  )
}
