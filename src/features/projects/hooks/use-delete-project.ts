import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  requireOrganizationId,
  useCurrentOrganizationId,
} from "@/features/organizations/hooks/use-current-organization-id"
import { deleteProject } from "@/features/projects/api/delete-project"
import { projectKeys } from "@/features/projects/api/project.keys"

export const useDeleteProject = () => {
  const queryClient = useQueryClient()
  const organizationId = useCurrentOrganizationId()

  return useMutation({
    mutationFn: (projectId: string) =>
      deleteProject(requireOrganizationId(organizationId), projectId),
    meta: { errorMessage: "Failed to delete project." },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: projectKeys.lists(organizationId),
      }),
  })
}
