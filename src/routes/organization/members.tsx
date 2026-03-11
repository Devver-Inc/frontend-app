import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Clock, Mail, Search, UserMinus, Users, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { InviteMemberDialog } from '@/components/members/invite-member-dialog'
import {
  useInvitations,
  useMembers,
  useRemoveMember,
  useRevokeInvitation,
} from '@/lib/hooks/use-members'
import { useOrganizationContext } from '@/lib/organization/organization-context'

export const Route = createFileRoute('/organization/members')({
  component: OrganizationMembersPage,
})

function OrganizationMembersPage() {
  const { currentOrganizationId } = useOrganizationContext()
  const [search, setSearch] = useState('')

  const { data: membersData, isLoading: membersLoading } = useMembers({
    search: search || undefined,
    pageSize: 50,
  })
  const { data: invitations, isLoading: invitationsLoading } = useInvitations()
  const removeMutation = useRemoveMember()
  const revokeMutation = useRevokeInvitation()

  const members = membersData?.data ?? []
  const pendingInvitations =
    invitations?.filter((inv) => inv.status === 'Pending') ?? []

  if (!currentOrganizationId) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Select an organization to manage its members.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Users className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Members</h1>
            <p className="text-sm text-muted-foreground">
              Manage your team members and invitations
            </p>
          </div>
        </div>
        <InviteMemberDialog />
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Team Members
            {membersData && (
              <Badge variant="secondary" className="ml-2">
                {membersData.meta.totalItemsCount}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {membersLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : members.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No members found.
            </p>
          ) : (
            <div className="space-y-1">
              {members.map((member) => {
                const initials = member.name
                  ? member.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                  : '?'
                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg px-2 py-2.5 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={member.avatarUrl ?? undefined} />
                        <AvatarFallback className="text-xs">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {member.name ?? 'Unnamed User'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.id}
                        </p>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive-foreground"
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Member</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove{' '}
                            <span className="font-semibold">
                              {member.name ?? member.id}
                            </span>{' '}
                            from this organization?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => removeMutation.mutate(member.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {(invitationsLoading || pendingInvitations.length > 0) && (
        <>
          <Separator />
          <Card className="border-border/50">
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
              {invitationsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
                </div>
              ) : pendingInvitations.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No pending invitations.
                </p>
              ) : (
                <div className="space-y-1">
                  {pendingInvitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between rounded-lg px-2 py-2.5 transition-colors hover:bg-accent/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {invitation.invitee}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Expires{' '}
                            {new Date(
                              invitation.expiresAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {invitation.organizationRoles.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {invitation.organizationRoles[0]}
                          </Badge>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive-foreground"
                              title="Revoke invitation"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Revoke Invitation
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to revoke the invitation
                                for{' '}
                                <span className="font-semibold">
                                  {invitation.invitee}
                                </span>
                                ?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  revokeMutation.mutate(invitation.id)
                                }
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Revoke
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
