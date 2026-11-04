import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deploymentKeys } from "@/features/deployments/api/deployment.keys"
import { restoreProject } from "@/features/deployments/api/restore-project"
import {
  requireOrganizationId,
  useCurrentOrganizationId,
} from "@/features/organizations/hooks/use-current-organization-id"

export const useRestoreProject = (projectId: string) => {
  const queryClient = useQueryClient()
  const organizationId = useCurrentOrganizationId()

  return useMutation({
    mutationFn: () =>
      restoreProject(requireOrganizationId(organizationId), projectId),
    meta: { errorMessage: "Failed to restore the project." },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: deploymentKeys.project(organizationId, projectId),
      }),
  })
}
