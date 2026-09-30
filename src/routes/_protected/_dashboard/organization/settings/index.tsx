import { createFileRoute } from "@tanstack/react-router"
import { Settings } from "lucide-react"
import { PageHeader } from "@/components/common/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { DeleteOrganizationCard } from "@/features/organizations/components/delete-organization-card"
import { OrganizationSettingsForm } from "@/features/organizations/components/organization-settings-form"
import { SelectOrganizationNotice } from "@/features/organizations/components/select-organization-notice"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"
import { useOrganization } from "@/features/organizations/hooks/use-organization"

export const Route = createFileRoute(
  "/_protected/_dashboard/organization/settings/"
)({
  component: OrganizationSettingsPage,
})

function OrganizationSettingsPage() {
  const currentOrganizationId = useCurrentOrganizationId()
  const { data: organization, isLoading } = useOrganization()

  if (!currentOrganizationId) {
    return (
      <SelectOrganizationNotice message="Select an organization to manage its settings." />
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization Settings"
        description="Manage your organization details and preferences"
        icon={Settings}
      />
      {organization && (
        <>
          {/* Keyed: switching organization starts from its saved values. */}
          <OrganizationSettingsForm
            key={organization.id}
            organization={organization}
          />
          <DeleteOrganizationCard organization={organization} />
        </>
      )}
    </div>
  )
}
