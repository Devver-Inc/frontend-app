import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteDeployment } from "@/features/deployments/api/delete-deployment"
import { deploymentKeys } from "@/features/deployments/api/deployment.keys"
import {
  requireOrganizationId,
  useCurrentOrganizationId,
} from "@/features/organizations/hooks/use-current-organization-id"

export const useDeleteDeployment = (projectId: string) => {
  const queryClient = useQueryClient()
  const organizationId = useCurrentOrganizationId()

  return useMutation({
    mutationFn: (deploymentId: string) =>
      deleteDeployment(
        requireOrganizationId(organizationId),
        projectId,
        deploymentId
      ),
    meta: { errorMessage: "Failed to delete deployment." },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: deploymentKeys.list(organizationId, projectId),
      }),
  })
}
