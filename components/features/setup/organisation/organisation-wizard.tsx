"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Building06Icon,
  CheckmarkCircle02Icon,
  File01Icon,
  SecurityCheckIcon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/shared/spinner"
import { WizardShell, type WizardStep } from "@/components/shared/wizard"
import { ProfileStep } from "@/components/features/setup/organisation/profile-step"
import { DocumentsStep } from "@/components/features/setup/organisation/documents-step"
import { ReviewStep } from "@/components/features/setup/organisation/review-step"
import { StatusStep } from "@/components/features/setup/organisation/status-step"
import type { KYBStatus } from "@/lib/types"
import type {
  OrgDocuments,
  OrgProfileErrors,
  OrgProfileField,
  OrgProfileValues,
} from "@/components/features/setup/organisation/types"

const STEPS: WizardStep[] = [
  { id: "profile", label: "Profile", icon: Building06Icon },
  { id: "documents", label: "Documents", icon: File01Icon },
  { id: "review", label: "Review", icon: CheckmarkCircle02Icon },
  { id: "status", label: "Status", icon: SecurityCheckIcon },
]

const STEP_META = [
  {
    title: "Organisation profile",
    description: "Tell us about your registered business.",
  },
  {
    title: "Business documents",
    description: "Upload the documents we need for KYB verification.",
  },
  {
    title: "Review & submit",
    description: "Confirm your details before submitting for review.",
  },
  {
    title: "Verification status",
    description: "Track the progress of your KYB application.",
  },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function OrganisationWizard({
  initialValues,
}: {
  initialValues: OrgProfileValues
}) {
  const [step, setStep] = React.useState(0)
  const [maxReached, setMaxReached] = React.useState(0)
  const [values, setValues] = React.useState<OrgProfileValues>(initialValues)
  const [documents, setDocuments] = React.useState<OrgDocuments>({})
  const [errors, setErrors] = React.useState<OrgProfileErrors>({})
  const [submitting, setSubmitting] = React.useState(false)
  const [status, setStatus] = React.useState<KYBStatus>("in_review")

  function goTo(next: number) {
    setStep(next)
    setMaxReached((prev) => Math.max(prev, next))
  }

  function updateField(field: OrgProfileField, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validateProfile() {
    const next: OrgProfileErrors = {}
    if (!values.name.trim()) next.name = "Enter your business name"
    if (!values.rcNumber.trim()) next.rcNumber = "Enter your RC number"
    if (!values.email) next.email = "Enter a business email"
    else if (!EMAIL_RE.test(values.email))
      next.email = "Enter a valid email address"
    if (!values.phone.trim()) next.phone = "Enter a phone number"
    if (!values.address.trim()) next.address = "Enter your registered address"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleNext() {
    if (step === 0 && !validateProfile()) return
    goTo(Math.min(step + 1, STEPS.length - 1))
  }

  function handleBack() {
    setStep((value) => Math.max(value - 1, 0))
  }

  async function handleSubmit() {
    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSubmitting(false)
    setStatus("in_review")
    goTo(3)
    toast.success("Application submitted for review")
  }

  const meta = STEP_META[step]
  const onStatusStep = step === STEPS.length - 1

  const footer = onStatusStep ? null : (
    <div className="flex items-center justify-between border-t border-border pt-6">
      <Button
        variant="outline"
        onClick={handleBack}
        disabled={step === 0 || submitting}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} />
        Back
      </Button>

      {step < 2 ? (
        <Button onClick={handleNext}>
          Continue
          <HugeiconsIcon icon={ArrowRight01Icon} />
        </Button>
      ) : (
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? (
            <>
              <Spinner /> Submitting…
            </>
          ) : (
            "Submit for review"
          )}
        </Button>
      )}
    </div>
  )

  return (
    <WizardShell
      steps={STEPS}
      current={step}
      maxReached={maxReached}
      onStepSelect={(index) => setStep(index)}
      footer={footer}
    >
      <div
        key={step}
        className="flex flex-col gap-7 animate-in fade-in-0 slide-in-from-bottom-2 duration-200 motion-reduce:animate-none"
      >
        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {meta.title}
          </h2>
          <p className="text-sm text-muted-foreground">{meta.description}</p>
        </div>

        {step === 0 ? (
          <ProfileStep values={values} errors={errors} onChange={updateField} />
        ) : null}
        {step === 1 ? (
          <DocumentsStep
            documents={documents}
            onChange={(id, file) =>
              setDocuments((prev) => ({ ...prev, [id]: file }))
            }
          />
        ) : null}
        {step === 2 ? (
          <ReviewStep values={values} documents={documents} />
        ) : null}
        {step === 3 ? (
          <StatusStep status={status} onStatusChange={setStatus} />
        ) : null}
      </div>
    </WizardShell>
  )
}
