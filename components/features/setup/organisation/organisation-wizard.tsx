"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Building06Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  File01Icon,
  IdentityCardIcon,
  Location01Icon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/shared/spinner"
import { WizardShell, type WizardStep } from "@/components/shared/wizard"
import { ProfileStep } from "@/components/features/setup/organisation/profile-step"
import { RegistrationDocumentsStep } from "@/components/features/setup/organisation/registration-documents-step"
import { AddressStep } from "@/components/features/setup/organisation/address-step"
import { RepresentativeStep } from "@/components/features/setup/organisation/representative-step"
import { ReviewStep } from "@/components/features/setup/organisation/review-step"
import { useAppStore } from "@/store"
import type {
  OrgDocuments,
  OrgProfileErrors,
  OrgProfileField,
  OrgProfileValues,
  OrgRole,
} from "@/components/features/setup/organisation/types"

const STEPS: WizardStep[] = [
  { id: "profile", label: "Profile", icon: Building06Icon },
  { id: "registration", label: "Registration", icon: File01Icon },
  { id: "address", label: "Address", icon: Location01Icon },
  { id: "representative", label: "Representative", icon: IdentityCardIcon },
  { id: "review", label: "Review", icon: CheckmarkCircle02Icon },
]

const STEP_META = [
  {
    title: "Tell us about your business",
    description:
      "As a regulated financial services company, we would need to verify your identification and business registration information.",
  },
  {
    title: "Business registration documents",
    description:
      "Upload your CAC certificate of incorporation and memorandum & articles of association.",
  },
  {
    title: "How can we find you?",
    description:
      "Enter your registered business address. This is the address that is listed on all your business registration documents.",
  },
  {
    title: "Your business representative",
    description:
      "A business representative is either an owner, director or shareholder of your business.",
  },
  {
    title: "Review & submit",
    description: "Confirm your details before submitting for review.",
  },
]

const REVIEW_STEP = STEPS.length - 1

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function OrganisationWizard({
  initialValues,
}: {
  initialValues: OrgProfileValues
}) {
  const setSetupStep = useAppStore((state) => state.setSetupStep)

  const [step, setStep] = React.useState(0)
  const [maxReached, setMaxReached] = React.useState(0)
  const [values, setValues] = React.useState<OrgProfileValues>(initialValues)
  const [roles, setRoles] = React.useState<OrgRole[]>([])
  const [documents, setDocuments] = React.useState<OrgDocuments>({})
  const [errors, setErrors] = React.useState<OrgProfileErrors>({})
  const [rolesError, setRolesError] = React.useState<string | undefined>()
  const [submitting, setSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)

  function goTo(next: number) {
    setStep(next)
    setMaxReached((prev) => Math.max(prev, next))
  }

  function updateField(field: OrgProfileField, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function setDocument(id: string, file: OrgDocuments[string]) {
    setDocuments((prev) => ({ ...prev, [id]: file }))
  }

  function toggleRole(role: OrgRole) {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )
    setRolesError(undefined)
  }

  function validateProfile() {
    const next: OrgProfileErrors = {}
    if (!values.name.trim()) next.name = "Enter your business name"
    if (!values.rcNumber.trim()) next.rcNumber = "Enter your RC number"
    if (!values.email) next.email = "Enter a business email"
    else if (!EMAIL_RE.test(values.email))
      next.email = "Enter a valid email address"
    if (!values.phone.trim()) next.phone = "Enter a phone number"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function validateAddress() {
    const next: OrgProfileErrors = {}
    if (!values.address.trim()) next.address = "Enter your business address"
    if (!values.state) next.state = "Select a state"
    if (!values.country) next.country = "Select a country"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function validateRepresentative() {
    const next: OrgProfileErrors = {}
    if (!values.repFirstName.trim())
      next.repFirstName = "Enter the legal first name"
    if (!values.repLastName.trim())
      next.repLastName = "Enter the legal last name"
    if (!values.bvn) next.bvn = "Enter the 11-digit BVN"
    else if (values.bvn.length !== 11) next.bvn = "BVN must be 11 digits"
    setErrors(next)
    const hasRole = roles.length > 0
    setRolesError(hasRole ? undefined : "Select at least one role")
    return Object.keys(next).length === 0 && hasRole
  }

  function validateStep(index: number) {
    if (index === 0) return validateProfile()
    if (index === 2) return validateAddress()
    if (index === 3) return validateRepresentative()
    return true
  }

  function handleNext() {
    if (!validateStep(step)) return
    goTo(Math.min(step + 1, STEPS.length - 1))
  }

  function handleBack() {
    setStep((value) => Math.max(value - 1, 0))
  }

  async function handleSubmit() {
    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSubmitting(false)
    setSetupStep("organisation", true)
    setSubmitted(true)
    toast.success("Application submitted for review")
  }

  const meta = STEP_META[step]

  const footer = (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        onClick={handleBack}
        disabled={step === 0 || submitting}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} />
        Back
      </Button>

      {step < REVIEW_STEP ? (
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
    <>
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
            <ProfileStep
              values={values}
              errors={errors}
              onChange={updateField}
            />
          ) : null}
          {step === 1 ? (
            <RegistrationDocumentsStep
              documents={documents}
              onChange={setDocument}
            />
          ) : null}
          {step === 2 ? (
            <AddressStep
              values={values}
              errors={errors}
              onChange={updateField}
              proofDocument={documents["proof-address"] ?? null}
              onProofChange={(file) => setDocument("proof-address", file)}
            />
          ) : null}
          {step === 3 ? (
            <RepresentativeStep
              values={values}
              errors={errors}
              onChange={updateField}
              roles={roles}
              onToggleRole={toggleRole}
              rolesError={rolesError}
              idDocument={documents["director-id"] ?? null}
              onIdChange={(file) => setDocument("director-id", file)}
            />
          ) : null}
          {step === REVIEW_STEP ? (
            <ReviewStep values={values} roles={roles} documents={documents} />
          ) : null}
        </div>
      </WizardShell>

      <SubmittedDialog open={submitted} onOpenChange={setSubmitted} />
    </>
  )
}

function SubmittedDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <div className="flex flex-col items-center gap-5 py-2 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-info/10 text-info">
            <HugeiconsIcon icon={Clock01Icon} className="size-8" />
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-info/10 px-3 py-1 text-xs font-semibold text-info">
            <span className="size-1.5 rounded-full bg-info" />
            Under review
          </span>

          <div className="flex flex-col items-center gap-2">
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              Your application is under review
            </DialogTitle>
            <DialogDescription className="max-w-sm text-[15px] leading-relaxed">
              We&apos;re verifying your business documents. This usually takes
              1–2 business days — we&apos;ll email you once it&apos;s done.
            </DialogDescription>
          </div>

          <Button
            className="mt-1"
            render={<Link href="/dashboard" />}
            nativeButton={false}
          >
            Back to dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
