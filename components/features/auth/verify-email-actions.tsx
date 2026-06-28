"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/shared/spinner"
import { useAppStore } from "@/store"
import { MOCK_SIGNUP_ACCOUNT } from "@/lib/mock-auth"

const RESEND_COOLDOWN_SECONDS = 30

export function VerifyEmailActions() {
  const router = useRouter()
  const signIn = useAppStore((state) => state.signIn)
  const [continuing, setContinuing] = React.useState(false)
  const [resending, setResending] = React.useState(false)
  const [cooldown, setCooldown] = React.useState(0)

  React.useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  async function handleContinue() {
    setContinuing(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    // MOCK: a fresh sign-up lands as the new, not-yet-set-up business.
    signIn({
      user: MOCK_SIGNUP_ACCOUNT.user,
      org: MOCK_SIGNUP_ACCOUNT.org,
      setupCompletion: MOCK_SIGNUP_ACCOUNT.setupCompletion,
      hasSampleData: MOCK_SIGNUP_ACCOUNT.hasSampleData,
    })
    router.push("/dashboard")
  }

  async function handleResend() {
    setResending(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setResending(false)
    setCooldown(RESEND_COOLDOWN_SECONDS)
    toast.success("Verification email sent")
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <Button onClick={handleContinue} className="w-full" disabled={continuing}>
        {continuing ? (
          <>
            <Spinner /> Taking you in…
          </>
        ) : (
          <>
            Continue to dashboard
            <HugeiconsIcon icon={ArrowRight01Icon} />
          </>
        )}
      </Button>
      <Button
        variant="ghost"
        onClick={handleResend}
        className="w-full"
        disabled={resending || cooldown > 0}
      >
        {resending ? (
          <>
            <Spinner /> Sending…
          </>
        ) : cooldown > 0 ? (
          `Resend email in ${cooldown}s`
        ) : (
          "Resend email"
        )}
      </Button>
    </div>
  )
}
