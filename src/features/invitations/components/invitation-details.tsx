import type { Invitation } from "@/features/invitations/types/invitation.types"
import { capitalize } from "@/lib/utils/capitalize"
import { formatDateTime } from "@/lib/utils/format-date"

export function InvitationDetails({ invitation }: { invitation: Invitation }) {
  const roles = invitation.organizationRoles.map(capitalize).join(", ")

  return (
    <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2 text-sm">
      <dt className="text-muted-foreground">Invited email</dt>
      <dd className="truncate font-medium">{invitation.invitee}</dd>
      <dt className="text-muted-foreground">Role</dt>
      <dd className="font-medium">{roles || "Member"}</dd>
      {invitation.message && (
        <>
          <dt className="text-muted-foreground">Message</dt>
          <dd className="font-medium wrap-anywhere whitespace-pre-line">
            {invitation.message}
          </dd>
        </>
      )}
      {invitation.acceptedAt && (
        <>
          <dt className="text-muted-foreground">Accepted</dt>
          <dd className="font-medium">
            {formatDateTime(invitation.acceptedAt)}
          </dd>
        </>
      )}
    </dl>
  )
}
