import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { ConfirmByNameDialog } from "@/components/common/confirm-by-name-dialog"
import { SettingsRow } from "@/components/common/section"
import { Button } from "@/components/ui/button"
import { useDeleteOrganization } from "@/features/organizations/hooks/use-delete-organization"
import type { Organization } from "@/features/organizations/types/organization.types"

export function DeleteOrganizationRow({
  organization,
}: {
  organization: Organization
}) {
  const navigate = useNavigate()
  const deleteOrganization = useDeleteOrganization(organization.id)

  const onConfirm = () =>
    deleteOrganization.mutate(undefined, {
      onSuccess: () => {
        void navigate({ to: "/organizations/new" })
        toast.success("Organization deleted.")
      },
    })

  return (
    <SettingsRow
      title="Delete organization"
      description="Its projects, deployments, and memberships are deleted for good."
    >
      <ConfirmByNameDialog
        trigger={
          <Button variant="destructive-outline">Delete organization</Button>
        }
        title="Delete this organization?"
        name={organization.name}
        placeholder={organization.name}
        actionLabel="Delete organization"
        isPending={deleteOrganization.isPending}
        onConfirm={onConfirm}
      />
    </SettingsRow>
  )
}
