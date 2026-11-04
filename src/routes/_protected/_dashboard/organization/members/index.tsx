import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { PageHeader } from "@/components/common/page-header"
import { SearchInput } from "@/components/common/search-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { InviteMemberDialog } from "@/features/invitations/components/invite-member-dialog"
import { PendingInvitations } from "@/features/invitations/components/pending-invitations"
import { MemberList } from "@/features/members/components/member-list"
import type { MemberFilters } from "@/features/members/types/member.types"
import { SelectOrganizationNotice } from "@/features/organizations/components/select-organization-notice"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"
import { useOrganizationGovernance } from "@/features/organizations/hooks/use-organization-governance"
import { useDebouncedValue } from "@/hooks/use-debounced-value"

const SEARCH_DEBOUNCE_MS = 300
const ALL_ROLES = "all"

const ROLE_FILTERS: Array<{
  value: NonNullable<MemberFilters["rolesFilter"]>
  label: string
}> = [
  { value: "admin", label: "Admin" },
  { value: "developer", label: "Developer" },
  { value: "viewer", label: "Viewer" },
]

export const Route = createFileRoute(
  "/_protected/_dashboard/organization/members/"
)({
  component: OrganizationMembersPage,
})

function OrganizationMembersPage() {
  const currentOrganizationId = useCurrentOrganizationId()
  const { data: governance, isError: isNotAdmin } = useOrganizationGovernance()
  const [search, setSearch] = useState("")
  const [role, setRole] = useState<string>(ALL_ROLES)
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS)

  if (!currentOrganizationId) {
    return (
      <SelectOrganizationNotice message="Select an organization to manage its members." />
    )
  }

  return (
    <>
      <PageHeader
        title="Members"
        description={
          governance &&
          `${governance.membersCount} ${governance.membersCount === 1 ? "person" : "people"} in ${governance.name}`
        }
        actions={!isNotAdmin && <InviteMemberDialog />}
      />
      <div className="space-y-10">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search members"
              className="min-w-56 flex-1"
            />
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger aria-label="Filter by role" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_ROLES}>All roles</SelectItem>
                {ROLE_FILTERS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <MemberList
            filters={{
              search: debouncedSearch.trim() || undefined,
              rolesFilter: ROLE_FILTERS.find(({ value }) => value === role)
                ?.value,
            }}
            governance={governance}
          />
        </div>
        {governance && <PendingInvitations />}
      </div>
    </>
  )
}
