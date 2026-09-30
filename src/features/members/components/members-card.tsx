import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { RemoveMemberButton } from "@/features/members/components/remove-member-button"
import { useMembers } from "@/features/members/hooks/use-members"
import type { User } from "@/features/users/types/user.types"
import { getInitials } from "@/lib/utils/get-initials"

const SKELETON_ROWS = ["m-1", "m-2", "m-3", "m-4"]

function MemberRow({ member }: { member: User }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-transparent px-2 py-2.5 transition-colors hover:border-border/60 hover:bg-accent/35">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={member.avatarUrl ?? undefined} />
          <AvatarFallback className="text-xs">
            {member.name ? getInitials(member.name) : "?"}
          </AvatarFallback>
        </Avatar>
        <p className="text-sm font-medium">{member.name ?? "Unnamed User"}</p>
      </div>
      <RemoveMemberButton member={member} />
    </div>
  )
}

function MembersContent({
  members,
  isLoading,
}: {
  members: User[]
  isLoading: boolean
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {SKELETON_ROWS.map((key) => (
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
  }

  if (members.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No members found.
      </p>
    )
  }

  return (
    <div className="space-y-1">
      {members.map((member) => (
        <MemberRow key={member.id} member={member} />
      ))}
    </div>
  )
}

export function MembersCard({ search }: { search: string }) {
  const { data: members, isLoading } = useMembers({
    search: search || undefined,
    pageSize: 50,
  })

  return (
    <Card className="glass-surface border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          Team Members
          {members && (
            <Badge variant="secondary" className="ml-2">
              {members.meta.totalItemsCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MembersContent members={members?.data ?? []} isLoading={isLoading} />
      </CardContent>
    </Card>
  )
}
