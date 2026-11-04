import { createFileRoute } from "@tanstack/react-router"
import { PageHeader } from "@/components/common/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { DeleteOrganizationRow } from "@/features/organizations/components/delete-organization-row"
import { OrganizationOwnershipRow } from "@/features/organizations/components/organization-ownership-row"
import { OrganizationSettingsForm } from "@/features/organizations/components/organization-settings-form"
import { SelectOrganizationNotice } from "@/features/organizations/components/select-organization-notice"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"
import { useOrganization } from "@/features/organizations/hooks/use-organization"
import { useOrganizationGovernance } from "@/features/organizations/hooks/use-organization-governance"

export const Route = createFileRoute(
  "/_protected/_dashboard/organization/settings/"
)({
  component: OrganizationSettingsPage,
})

function OrganizationSettingsPage() {
  const currentOrganizationId = useCurrentOrganizationId()
  const { data: organization, isLoading } = useOrganization()
  const { data: governance } = useOrganizationGovernance()

  if (!currentOrganizationId) {
    return (
      <SelectOrganizationNotice message="Select an organization to manage its settings." />
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <>
      <PageHeader title="Settings" />
      {organization && (
        <>
          {/* Keyed: switching organization starts from its saved values. */}
          <OrganizationSettingsForm
            key={organization.id}
            organization={organization}
          />
          {governance && <OrganizationOwnershipRow governance={governance} />}
          <DeleteOrganizationRow organization={organization} />
        </>
      )}
    </>
  )
}
