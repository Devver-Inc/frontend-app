import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  requireOrganizationId,
  useCurrentOrganizationId,
} from "@/features/organizations/hooks/use-current-organization-id"
import { projectKeys } from "@/features/projects/api/project.keys"
import { removeProjectMember } from "@/features/projects/api/remove-project-member"

export const useRemoveProjectMember = (projectId: string) => {
  const queryClient = useQueryClient()
  const organizationId = useCurrentOrganizationId()

  return useMutation({
    mutationFn: (userId: string) =>
      removeProjectMember(
        requireOrganizationId(organizationId),
        projectId,
        userId
      ),
    meta: { errorMessage: "Failed to remove project member." },
    onSuccess: (project) =>
      queryClient.setQueryData(
        projectKeys.detail(organizationId, projectId),
        project
      ),
  })
}
