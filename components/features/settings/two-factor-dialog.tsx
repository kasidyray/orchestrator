"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Download04Icon, ShieldEnergyIcon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CopyButton } from "@/components/shared/copy-button"
import { OtpInput } from "@/components/shared/otp-input"
import { Spinner } from "@/components/shared/spinner"

// MOCK — a real build derives these server-side per enrolment.
const MOCK_SECRET = "JBSW Y3DP EHPK 3PXP QR7T"
export const MOCK_RECOVERY_CODES = [
  "4F9K-2Q7M",
  "8XR3-1PLD",
  "T6WN-9K2A",
  "3ZC7-QM4E",
  "R8YP-2N6K",
  "9D4X-L7QT",
  "K2M8-3PWR",
  "6QV1-Z9NF",
]

type Step = "scan" | "verify" | "recovery"

/** Multi-step authenticator-app enrolment: scan → verify → save recovery codes. */
export function TwoFactorDialog({
  open,
  onOpenChange,
  onEnabled,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEnabled: () => void
}) {
  const [step, setStep] = React.useState<Step>("scan")
  const [code, setCode] = React.useState("")
  const [verifying, setVerifying] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [saved, setSaved] = React.useState(false)

  // Reset to a clean state whenever the dialog reopens — adjusted during
  // render (comparing against the previous `open`) rather than in an effect.
  const [wasOpen, setWasOpen] = React.useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setStep("scan")
      setCode("")
      setVerifying(false)
      setError(false)
      setSaved(false)
    }
  }

  async function handleVerify() {
    setVerifying(true)
    setError(false)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setVerifying(false)
    // MOCK: any complete 6-digit code passes, since the QR isn't a real secret.
    if (code.length < 6) {
      setError(true)
      return
    }
    setStep("recovery")
  }

  function handleDownload() {
    const blob = new Blob(
      [
        `Optimus Business — two-factor recovery codes\n\n${MOCK_RECOVERY_CODES.join(
          "\n"
        )}\n\nEach code can be used once. Keep them somewhere safe.\n`,
      ],
      { type: "text/plain" }
    )
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "optimus-recovery-codes.txt"
    anchor.click()
    URL.revokeObjectURL(url)
    toast.success("Recovery codes downloaded")
  }

  function handleFinish() {
    onEnabled()
    onOpenChange(false)
    toast.success("Two-factor authentication enabled")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {step === "scan" ? (
          <>
            <DialogHeader>
              <DialogTitle>Set up authenticator app</DialogTitle>
              <DialogDescription>
                Scan the QR code with Google Authenticator, 1Password, or Authy —
                or enter the key manually.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center gap-4">
              <QrPlaceholder />
              <div className="flex w-full items-center gap-2 rounded-lg border border-border bg-muted/40 py-1 pr-1 pl-3">
                <span className="min-w-0 flex-1 truncate font-mono text-sm tracking-wide text-foreground">
                  {MOCK_SECRET}
                </span>
                <CopyButton value={MOCK_SECRET} label="Copy setup key" />
              </div>
            </div>

            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button onClick={() => setStep("verify")}>Continue</Button>
            </DialogFooter>
          </>
        ) : step === "verify" ? (
          <>
            <DialogHeader>
              <DialogTitle>Enter the 6-digit code</DialogTitle>
              <DialogDescription>
                Enter the code shown in your authenticator app to confirm
                it&apos;s linked.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 py-1">
              <OtpInput
                value={code}
                onValueChange={(value) => {
                  if (error) setError(false)
                  setCode(value)
                }}
                onComplete={handleVerify}
                disabled={verifying}
                autoFocus
              />
              {error ? (
                <p className="text-center text-sm text-destructive">
                  Enter the full 6-digit code from your app.
                </p>
              ) : null}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("scan")}>
                Back
              </Button>
              <Button
                onClick={handleVerify}
                disabled={verifying || code.length < 6}
              >
                {verifying ? (
                  <>
                    <Spinner /> Verifying…
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Save your recovery codes</DialogTitle>
              <DialogDescription>
                Use a recovery code to sign in if you lose access to your app.
                Each code works once.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-muted/40 p-3">
                {MOCK_RECOVERY_CODES.map((recoveryCode) => (
                  <span
                    key={recoveryCode}
                    className="text-center font-mono text-sm tracking-wide text-foreground"
                  >
                    {recoveryCode}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <CopyButton
                  value={MOCK_RECOVERY_CODES.join("\n")}
                  label="Copy recovery codes"
                />
                <span className="text-xs text-muted-foreground">Copy</span>
                <span className="mx-1 h-4 w-px bg-border" aria-hidden />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto gap-1.5 px-1 text-muted-foreground"
                  onClick={handleDownload}
                >
                  <HugeiconsIcon icon={Download04Icon} className="size-4" />
                  Download
                </Button>
              </div>

              <label className="flex cursor-pointer items-center gap-2 select-none">
                <Checkbox
                  checked={saved}
                  onCheckedChange={(checked) => setSaved(checked === true)}
                />
                <span className="text-sm text-foreground">
                  I&apos;ve saved my recovery codes
                </span>
              </label>
            </div>

            <DialogFooter>
              <Button onClick={handleFinish} disabled={!saved}>
                <HugeiconsIcon icon={ShieldEnergyIcon} className="size-4" />
                Turn on two-factor
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

/** One corner "finder" square of the faux QR code. */
function Finder({ x, y }: { x: number; y: number }) {
  return (
    <>
      <rect x={x} y={y} width={7} height={7} rx={1.5} fill="var(--foreground)" />
      <rect
        x={x + 1}
        y={y + 1}
        width={5}
        height={5}
        rx={1}
        fill="var(--background)"
      />
      <rect x={x + 2} y={y + 2} width={3} height={3} fill="var(--foreground)" />
    </>
  )
}

/** Decorative faux QR code — a deterministic module grid, not a real secret. */
function QrPlaceholder() {
  const size = 21
  const modules: { x: number; y: number }[] = []

  const inFinder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (inFinder(x, y)) continue
      // Stable pseudo-pattern — no randomness, so it never hydration-mismatches.
      if ((x * 13 + y * 7 + 5) % 3 === 0) modules.push({ x, y })
    }
  }

  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <svg
        width={148}
        height={148}
        viewBox={`0 0 ${size} ${size}`}
        shapeRendering="crispEdges"
        aria-hidden
      >
        {modules.map((module) => (
          <rect
            key={`${module.x}-${module.y}`}
            x={module.x}
            y={module.y}
            width={1}
            height={1}
            fill="var(--foreground)"
          />
        ))}
        <Finder x={0} y={0} />
        <Finder x={size - 7} y={0} />
        <Finder x={0} y={size - 7} />
      </svg>
    </div>
  )
}
