import { createFileRoute } from "@tanstack/react-router"
import { Users } from "lucide-react"
import { useState } from "react"
import { PageHeader } from "@/components/common/page-header"
import { SearchInput } from "@/components/common/search-input"
import { InviteMemberDialog } from "@/features/invitations/components/invite-member-dialog"
import { PendingInvitationsCard } from "@/features/invitations/components/pending-invitations-card"
import { MembersCard } from "@/features/members/components/members-card"
import { SelectOrganizationNotice } from "@/features/organizations/components/select-organization-notice"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"
import { useDebouncedValue } from "@/hooks/use-debounced-value"

const SEARCH_DEBOUNCE_MS = 300

export const Route = createFileRoute(
  "/_protected/_dashboard/organization/members/"
)({
  component: OrganizationMembersPage,
})

function OrganizationMembersPage() {
  const currentOrganizationId = useCurrentOrganizationId()
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS)

  if (!currentOrganizationId) {
    return (
      <SelectOrganizationNotice message="Select an organization to manage its members." />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Members"
        description="Manage your team members and invitations"
        icon={Users}
        actions={<InviteMemberDialog />}
      />
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search members..."
      />
      <MembersCard search={debouncedSearch} />
      <PendingInvitationsCard />
    </div>
  )
}
