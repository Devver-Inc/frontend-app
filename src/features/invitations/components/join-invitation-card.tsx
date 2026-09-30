import { Link } from "@tanstack/react-router"
import {
  Building2,
  CheckCircle2,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react"
import { useState } from "react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { InvitationDetails } from "@/features/invitations/components/invitation-details"
import { useAcceptInvitation } from "@/features/invitations/hooks/use-accept-invitation"
import { useInvitation } from "@/features/invitations/hooks/use-invitation"
import type { Invitation } from "@/features/invitations/types/invitation.types"

const INVITATION_ERROR_MESSAGES: Array<[code: string, message: string]> = [
  [
    "INVITATION_NOT_FOR_CURRENT_USER",
    "This invitation was sent to another email address. Sign in with the invited account.",
  ],
  [
    "USER_MUST_HAVE_VERIFIED_EMAIL_FOR_INVITATIONS",
    "Your account needs a verified email address before it can accept this invitation.",
  ],
  [
    "INVITATION_NOT_FOUND",
    "This invitation link is invalid or no longer available.",
  ],
  [
    "INVALID_INVITATION_ID",
    "This invitation link is invalid or no longer available.",
  ],
]

const getInvitationErrorMessage = (error: unknown): string => {
  if (!(error instanceof Error)) return "The invitation could not be loaded."
  const known = INVITATION_ERROR_MESSAGES.find(([code]) =>
    error.message.includes(code)
  )
  return known ? known[1] : error.message
}

function ErrorNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
      <p>{children}</p>
    </div>
  )
}

function InvitationUnavailable({ message }: { message: string }) {
  return (
    <CardContent className="space-y-5 py-8 text-center">
      <TriangleAlert className="mx-auto h-11 w-11 text-destructive" />
      <div>
        <h1 className="text-xl font-semibold">Invitation unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      </div>
      <Link to="/">
        <Button variant="outline">Return to Devver</Button>
      </Link>
    </CardContent>
  )
}

function InvitationAccepted({ invitation }: { invitation: Invitation }) {
  return (
    <CardContent className="py-8">
      <div className="space-y-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <div>
          <h1 className="text-xl font-semibold">Invitation accepted</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You are now a member of {invitation.organizationName}.
          </p>
        </div>
        <Link to="/">
          <Button className="w-full">Open Devver</Button>
        </Link>
      </div>
    </CardContent>
  )
}

function InvitationOffer({ invitation }: { invitation: Invitation }) {
  const acceptInvitation = useAcceptInvitation()
  const [openedAt] = useState(Date.now)

  if (acceptInvitation.isSuccess) {
    return <InvitationAccepted invitation={invitation} />
  }

  const status = invitation.status.toLowerCase()
  const hasExpired = new Date(invitation.expiresAt).getTime() <= openedAt
  const isPending = status === "pending" && !hasExpired

  return (
    <>
      <CardHeader>
        <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <CardTitle>Join {invitation.organizationName}</CardTitle>
        <CardDescription>
          You have been invited to join this organization on Devver.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <InvitationDetails invitation={invitation} />
        {!isPending && (
          <ErrorNotice>
            {hasExpired || status === "expired"
              ? "This invitation has expired."
              : `This invitation is ${status}.`}
          </ErrorNotice>
        )}
        {acceptInvitation.isError && (
          <ErrorNotice>
            {getInvitationErrorMessage(acceptInvitation.error)}
          </ErrorNotice>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-3 sm:flex-row">
        <Button
          className="w-full sm:w-auto"
          disabled={!isPending || acceptInvitation.isPending}
          onClick={() => acceptInvitation.mutate(invitation)}
        >
          {acceptInvitation.isPending ? "Joining..." : "Join organization"}
        </Button>
        <Link to="/" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full">
            Go to dashboard
          </Button>
        </Link>
      </CardFooter>
    </>
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
      <div className="flex flex-col items-center gap-3 py-12 text-sm text-muted-foreground">
        <LoaderCircle className="h-7 w-7 animate-spin" />
        <span>Loading invitation...</span>
      </div>
    )
  }

  if (isError) {
    return <InvitationUnavailable message={getInvitationErrorMessage(error)} />
  }

  return <InvitationOffer invitation={invitation} />
}

export function JoinInvitationCard({
  invitationId,
}: {
  invitationId: string | undefined
}) {
  return (
    <Card className="glass-surface border-border/50">
      {invitationId ? (
        <InvitationContent invitationId={invitationId} />
      ) : (
        <InvitationUnavailable message="This invitation link is incomplete." />
      )}
    </Card>
  )
}
