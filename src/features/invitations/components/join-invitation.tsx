import { Link } from "@tanstack/react-router"
import { LoaderCircle } from "lucide-react"
import { useState } from "react"
import type { ReactNode } from "react"
import { Monogram } from "@/components/common/monogram"
import { Button } from "@/components/ui/button"
import { InvitationDetails } from "@/features/invitations/components/invitation-details"
import { useAcceptInvitation } from "@/features/invitations/hooks/use-accept-invitation"
import { useInvitation } from "@/features/invitations/hooks/use-invitation"
import type { Invitation } from "@/features/invitations/types/invitation.types"
import { getInvitationErrorMessage } from "@/features/invitations/utils/invitation-errors"

function ErrorNotice({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="text-sm font-medium text-destructive">
      {children}
    </p>
  )
}

function InvitationUnavailable({ message }: { message: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title">This invitation can't be used</h1>
        <p className="mt-2 text-muted-foreground">{message}</p>
      </div>
      <Button variant="outline" asChild>
        <Link to="/">Go to Devver</Link>
      </Button>
    </div>
  )
}

function InvitationAccepted({ invitation }: { invitation: Invitation }) {
  return (
    <div className="space-y-6">
      <Monogram name={invitation.organizationName} size="lg" />
      <div>
        <h1 className="text-title">You joined {invitation.organizationName}</h1>
        <p className="mt-2 text-muted-foreground">
          Its projects are ready for you.
        </p>
      </div>
      <Button asChild>
        <Link to="/">Open {invitation.organizationName}</Link>
      </Button>
    </div>
  )
}

function InvitationAlreadyAccepted({ invitation }: { invitation: Invitation }) {
  return (
    <div className="space-y-6">
      <Monogram name={invitation.organizationName} size="lg" />
      <div>
        <h1 className="text-title">This invitation was already accepted</h1>
        <p className="mt-2 text-muted-foreground">
          It can't be used again. Ask for a new one if you need access to{" "}
          {invitation.organizationName}.
        </p>
      </div>
      <InvitationDetails invitation={invitation} />
      <Button variant="outline" asChild>
        <Link to="/">Go to Devver</Link>
      </Button>
    </div>
  )
}

function InvitationOffer({ invitation }: { invitation: Invitation }) {
  const acceptInvitation = useAcceptInvitation()
  const [openedAt] = useState(Date.now)

  if (acceptInvitation.isSuccess) {
    return <InvitationAccepted invitation={invitation} />
  }

  const status = invitation.status.toLowerCase()
  if (status === "accepted") {
    return <InvitationAlreadyAccepted invitation={invitation} />
  }

  const hasExpired = new Date(invitation.expiresAt).getTime() <= openedAt
  const isPending = status === "pending" && !hasExpired

  return (
    <div className="space-y-6">
      <Monogram name={invitation.organizationName} size="lg" />
      <div>
        <h1 className="text-title">Join {invitation.organizationName}</h1>
        <p className="mt-2 text-muted-foreground">
          You were invited to work on its projects in Devver.
        </p>
      </div>
      <InvitationDetails invitation={invitation} />
      {!isPending && (
        <ErrorNotice>
          {hasExpired || status === "expired"
            ? "This invitation has expired. Ask for a new one."
            : `This invitation is ${status}. Ask for a new one.`}
        </ErrorNotice>
      )}
      {acceptInvitation.isError && (
        <ErrorNotice>
          {getInvitationErrorMessage(acceptInvitation.error)}
        </ErrorNotice>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          disabled={!isPending || acceptInvitation.isPending}
          onClick={() => acceptInvitation.mutate(invitation)}
        >
          {acceptInvitation.isPending ? "Joining..." : "Join organization"}
        </Button>
        <Button variant="outline" asChild>
          <Link to="/">Not now</Link>
        </Button>
      </div>
    </div>
  )
}

function InvitationContent({ invitationId }: { invitationId: string }) {
  const {
    data: invitation,
    error,
    isPending,
    isError,
  } = useInvitation(invitationId)

  if (isPending) {
    return (
      <div role="status" aria-label="Loading invitation">
        <LoaderCircle className="size-6 animate-spin text-muted-foreground motion-reduce:animate-none" />
      </div>
    )
  }

  if (isError) {
    return <InvitationUnavailable message={getInvitationErrorMessage(error)} />
  }

  return <InvitationOffer invitation={invitation} />
}

export function JoinInvitation({
  invitationId,
}: {
  invitationId: string | undefined
}) {
  return invitationId ? (
    <InvitationContent invitationId={invitationId} />
  ) : (
    <InvitationUnavailable message="This invitation link is incomplete. Open the link from your email again." />
  )
}
