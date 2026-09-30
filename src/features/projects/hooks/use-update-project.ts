import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  requireOrganizationId,
  useCurrentOrganizationId,
} from "@/features/organizations/hooks/use-current-organization-id"
import { projectKeys } from "@/features/projects/api/project.keys"
import { updateProject } from "@/features/projects/api/update-project"
import type { UpdateProjectInput } from "@/features/projects/types/project.types"

export const useUpdateProject = (projectId: string) => {
  const queryClient = useQueryClient()
  const organizationId = useCurrentOrganizationId()

  return useMutation({
    mutationFn: (input: UpdateProjectInput) =>
      updateProject(requireOrganizationId(organizationId), projectId, input),
    meta: { errorMessage: "Failed to update project." },
    onSuccess: (project) => {
      queryClient.setQueryData(
        projectKeys.detail(organizationId, projectId),
        project
      )
      return queryClient.invalidateQueries({
        queryKey: projectKeys.lists(organizationId),
      })
    },
  })
}
