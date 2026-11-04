import { ROW_CONTENT, Row, RowList } from "@/components/common/row-list"
import { Section } from "@/components/common/section"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { RevokeInvitationButton } from "@/features/invitations/components/revoke-invitation-button"
import { useInvitations } from "@/features/invitations/hooks/use-invitations"
import type { Invitation } from "@/features/invitations/types/invitation.types"
import { capitalize } from "@/lib/utils/capitalize"
import { formatDate } from "@/lib/utils/format-date"

const SKELETON_ROWS = ["i-1", "i-2"]

function InvitationRow({ invitation }: { invitation: Invitation }) {
  const role = invitation.organizationRoles.at(0)

  return (
    <Row>
      <div className={ROW_CONTENT}>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{invitation.invitee}</p>
          <p className="text-sm text-muted-foreground">
            Expires {formatDate(invitation.expiresAt)}
          </p>
        </div>
        {role && <Badge variant="secondary">{capitalize(role)}</Badge>}
        <RevokeInvitationButton invitation={invitation} />
      </div>
    </Row>
  )
}

export function PendingInvitations() {
  const { data: invitations, isLoading } = useInvitations()
  const pendingInvitations =
    invitations?.filter(({ status }) => status === "Pending") ?? []

  if (!isLoading && pendingInvitations.length === 0) return null

  return (
    <Section title="Pending invitations">
      <RowList>
        {isLoading
          ? SKELETON_ROWS.map((key) => (
              <Row key={key}>
                <div className={ROW_CONTENT}>
                  <Skeleton className="h-4 w-48" />
                </div>
              </Row>
            ))
          : pendingInvitations.map((invitation) => (
              <InvitationRow key={invitation.id} invitation={invitation} />
            ))}
      </RowList>
    </Section>
  )
}
