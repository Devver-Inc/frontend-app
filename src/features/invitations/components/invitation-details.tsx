import { Building2, Mail, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Invitation } from "@/features/invitations/types/invitation.types"
import { capitalize } from "@/lib/utils/capitalize"

export function InvitationDetails({ invitation }: { invitation: Invitation }) {
  return (
    <dl className="space-y-4 rounded-xl border border-border/60 bg-muted/25 p-4">
      <div className="flex gap-3">
        <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div>
          <dt className="text-xs text-muted-foreground">Organization</dt>
          <dd className="text-sm font-medium">{invitation.organizationName}</dd>
        </div>
      </div>
      <div className="flex gap-3">
        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Invited email</dt>
          <dd className="truncate text-sm font-medium">{invitation.invitee}</dd>
        </div>
      </div>
      <div className="flex gap-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div>
          <dt className="text-xs text-muted-foreground">Roles</dt>
          <dd className="mt-1 flex flex-wrap gap-1.5">
            {invitation.organizationRoles.length > 0 ? (
              invitation.organizationRoles.map((role) => (
                <Badge key={role} variant="secondary">
                  {capitalize(role)}
                </Badge>
              ))
            ) : (
              <span className="text-sm font-medium">Member</span>
            )}
          </dd>
        </div>
      </div>
    </dl>
  )
}
