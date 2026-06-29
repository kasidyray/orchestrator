"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/shared/spinner"
import { OtpInput } from "@/components/shared/otp-input"
import { useAppStore } from "@/store"
import { MOCK_SIGNUP_ACCOUNT } from "@/lib/mock-auth"

const RESEND_COOLDOWN_SECONDS = 30
const CODE_LENGTH = 6
// MOCK: the code "delivered" to the user's inbox in this frontend-only build.
const MOCK_VERIFICATION_CODE = "123456"

export function VerifyEmailActions() {
  const router = useRouter()
  const signIn = useAppStore((state) => state.signIn)
  const [code, setCode] = React.useState("")
  const [verifying, setVerifying] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [resending, setResending] = React.useState(false)
  const [cooldown, setCooldown] = React.useState(0)

  React.useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  async function verify(submitted: string) {
    setVerifying(true)
    setError(false)
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (submitted !== MOCK_VERIFICATION_CODE) {
      setVerifying(false)
      setError(true)
      setCode("")
      toast.error("That code didn't match — check your email and try again.")
      return
    }

    toast.success("Email verified")
    // MOCK: a fresh sign-up lands as the new, not-yet-set-up business.
    signIn({
      user: MOCK_SIGNUP_ACCOUNT.user,
      org: MOCK_SIGNUP_ACCOUNT.org,
      setupCompletion: MOCK_SIGNUP_ACCOUNT.setupCompletion,
      hasSampleData: MOCK_SIGNUP_ACCOUNT.hasSampleData,
    })
    router.push("/dashboard")
  }

  function handleChange(value: string) {
    if (error) setError(false)
    setCode(value)
  }

  async function handleResend() {
    setResending(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setResending(false)
    setCode("")
    setError(false)
    setCooldown(RESEND_COOLDOWN_SECONDS)
    toast.success("New code sent")
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <OtpInput
        length={CODE_LENGTH}
        value={code}
        onValueChange={handleChange}
        onComplete={verify}
        disabled={verifying}
        autoFocus
      />

      {error ? (
        <p className="text-center text-sm text-destructive">
          Incorrect code. Enter the latest 6-digit code from your email.
        </p>
      ) : null}

      <Button
        onClick={() => verify(code)}
        className="w-full"
        disabled={verifying || code.length < CODE_LENGTH}
      >
        {verifying ? (
          <>
            <Spinner /> Verifying…
          </>
        ) : (
          <>
            Verify email
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
          `Resend code in ${cooldown}s`
        ) : (
          "Resend code"
        )}
      </Button>
    </div>
  )
}
