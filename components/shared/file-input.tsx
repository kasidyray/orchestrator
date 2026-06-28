"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Cancel01Icon,
  CloudUploadIcon,
  File01Icon,
} from "@hugeicons/core-free-icons"

import { Label } from "@/components/ui/label"
import { cn, formatFileSize } from "@/lib/utils"

export interface UploadedFileMeta {
  name: string
  size: number
}

interface FileInputProps {
  id: string
  label: string
  hint?: string
  accept?: string
  value: UploadedFileMeta | null
  onChange: (file: UploadedFileMeta | null) => void
}

/**
 * UI-only file picker. Captures the selected file's name and size — no upload
 * happens. Supports click and drag-and-drop.
 */
export function FileInput({
  id,
  label,
  hint,
  accept = ".pdf,.png,.jpg,.jpeg",
  value,
  onChange,
}: FileInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = React.useState(false)

  function selectFile(file: File | undefined) {
    if (!file) return
    onChange({ name: file.name, size: file.size })
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>

      {value ? (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground">
            <HugeiconsIcon icon={File01Icon} className="size-4.5" />
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-foreground">
              {value.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatFileSize(value.size)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onChange(null)
              if (inputRef.current) inputRef.current.value = ""
            }}
            aria-label={`Remove ${label}`}
            className="ml-auto flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            selectFile(event.dataTransfer.files?.[0])
          }}
          className={cn(
            "flex flex-col items-center gap-1.5 rounded-lg border border-dashed border-border px-4 py-6 text-center transition-colors hover:border-ring hover:bg-muted/40",
            dragging && "border-ring bg-muted/60"
          )}
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <HugeiconsIcon icon={CloudUploadIcon} className="size-5" />
          </span>
          <span className="text-sm font-medium text-foreground">
            Click to upload or drag and drop
          </span>
          {hint ? (
            <span className="text-xs text-muted-foreground">{hint}</span>
          ) : null}
        </button>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => selectFile(event.target.files?.[0])}
      />
    </div>
  )
}
