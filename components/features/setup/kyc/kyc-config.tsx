"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Shield01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { Spinner } from "@/components/shared/spinner"
import { introducedReqIds } from "@/components/features/kyc/kyc-state"
import { TierList } from "@/components/features/kyc/tier-list"
import { TierSheet } from "@/components/features/kyc/tier-sheet"
import { TierDeleteDialog } from "@/components/features/kyc/tier-delete-dialog"
import { useTierEditor } from "@/components/features/kyc/use-tier-editor"
import { useAppStore } from "@/store"

export function KycConfig() {
  const router = useRouter()
  const setSetupStep = useAppStore((state) => state.setSetupStep)
  const [saving, setSaving] = React.useState(false)

  const editor = useTierEditor(() => [])
  const { tiers } = editor

  async function handleSave() {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSaving(false)
    setSetupStep("kyc", true)
    toast.success("KYC configuration saved")
    router.push("/dashboard")
  }

  // Distinct checks across the ladder — inherited ones only count once.
  const totalChecks = tiers.reduce(
    (sum, _tier, index) => sum + introducedReqIds(tiers, index).length,
    0
  )
  const hasTiers = tiers.length > 0

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-2xl px-4 pt-8">
        {hasTiers ? (
          <TierList
            tiers={tiers}
            editingId={editor.editingId}
            onAdd={editor.openCreate}
            onEdit={editor.openEdit}
            onRemove={editor.requestRemove}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-border">
            <EmptyState
              icon={Shield01Icon}
              title="Set up your KYC tiers"
              description="Build your verification ladder from the ground up — each tier inherits the checks below it and adds its own."
              action={
                <Button onClick={editor.openCreate}>
                  <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                  Add tier
                </Button>
              }
            />
          </div>
        )}
      </div>

      {hasTiers ? (
        <div className="mt-auto border-t border-border py-4">
          <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-4">
            <p className="text-[13px] text-muted-foreground">
              {tiers.length} {tiers.length === 1 ? "tier" : "tiers"} ·{" "}
              {totalChecks} checks configured
            </p>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Spinner /> Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </div>
      ) : null}

      <TierSheet
        open={editor.sheetOpen}
        onOpenChange={editor.handleSheetOpenChange}
        draft={editor.draft}
        editing={Boolean(editor.editingId)}
        ladder={editor.ladder}
        insertIndex={editor.insertIndex}
        onInsertIndexChange={editor.setInsertIndex}
        onNameChange={(value) => editor.patchDraft({ name: value })}
        onDailyChange={(value) => editor.patchDraft({ daily: value })}
        onBalanceChange={(value) => editor.patchDraft({ balance: value })}
        onToggleReq={editor.toggleReq}
        onProviderChange={editor.setProvider}
        onSubmit={editor.submitTier}
      />

      <TierDeleteDialog
        target={editor.deleteTarget}
        tiers={tiers}
        onCancel={editor.cancelRemove}
        onConfirm={editor.confirmRemove}
      />
    </div>
  )
}
