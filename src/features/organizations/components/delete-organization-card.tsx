import { useNavigate } from "@tanstack/react-router"
import { AlertTriangle, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { ConfirmByNameDialog } from "@/components/common/confirm-by-name-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDeleteOrganization } from "@/features/organizations/hooks/use-delete-organization"
import type { Organization } from "@/features/organizations/types/organization.types"

export function DeleteOrganizationCard({
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
    <Card className="glass-surface border-destructive/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-destructive">
          <AlertTriangle className="h-4 w-4" />
          Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium">Delete Organization</p>
          <p className="text-xs text-muted-foreground">
            Once you delete your organization, there is no going back. This will
            permanently delete all projects, deployments, and team member
            associations.
          </p>
        </div>
        <ConfirmByNameDialog
          trigger={
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete Organization
            </Button>
          }
          title="Delete Organization"
          name={organization.name}
          placeholder={organization.name}
          actionLabel="Delete Organization"
          isPending={deleteOrganization.isPending}
          onConfirm={onConfirm}
        />
      </CardContent>
    </Card>
  )
}
