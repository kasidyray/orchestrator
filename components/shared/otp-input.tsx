"use client"

import * as React from "react"
import { OTPField } from "@base-ui/react/otp-field"

import { cn } from "@/lib/utils"

interface OtpInputProps {
  /** Number of digit slots. */
  length?: number
  value: string
  onValueChange: (value: string) => void
  /** Fires once every slot is filled. */
  onComplete?: (value: string) => void
  disabled?: boolean
  autoFocus?: boolean
  className?: string
}

/** Segmented one-time-code input — wraps base-ui `OTPField`, styled with tokens. */
export function OtpInput({
  length = 6,
  value,
  onValueChange,
  onComplete,
  disabled,
  autoFocus,
  className,
}: OtpInputProps) {
  return (
    <OTPField.Root
      length={length}
      value={value}
      onValueChange={onValueChange}
      onValueComplete={onComplete}
      disabled={disabled}
      className={cn("flex items-center justify-center gap-2", className)}
    >
      {Array.from({ length }).map((_, index) => (
        <OTPField.Input
          key={index}
          autoFocus={autoFocus && index === 0}
          className={cn(
            "size-12 rounded-lg border border-input bg-background text-center text-lg font-semibold text-foreground shadow-xs outline-none transition-[color,box-shadow,border-color] duration-100",
            "focus:border-ring focus:ring-2 focus:ring-ring/40",
            "data-[filled]:border-ring/50",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
      ))}
    </OTPField.Root>
  )
}
