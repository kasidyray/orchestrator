"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

interface ComboFieldProps {
  /** Forwarded to the input so a FormField label can target it. */
  id?: string
  options: readonly string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  ariaInvalid?: boolean
}

/**
 * Single-select combobox over a flat list of string options — a searchable
 * drop-in for a Select. Wraps the shadcn/base-ui combobox so callers stay
 * declarative (options + value + onChange).
 */
export function ComboField({
  id,
  options,
  value,
  onChange,
  placeholder,
  ariaInvalid,
}: ComboFieldProps) {
  return (
    <Combobox
      items={[...options]}
      value={value || null}
      onValueChange={(next) => onChange(next ?? "")}
    >
      <ComboboxInput
        id={id}
        placeholder={placeholder}
        aria-invalid={ariaInvalid}
        className="h-10 w-full"
      />
      <ComboboxContent>
        <ComboboxEmpty>No matches found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
