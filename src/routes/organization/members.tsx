import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Clock, Mail, Search, UserMinus, Users, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import type { ReactNode } from 'react'

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
import { PageHeader } from '@/components/ui/page-header'

export const Route = createFileRoute('/organization/members')({
  component: OrganizationMembersPage,
})

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

function OrganizationMembersPage() {
  const { currentOrganizationId } = useOrganizationContext()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)

  const { data: membersData, isLoading: membersLoading } = useMembers({
    search: debouncedSearch || undefined,
    pageSize: 50,
  })
  const { data: invitations, isLoading: invitationsLoading } = useInvitations()
  const removeMutation = useRemoveMember()
  const revokeMutation = useRevokeInvitation()

  const members = membersData?.data ?? []
  const pendingInvitations =
    invitations?.filter((inv) => inv.status === 'Pending') ?? []
  const memberSkeletonKeys = ['m-1', 'm-2', 'm-3', 'm-4']
  const invitationSkeletonKeys = ['i-1', 'i-2']
  let membersContent: ReactNode
  if (membersLoading) {
    membersContent = (
      <div className="space-y-3">
        {memberSkeletonKeys.map((key) => (
          <div key={key} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    )
  } else if (members.length === 0) {
    membersContent = (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No members found.
      </p>
    )
  } else {
    membersContent = (
      <div className="space-y-1">
        {members.map((member) => {
          let initials = '?'
          if (member.name) {
            initials = member.name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
          }
          return (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border border-transparent px-2 py-2.5 transition-colors hover:border-border/60 hover:bg-accent/35"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={member.avatarUrl ?? undefined} />
                  <AvatarFallback className="text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium">
                  {member.name ?? 'Unnamed User'}
                </p>
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
                      onClick={() =>
                        removeMutation.mutate(member.id, {
                          onError: (err) =>
                            toast.error(
                              err.message || 'Failed to remove member.',
                            ),
                        })
                      }
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
    )
  }

  let invitationsContent: ReactNode
  if (invitationsLoading) {
    invitationsContent = (
      <div className="space-y-3">
        {invitationSkeletonKeys.map((key) => (
          <div key={key} className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>
    )
  } else if (pendingInvitations.length === 0) {
    invitationsContent = (
      <p className="py-4 text-center text-sm text-muted-foreground">
        No pending invitations.
      </p>
    )
  } else {
    invitationsContent = (
      <div className="space-y-1">
        {pendingInvitations.map((invitation) => (
          <div
            key={invitation.id}
            className="flex items-center justify-between rounded-lg border border-transparent px-2 py-2.5 transition-colors hover:border-border/60 hover:bg-accent/35"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{invitation.invitee}</p>
                <p className="text-xs text-muted-foreground">
                  Expires {new Date(invitation.expiresAt).toLocaleDateString()}
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
                    <AlertDialogTitle>Revoke Invitation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to revoke the invitation for{' '}
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
                        revokeMutation.mutate(invitation.id, {
                          onError: (err) =>
                            toast.error(
                              err.message || 'Failed to revoke invitation.',
                            ),
                        })
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
    )
  }

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
      <PageHeader
        title="Members"
        description="Manage your team members and invitations"
        icon={Users}
        rightSlot={<InviteMemberDialog />}
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="glass-surface border-border/50">
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
        <CardContent>{membersContent}</CardContent>
      </Card>

      {(invitationsLoading || pendingInvitations.length > 0) && (
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
            <CardContent>{invitationsContent}</CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
