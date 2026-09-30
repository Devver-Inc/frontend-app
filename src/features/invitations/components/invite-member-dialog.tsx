import { zodResolver } from "@hookform/resolvers/zod"
import { UserPlus } from "lucide-react"
import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useCreateInvitation } from "@/features/invitations/hooks/use-create-invitation"
import { inviteMemberSchema } from "@/features/invitations/schemas/invitation.schema"
import { useOrganizationRoles } from "@/features/members/hooks/use-organization-roles"
import { capitalize } from "@/lib/utils/capitalize"
import { getFirstErrorMessage } from "@/lib/utils/form-errors"

const DEFAULT_ROLE_NAME = "developer"

const ROLE_DESCRIPTIONS: Record<string, string | undefined> = {
  admin: "Full access to all organization resources",
  developer: "Can deploy and manage assigned projects",
  viewer: "Read-only access to assigned projects",
}

export function InviteMemberDialog() {
  const [open, setOpen] = useState(false)
  const createInvitation = useCreateInvitation()
  const { data: roles = [] } = useOrganizationRoles()
  const form = useForm({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { invitee: "", organizationRoleId: "" },
  })
  const [invitee, organizationRoleId] = useWatch({
    control: form.control,
    name: ["invitee", "organizationRoleId"],
  })

  const defaultRoleId =
    roles.find((role) => role.name === DEFAULT_ROLE_NAME)?.id ?? roles.at(0)?.id
  const selectedRoleId = organizationRoleId || defaultRoleId
  const selectedRole = roles.find((role) => role.id === selectedRoleId)
  const roleDescription = selectedRole && ROLE_DESCRIPTIONS[selectedRole.name]

  const onSubmit = form.handleSubmit(
    (input) => {
      if (!selectedRoleId) return
      createInvitation.mutate(
        { invitee: input.invitee, organizationRoleIds: [selectedRoleId] },
        {
          onSuccess: () => {
            setOpen(false)
            form.reset()
            toast.success("Invitation sent successfully.")
          },
        }
      )
    },
    (errors) => toast.error(getFirstErrorMessage(errors))
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Invite New Member</DialogTitle>
            <DialogDescription>
              Add a new member to your team and define their permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <Controller
              name="invitee"
              control={form.control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Email *</Label>
                  <Input
                    {...field}
                    id="invite-email"
                    type="email"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              )}
            />

            <div className="space-y-2">
              <Label htmlFor="invite-role">Role</Label>
              {roles.length > 0 ? (
                <>
                  <Controller
                    name="organizationRoleId"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={selectedRoleId}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="invite-role" className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {capitalize(role.name)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {roleDescription && (
                    <p className="text-xs text-muted-foreground">
                      {roleDescription}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No roles available. The member will be added without a
                  specific role.
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createInvitation.isPending || !invitee.trim()}
            >
              {createInvitation.isPending ? "Sending..." : "Send Invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
