import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteProjectRepo } from "@/features/deployments/api/delete-project-repo"
import { deploymentKeys } from "@/features/deployments/api/deployment.keys"
import {
  requireOrganizationId,
  useCurrentOrganizationId,
} from "@/features/organizations/hooks/use-current-organization-id"

export const useDeleteProjectRepo = (projectId: string) => {
  const queryClient = useQueryClient()
  const organizationId = useCurrentOrganizationId()

  return useMutation({
    mutationFn: (repoName: string) =>
      deleteProjectRepo(
        requireOrganizationId(organizationId),
        projectId,
        repoName
      ),
    meta: { errorMessage: "Failed to delete repository." },
    // Deleting a repository also removes its deployments.
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: deploymentKeys.project(organizationId, projectId),
      }),
  })
}
