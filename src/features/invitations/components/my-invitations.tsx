import { useState } from "react"
import { toast } from "sonner"
import { Monogram } from "@/components/common/monogram"
import { ROW_CONTENT, Row, RowList } from "@/components/common/row-list"
import { Section } from "@/components/common/section"
import { Button } from "@/components/ui/button"
import { useAcceptInvitation } from "@/features/invitations/hooks/use-accept-invitation"
import { useMyInvitations } from "@/features/invitations/hooks/use-my-invitations"
import type { Invitation } from "@/features/invitations/types/invitation.types"
import { getInvitationErrorMessage } from "@/features/invitations/utils/invitation-errors"
import { capitalize } from "@/lib/utils/capitalize"
import { formatDate } from "@/lib/utils/format-date"

function MyInvitationRow({ invitation }: { invitation: Invitation }) {
  const acceptInvitation = useAcceptInvitation()
  const role = invitation.organizationRoles.at(0)

  const accept = () =>
    acceptInvitation.mutate(invitation, {
      onSuccess: () =>
        toast.success(`You joined ${invitation.organizationName}.`),
    })

  return (
    <Row>
      <div className={ROW_CONTENT}>
        <Monogram name={invitation.organizationName} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{invitation.organizationName}</p>
          <p className="text-sm text-muted-foreground">
            {role ? `${capitalize(role)} role, ` : ""}
            expires {formatDate(invitation.expiresAt)}
          </p>
          {acceptInvitation.isError && (
            <p role="alert" className="mt-1 text-sm text-destructive">
              {getInvitationErrorMessage(acceptInvitation.error)}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={acceptInvitation.isPending}
          onClick={accept}
        >
          {acceptInvitation.isPending ? "Joining..." : "Join"}
        </Button>
      </div>
    </Row>
  )
}

export function MyInvitations() {
  const { data: invitations = [] } = useMyInvitations()
  const [openedAt] = useState(Date.now)
  const pending = invitations.filter(
    ({ status, expiresAt }) =>
      status.toLowerCase() === "pending" &&
      new Date(expiresAt).getTime() > openedAt
  )

  if (pending.length === 0) return null

  return (
    <Section title="Waiting for you">
      <RowList>
        {pending.map((invitation) => (
          <MyInvitationRow key={invitation.id} invitation={invitation} />
        ))}
      </RowList>
    </Section>
  )
}
