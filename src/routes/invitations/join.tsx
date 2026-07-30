import { useLogto } from '@logto/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Building2,
  CheckCircle2,
  LoaderCircle,
  Mail,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react'

import type { Invitation } from '@/lib/api/members'
import { acceptInvitation, getInvitationById } from '@/lib/api/members'
import { useOrganizationContext } from '@/lib/organization/organization-context'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type InvitationSearch = {
  invitationId?: string
  email?: string
  organizationName?: string
  roles?: string
}

export const Route = createFileRoute('/invitations/join')({
  validateSearch: (search: Record<string, unknown>): InvitationSearch => ({
    invitationId: getSearchValue(search.invitationId),
    email: getSearchValue(search.email),
    organizationName: getSearchValue(search.organizationName),
    roles: getSearchValue(search.roles),
  }),
  component: JoinInvitationPage,
})

function getSearchValue(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}

function getInvitationErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'The invitation could not be loaded.'
  }
  if (error.message.includes('INVITATION_NOT_FOR_CURRENT_USER')) {
    return 'This invitation was sent to another email address. Sign in with the invited account.'
  }
  if (error.message.includes('USER_MUST_HAVE_VERIFIED_EMAIL_FOR_INVITATIONS')) {
    return 'Your account needs a verified email address before it can accept this invitation.'
  }
  if (
    error.message.includes('INVITATION_NOT_FOUND') ||
    error.message.includes('INVALID_INVITATION_ID')
  ) {
    return 'This invitation link is invalid or no longer available.'
  }
  return error.message
}

function formatRole(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

function InvitationDetails({
  invitation,
}: Readonly<{ invitation: Invitation }>) {
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
                  {formatRole(role)}
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

function JoinInvitationPage() {
  const { invitationId } = Route.useSearch()
  const { isAuthenticated, clearAccessToken } = useLogto()
  const { addOrganization, setCurrentOrganizationId } = useOrganizationContext()

  const invitationQuery = useQuery({
    queryKey: ['invitation', invitationId],
    queryFn: () => getInvitationById(invitationId!),
    enabled: isAuthenticated && !!invitationId,
    retry: false,
  })

  const acceptMutation = useMutation({
    mutationFn: () => acceptInvitation(invitationId!),
    onSuccess: async () => {
      const invitation = invitationQuery.data
      if (!invitation) return

      await clearAccessToken()
      addOrganization({
        id: invitation.organizationId,
        name: invitation.organizationName,
      })
      setCurrentOrganizationId(invitation.organizationId)
    },
  })

  const invitation = invitationQuery.data
  const normalizedStatus = invitation?.status.toLowerCase()
  const hasExpired =
    !!invitation && new Date(invitation.expiresAt).getTime() <= Date.now()
  const isPending = normalizedStatus === 'pending' && !hasExpired

  let content

  if (!invitationId) {
    content = (
      <InvitationUnavailable message="This invitation link is incomplete." />
    )
  } else if (!isAuthenticated || invitationQuery.isPending) {
    content = (
      <div className="flex flex-col items-center gap-3 py-12 text-sm text-muted-foreground">
        <LoaderCircle className="h-7 w-7 animate-spin" />
        <span>Loading invitation...</span>
      </div>
    )
  } else if (invitationQuery.isError) {
    content = (
      <InvitationUnavailable
        message={getInvitationErrorMessage(invitationQuery.error)}
      />
    )
  } else if (!invitation) {
    content = (
      <InvitationUnavailable message="The invitation could not be loaded." />
    )
  } else if (acceptMutation.isSuccess) {
    content = (
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
    )
  } else {
    content = (
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
            <div className="flex gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <p>
                {hasExpired || normalizedStatus === 'expired'
                  ? 'This invitation has expired.'
                  : `This invitation is ${invitation.status.toLowerCase()}.`}
              </p>
            </div>
          )}
          {acceptMutation.isError && (
            <div className="flex gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <p>{getInvitationErrorMessage(acceptMutation.error)}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-3 sm:flex-row">
          <Button
            className="w-full sm:w-auto"
            disabled={!isPending || acceptMutation.isPending}
            onClick={() => acceptMutation.mutate()}
          >
            {acceptMutation.isPending ? 'Joining...' : 'Join organization'}
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

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <Link
          to="/"
          className="mx-auto mb-6 flex w-fit items-center gap-1 text-foreground"
        >
          <img src="/favicon.png" alt="" className="h-7 w-7" />
          <span className="text-xl font-bold tracking-widest">DEVVER</span>
        </Link>
        <Card className="glass-surface border-border/50">
          {acceptMutation.isSuccess ? (
            <CardContent className="py-8">{content}</CardContent>
          ) : (
            content
          )}
        </Card>
      </div>
    </main>
  )
}

function InvitationUnavailable({ message }: Readonly<{ message: string }>) {
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
