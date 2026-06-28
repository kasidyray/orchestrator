"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/features/auth/password-input"
import { Spinner } from "@/components/shared/spinner"
import { useAppStore } from "@/store"
import { authenticateMock, MOCK_ACCOUNTS } from "@/lib/mock-auth"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface LoginErrors {
  email?: string
  password?: string
}

export function LoginForm() {
  const router = useRouter()
  const signIn = useAppStore((state) => state.signIn)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [remember, setRemember] = React.useState(true)
  const [errors, setErrors] = React.useState<LoginErrors>({})
  const [submitting, setSubmitting] = React.useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const nextErrors: LoginErrors = {}
    if (!email) nextErrors.email = "Enter your email address"
    else if (!EMAIL_RE.test(email))
      nextErrors.email = "Enter a valid email address"
    if (!password) nextErrors.password = "Enter your password"

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const account = authenticateMock(email, password)
    if (!account) {
      setSubmitting(false)
      setErrors({ password: "Incorrect email or password" })
      toast.error("Couldn't sign in — check your email and password.")
      return
    }

    signIn({
      user: account.user,
      org: account.org,
      setupCompletion: account.setupCompletion,
      hasSampleData: account.hasSampleData,
    })
    toast.success(`Signed in as ${account.user.name}`)
    router.push("/dashboard")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(errors.email)}
          disabled={submitting}
        />
        {errors.email ? (
          <p className="text-xs text-destructive">{errors.email}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/login"
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(errors.password)}
          disabled={submitting}
        />
        {errors.password ? (
          <p className="text-xs text-destructive">{errors.password}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          checked={remember}
          onCheckedChange={(checked) => setRemember(checked === true)}
          disabled={submitting}
        />
        <Label htmlFor="remember" className="font-normal text-muted-foreground">
          Keep me signed in
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? (
          <>
            <Spinner /> Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <DemoAccounts
        disabled={submitting}
        onPick={(account) => {
          setEmail(account.email)
          setPassword(account.password)
          setErrors({})
        }}
      />
    </form>
  )
}

/* -------------------------------------------------------------------------- */
/*  MOCK ONLY — demo-account quick fill. Delete this block (and its render      */
/*  above) once real authentication is in place.                               */
/* -------------------------------------------------------------------------- */
function DemoAccounts({
  disabled,
  onPick,
}: {
  disabled: boolean
  onPick: (account: (typeof MOCK_ACCOUNTS)[number]) => void
}) {
  return (
    <div className="mt-2 flex flex-col gap-2 rounded-lg border border-dashed border-border bg-muted/40 p-3">
      <p className="text-xs font-medium text-muted-foreground">
        Demo accounts — tap to fill, then sign in
      </p>
      <div className="flex flex-col gap-2">
        {MOCK_ACCOUNTS.map((account) => (
          <button
            key={account.email}
            type="button"
            disabled={disabled}
            onClick={() => onPick(account)}
            className="flex flex-col rounded-md border border-border bg-card px-3 py-2 text-left transition-colors hover:bg-muted disabled:opacity-50"
          >
            <span className="text-sm font-medium text-foreground">
              {account.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {account.hint}
            </span>
            <span className="mt-1 font-mono text-[11px] text-muted-foreground">
              {account.email} · {account.password}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
