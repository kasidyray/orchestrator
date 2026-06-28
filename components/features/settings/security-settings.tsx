"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { SquareLock02Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PasswordInput } from "@/components/features/auth/password-input"
import { SectionCard } from "@/components/shared/section-card"
import { Spinner } from "@/components/shared/spinner"

export function SecuritySettings() {
  const [current, setCurrent] = React.useState("")
  const [next, setNext] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [error, setError] = React.useState<string | undefined>()
  const [saving, setSaving] = React.useState(false)
  const [twoFactor, setTwoFactor] = React.useState(false)

  async function handleUpdate(event: React.FormEvent) {
    event.preventDefault()
    if (!current || !next || !confirm) {
      setError("Fill in all password fields")
      return
    }
    if (next.length < 8) {
      setError("New password must be at least 8 characters")
      return
    }
    if (next !== confirm) {
      setError("New passwords don't match")
      return
    }
    setError(undefined)
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSaving(false)
    setCurrent("")
    setNext("")
    setConfirm("")
    toast.success("Password updated")
  }

  function toggleTwoFactor(enabled: boolean) {
    setTwoFactor(enabled)
    toast.success(
      enabled ? "Two-factor authentication enabled" : "Two-factor disabled"
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleUpdate}>
        <SectionCard
          title="Password"
          description="Use a strong password you don't reuse elsewhere."
        >
          <div className="grid gap-4 sm:max-w-md">
            <div className="flex flex-col gap-2">
              <Label htmlFor="current-password">Current password</Label>
              <PasswordInput
                id="current-password"
                value={current}
                onChange={(event) => setCurrent(event.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-password">New password</Label>
              <PasswordInput
                id="new-password"
                value={next}
                onChange={(event) => setNext(event.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <PasswordInput
                id="confirm-password"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                autoComplete="new-password"
              />
            </div>
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
          </div>

          <div className="mt-5 flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Spinner /> Updating…
                </>
              ) : (
                "Update password"
              )}
            </Button>
          </div>
        </SectionCard>
      </form>

      <SectionCard
        title="Two-factor authentication"
        description="Add an extra layer of security to your account."
      >
        <div className="flex items-center justify-between gap-4 rounded-lg border border-border px-3.5 py-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <HugeiconsIcon icon={SquareLock02Icon} className="size-4.5" />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                Authenticator app
              </span>
              <span className="text-xs text-muted-foreground">
                Require a one-time code at sign-in.
              </span>
            </div>
          </div>
          <Switch
            checked={twoFactor}
            onCheckedChange={toggleTwoFactor}
            aria-label="Enable two-factor authentication"
          />
        </div>
      </SectionCard>
    </div>
  )
}
