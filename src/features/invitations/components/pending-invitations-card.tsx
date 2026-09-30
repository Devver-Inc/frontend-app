import { Clock, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { RevokeInvitationButton } from "@/features/invitations/components/revoke-invitation-button"
import { useInvitations } from "@/features/invitations/hooks/use-invitations"
import type { Invitation } from "@/features/invitations/types/invitation.types"
import { formatDate } from "@/lib/utils/format-date"

const SKELETON_ROWS = ["i-1", "i-2"]

function InvitationRow({ invitation }: { invitation: Invitation }) {
  const role = invitation.organizationRoles.at(0)

  return (
    <div className="flex items-center justify-between rounded-lg border border-transparent px-2 py-2.5 transition-colors hover:border-border/60 hover:bg-accent/35">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
          <Mail className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">{invitation.invitee}</p>
          <p className="text-xs text-muted-foreground">
            Expires {formatDate(invitation.expiresAt)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {role && (
          <Badge variant="outline" className="text-xs">
            {role}
          </Badge>
        )}
        <RevokeInvitationButton invitation={invitation} />
      </div>
    </div>
  )
}

export function PendingInvitationsCard() {
  const { data: invitations, isLoading } = useInvitations()
  const pendingInvitations =
    invitations?.filter(({ status }) => status === "Pending") ?? []

  if (!isLoading && pendingInvitations.length === 0) return null

  return (
    <>
      <Separator />
      <Card className="glass-surface border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" />
            Pending Invitations
            {pendingInvitations.length > 0 && (
              <Badge variant="secondary">{pendingInvitations.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {SKELETON_ROWS.map((key) => (
                <div key={key} className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {pendingInvitations.map((invitation) => (
                <InvitationRow key={invitation.id} invitation={invitation} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
