"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/table"
import { StatusBadge } from "@/components/shared/status-badge"
import { Spinner } from "@/components/shared/spinner"
import { TEAM_ROLE_LABELS } from "@/lib/constants"
import { formatDate } from "@/lib/utils"
import type { TeamMember, TeamRole } from "@/lib/types"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ASSIGNABLE_ROLES: TeamRole[] = ["admin", "developer", "support"]

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export interface TeamSettingsHandle {
  openInvite: () => void
}

export function TeamSettings({
  members,
  ref,
  showInviteButton = true,
}: {
  members: TeamMember[]
  /** Imperative handle so a page-level header can trigger the invite flow. */
  ref?: React.Ref<TeamSettingsHandle>
  /** Render the in-card "Invite member" button. Set false when the page header owns it. */
  showInviteButton?: boolean
}) {
  const [team, setTeam] = React.useState<TeamMember[]>(members)

  const [inviteOpen, setInviteOpen] = React.useState(false)
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [inviteRole, setInviteRole] = React.useState<TeamRole>("developer")
  const [inviteError, setInviteError] = React.useState<string | undefined>()
  const [inviting, setInviting] = React.useState(false)

  const [removeTarget, setRemoveTarget] = React.useState<TeamMember | null>(
    null
  )

  React.useImperativeHandle(
    ref,
    () => ({ openInvite: () => setInviteOpen(true) }),
    []
  )

  function changeRole(id: string, role: TeamRole) {
    setTeam((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, role } : member
      )
    )
    toast.success("Role updated")
  }

  async function handleInvite() {
    if (!inviteEmail) {
      setInviteError("Enter an email address")
      return
    }
    if (!EMAIL_RE.test(inviteEmail)) {
      setInviteError("Enter a valid email address")
      return
    }
    setInviteError(undefined)
    setInviting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newMember: TeamMember = {
      id: `tm_${inviteEmail.split("@")[0]}_${team.length + 1}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      status: "invited",
      avatarUrl: `https://i.pravatar.cc/150?img=${(team.length % 70) + 1}`,
      joinedAt: new Date().toISOString(),
      lastActiveAt: null,
    }
    setTeam((prev) => [...prev, newMember])
    setInviting(false)
    setInviteOpen(false)
    setInviteEmail("")
    setInviteRole("developer")
    toast.success(`Invitation sent to ${newMember.email}`)
  }

  function handleRemove() {
    if (!removeTarget) return
    setTeam((prev) => prev.filter((member) => member.id !== removeTarget.id))
    const name = removeTarget.name
    setRemoveTarget(null)
    toast.success(`Removed ${name}`)
  }

  return (
    <Card>
      {showInviteButton ? (
        <CardHeader className="border-b">
          <CardAction>
            <Button size="sm" onClick={() => setInviteOpen(true)}>
              <HugeiconsIcon icon={PlusSignIcon} />
              Invite member
            </Button>
          </CardAction>
        </CardHeader>
      ) : null}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {team.map((member) => {
              const isOwner = member.role === "owner"
              return (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar size="sm">
                        <AvatarImage
                          src={member.avatarUrl}
                          alt={member.name}
                        />
                        <AvatarFallback>
                          {initials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium text-foreground">
                          {member.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {member.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isOwner ? (
                      <span className="text-sm text-muted-foreground">
                        {TEAM_ROLE_LABELS.owner}
                      </span>
                    ) : (
                      <Select
                        value={member.role}
                        onValueChange={(value) =>
                          changeRole(member.id, (value ?? member.role) as TeamRole)
                        }
                      >
                        <SelectTrigger size="sm" className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ASSIGNABLE_ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {TEAM_ROLE_LABELS[role]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      variant={member.status === "active" ? "success" : "warning"}
                      label={member.status === "active" ? "Active" : "Invited"}
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {member.lastActiveAt
                      ? formatDate(member.lastActiveAt)
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    {isOwner ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setRemoveTarget(member)}
                        aria-label={`Remove ${member.name}`}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <HugeiconsIcon icon={Delete02Icon} />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a team member</DialogTitle>
            <DialogDescription>
              They&apos;ll get an email invitation to join your organisation.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="invite-email">Email address</Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="teammate@kudalite.africa"
                aria-invalid={Boolean(inviteError)}
                disabled={inviting}
              />
              {inviteError ? (
                <p className="text-xs text-destructive">{inviteError}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="invite-role">Role</Label>
              <Select
                value={inviteRole}
                onValueChange={(value) =>
                  setInviteRole((value ?? "developer") as TeamRole)
                }
              >
                <SelectTrigger id="invite-role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNABLE_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {TEAM_ROLE_LABELS[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button onClick={handleInvite} disabled={inviting}>
              {inviting ? (
                <>
                  <Spinner /> Sending…
                </>
              ) : (
                "Send invitation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove confirmation */}
      <Dialog
        open={Boolean(removeTarget)}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove this member?</DialogTitle>
            <DialogDescription>
              Removing{" "}
              <span className="font-medium text-foreground">
                {removeTarget?.name}
              </span>{" "}
              will immediately revoke their access to your organisation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button variant="destructive" onClick={handleRemove}>
              Remove member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
