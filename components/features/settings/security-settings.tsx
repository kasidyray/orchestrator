"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { SquareLock02Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PasswordInput } from "@/components/features/auth/password-input"
import { SectionCard } from "@/components/shared/section-card"
import { Spinner } from "@/components/shared/spinner"
import { TwoFactorDialog } from "@/components/features/settings/two-factor-dialog"
import { cn } from "@/lib/utils"

export function SecuritySettings() {
  const [current, setCurrent] = React.useState("")
  const [next, setNext] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [error, setError] = React.useState<string | undefined>()
  const [saving, setSaving] = React.useState(false)
  const [twoFactor, setTwoFactor] = React.useState(false)
  const [setupOpen, setSetupOpen] = React.useState(false)
  const [disableOpen, setDisableOpen] = React.useState(false)

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

  function handleToggle(enabled: boolean) {
    // Enabling runs the setup flow; disabling asks for confirmation first.
    if (enabled) setSetupOpen(true)
    else setDisableOpen(true)
  }

  function handleDisable() {
    setTwoFactor(false)
    setDisableOpen(false)
    toast.success("Two-factor authentication disabled")
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
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-lg",
                twoFactor
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <HugeiconsIcon icon={SquareLock02Icon} className="size-4.5" />
            </span>
            <div className="flex flex-col">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                Authenticator app
                {twoFactor ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      className="size-3"
                      strokeWidth={3}
                    />
                    Enabled
                  </span>
                ) : null}
              </span>
              <span className="text-xs text-muted-foreground">
                Require a one-time code at sign-in.
              </span>
            </div>
          </div>
          <Switch
            checked={twoFactor}
            onCheckedChange={handleToggle}
            aria-label="Enable two-factor authentication"
          />
        </div>
      </SectionCard>

      <TwoFactorDialog
        open={setupOpen}
        onOpenChange={setSetupOpen}
        onEnabled={() => setTwoFactor(true)}
      />

      <Dialog open={disableOpen} onOpenChange={setDisableOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable two-factor authentication?</DialogTitle>
            <DialogDescription>
              Your account will be protected by your password alone, and your
              recovery codes will stop working. You can set it up again anytime.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button variant="destructive" onClick={handleDisable}>
              Disable 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
