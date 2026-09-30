import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProjectRepo } from "@/features/deployments/api/create-project-repo"
import { deploymentKeys } from "@/features/deployments/api/deployment.keys"
import type { CreateRepoInput } from "@/features/deployments/types/deployment.types"
import {
  requireOrganizationId,
  useCurrentOrganizationId,
} from "@/features/organizations/hooks/use-current-organization-id"

export const useCreateProjectRepo = (projectId: string) => {
  const queryClient = useQueryClient()
  const organizationId = useCurrentOrganizationId()

  return useMutation({
    mutationFn: (input: CreateRepoInput) =>
      createProjectRepo(
        requireOrganizationId(organizationId),
        projectId,
        input
      ),
    meta: { errorMessage: "Failed to create repository." },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: deploymentKeys.repos(organizationId, projectId),
      }),
  })
}
