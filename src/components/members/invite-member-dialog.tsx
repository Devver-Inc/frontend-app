import { useState } from 'react'
import { toast } from 'sonner'
import { UserPlus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useCreateInvitation,
  useOrganizationRoles,
} from '@/lib/hooks/use-members'

const ROLE_DESCRIPTIONS: Record<string, string> = {
  admin: 'Full access to all organization resources',
  developer: 'Can deploy and manage assigned projects',
  viewer: 'Read-only access to assigned projects',
}

export function InviteMemberDialog() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [roleId, setRoleId] = useState('')

  const { mutate, isPending } = useCreateInvitation()
  const { data: roles = [] } = useOrganizationRoles()

  const defaultRoleId =
    roles.find((r) => r.name === 'developer')?.id ?? roles[0]?.id

  const selectedRoleId = roleId || defaultRoleId
  const selectedRole = roles.find((r) => r.id === selectedRoleId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !selectedRoleId) return

    mutate(
      {
        invitee: email.trim(),
        organizationRoleIds: [selectedRoleId],
      },
      {
        onSuccess: () => {
          setOpen(false)
          setEmail('')
          setRoleId('')
          toast.success('Invitation sent successfully.')
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to send invitation.')
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Invite New Member</DialogTitle>
            <DialogDescription>
              Add a new member to your team and define their permissions.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email *</Label>
              <Input
                id="invite-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invite-role">Role</Label>
              {roles.length > 0 ? (
                <>
                  <Select value={selectedRoleId} onValueChange={setRoleId}>
                    <SelectTrigger id="invite-role" className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name.charAt(0).toUpperCase() + r.name.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedRole && ROLE_DESCRIPTIONS[selectedRole.name] && (
                    <p className="text-xs text-muted-foreground">
                      {ROLE_DESCRIPTIONS[selectedRole.name]}
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
            <Button type="submit" disabled={isPending || !email.trim()}>
              {isPending ? 'Sending...' : 'Send Invite'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
