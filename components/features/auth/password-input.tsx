"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type">

/** Password field with a show/hide toggle. */
export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [show, setShow] = React.useState(false)

  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        className={cn("pr-9", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((value) => !value)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <HugeiconsIcon
          icon={show ? ViewOffSlashIcon : ViewIcon}
          className="size-4"
        />
      </button>
    </div>
  )
}
