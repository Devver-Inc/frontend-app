import { EmptyState } from "@/components/common/empty-state"
import { ROW_CONTENT, Row, RowList } from "@/components/common/row-list"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { RemoveMemberButton } from "@/features/members/components/remove-member-button"
import { useMembers } from "@/features/members/hooks/use-members"
import type { MemberFilters } from "@/features/members/types/member.types"
import type { OrganizationGovernance } from "@/features/organizations/types/organization.types"
import type { User } from "@/features/users/types/user.types"
import { getInitials } from "@/lib/utils/get-initials"

const SKELETON_ROWS = ["m-1", "m-2", "m-3", "m-4"]

type MemberRowProps = {
  member: User
  badge: string | undefined
  canRemove: boolean
}

function MemberRow({ member, badge, canRemove }: MemberRowProps) {
  return (
    <Row>
      <div className={ROW_CONTENT}>
        <Avatar className="size-8">
          <AvatarImage src={member.avatarUrl ?? undefined} alt="" />
          <AvatarFallback className="text-xs">
            {member.name ? getInitials(member.name) : "?"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{member.name ?? "No name yet"}</p>
          {member.email && (
            <p className="truncate text-sm text-muted-foreground">
              {member.email}
            </p>
          )}
        </div>
        {badge && <Badge variant="secondary">{badge}</Badge>}
        {canRemove && <RemoveMemberButton member={member} />}
      </div>
    </Row>
  )
}

type MemberListProps = {
  filters: Pick<MemberFilters, "search" | "rolesFilter">
  // Only administrators can read it, and only they can remove someone.
  governance: OrganizationGovernance | undefined
}

export function MemberList({ filters, governance }: MemberListProps) {
  const { data: members, isLoading } = useMembers({ ...filters, pageSize: 50 })
  const isFiltered = Boolean(filters.search ?? filters.rolesFilter)

  const getBadge = ({ id }: User) => {
    if (governance?.owner?.id === id) return "Owner"
    return governance?.admins.some((admin) => admin.id === id)
      ? "Admin"
      : undefined
  }

  if (isLoading) {
    return (
      <RowList>
        {SKELETON_ROWS.map((key) => (
          <Row key={key}>
            <div className={ROW_CONTENT}>
              <Skeleton className="size-9 rounded-full" />
              <Skeleton className="h-4 w-44" />
            </div>
          </Row>
        ))}
      </RowList>
    )
  }

  if (!members || members.data.length === 0) {
    return isFiltered ? (
      <EmptyState
        title="No member matches"
        description="Try another name or role."
      />
    ) : (
      <EmptyState
        title="No members yet"
        description="Invite your team to work on projects together."
      />
    )
  }

  return (
    <RowList>
      {members.data.map((member) => (
        <MemberRow
          key={member.id}
          member={member}
          badge={getBadge(member)}
          canRemove={
            governance !== undefined && governance.owner?.id !== member.id
          }
        />
      ))}
    </RowList>
  )
}
