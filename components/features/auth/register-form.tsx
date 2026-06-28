"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/features/auth/password-input"
import { Spinner } from "@/components/shared/spinner"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface RegisterErrors {
  name?: string
  email?: string
  organisation?: string
  password?: string
  terms?: string
}

export function RegisterForm() {
  const router = useRouter()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [organisation, setOrganisation] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [terms, setTerms] = React.useState(false)
  const [errors, setErrors] = React.useState<RegisterErrors>({})
  const [submitting, setSubmitting] = React.useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const nextErrors: RegisterErrors = {}
    if (!name.trim()) nextErrors.name = "Enter your full name"
    if (!email) nextErrors.email = "Enter your work email"
    else if (!EMAIL_RE.test(email))
      nextErrors.email = "Enter a valid email address"
    if (!organisation.trim())
      nextErrors.organisation = "Enter your organisation name"
    if (!password) nextErrors.password = "Choose a password"
    else if (password.length < 8)
      nextErrors.password = "Use at least 8 characters"
    if (!terms) nextErrors.terms = "Accept the terms to continue"

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    toast.success("Account created")
    router.push("/verify-email")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          placeholder="Ikedi Eze"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={Boolean(errors.name)}
          disabled={submitting}
        />
        {errors.name ? (
          <p className="text-xs text-destructive">{errors.name}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Work email</Label>
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
        <Label htmlFor="organisation">Organisation name</Label>
        <Input
          id="organisation"
          placeholder="Kuda Lite Technologies Ltd"
          autoComplete="organization"
          value={organisation}
          onChange={(event) => setOrganisation(event.target.value)}
          aria-invalid={Boolean(errors.organisation)}
          disabled={submitting}
        />
        {errors.organisation ? (
          <p className="text-xs text-destructive">{errors.organisation}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(errors.password)}
          disabled={submitting}
        />
        {errors.password ? (
          <p className="text-xs text-destructive">{errors.password}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="terms"
            checked={terms}
            onCheckedChange={(checked) => setTerms(checked === true)}
            aria-invalid={Boolean(errors.terms)}
            disabled={submitting}
          />
          <Label htmlFor="terms" className="font-normal text-muted-foreground">
            I agree to the terms and privacy policy
          </Label>
        </div>
        {errors.terms ? (
          <p className="text-xs text-destructive">{errors.terms}</p>
        ) : null}
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? (
          <>
            <Spinner /> Creating account…
          </>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  )
}
