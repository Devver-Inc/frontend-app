import { zodResolver } from "@hookform/resolvers/zod"
import { UserPlus } from "lucide-react"
import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { Field } from "@/components/common/field"
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

const DEFAULT_ROLE_NAME = "developer"

const ROLE_DESCRIPTIONS: Record<string, string | undefined> = {
  admin: "Manages the organization, its members, and every project.",
  developer: "Deploys and manages the projects they're assigned to.",
  viewer: "Reads the projects they're assigned to.",
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

  const onSubmit = form.handleSubmit((input) => {
    if (!selectedRoleId) return
    createInvitation.mutate(
      { invitee: input.invitee, organizationRoleIds: [selectedRoleId] },
      {
        onSuccess: () => {
          setOpen(false)
          form.reset()
          toast.success("Invitation sent.")
        },
      }
    )
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus />
          Invite member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form noValidate onSubmit={(event) => void onSubmit(event)}>
          <DialogHeader>
            <DialogTitle>Invite a member</DialogTitle>
            <DialogDescription>
              They get an email with a link to join.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 space-y-4">
            <Controller
              name="invitee"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  label="Email"
                  htmlFor="invite-email"
                  error={fieldState.error?.message}
                >
                  <Input
                    {...field}
                    id="invite-email"
                    type="email"
                    autoComplete="off"
                    placeholder="name@company.com"
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              )}
            />

            {roles.length > 0 && (
              <Controller
                name="organizationRoleId"
                control={form.control}
                render={({ field }) => (
                  <Field
                    label="Role"
                    htmlFor="invite-role"
                    hint={roleDescription}
                  >
                    <Select
                      value={selectedRoleId}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="invite-role" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {capitalize(role.name)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            )}
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
              {createInvitation.isPending ? "Sending..." : "Send invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
