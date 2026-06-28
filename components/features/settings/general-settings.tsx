"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SectionCard } from "@/components/shared/section-card"
import { Spinner } from "@/components/shared/spinner"
import { COUNTRY_OPTIONS, INDUSTRY_OPTIONS } from "@/lib/constants"
import type { Organisation } from "@/lib/types"

export function GeneralSettings({ org }: { org: Organisation }) {
  const [name, setName] = React.useState(org.name)
  const [email, setEmail] = React.useState(org.email)
  const [phone, setPhone] = React.useState(org.phone)
  const [address, setAddress] = React.useState(org.address)
  const [industry, setIndustry] = React.useState(org.industry)
  const [country, setCountry] = React.useState(org.country)
  const [saving, setSaving] = React.useState(false)

  async function handleSave(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSaving(false)
    toast.success("Organisation settings saved")
  }

  return (
    <form onSubmit={handleSave}>
      <SectionCard
        title="Organisation"
        description="These details appear on receipts and compliance records."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-name">Legal business name</Label>
            <Input
              id="settings-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-email">Business email</Label>
            <Input
              id="settings-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-phone">Phone number</Label>
            <Input
              id="settings-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-industry">Industry</Label>
            <Select
              value={industry}
              onValueChange={(value) => setIndustry(value ?? "")}
            >
              <SelectTrigger id="settings-industry" className="w-full">
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRY_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-country">Country</Label>
            <Select
              value={country}
              onValueChange={(value) => setCountry(value ?? "")}
            >
              <SelectTrigger id="settings-country" className="w-full">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRY_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="settings-address">Registered address</Label>
            <Input
              id="settings-address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Spinner /> Saving…
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </SectionCard>
    </form>
  )
}
