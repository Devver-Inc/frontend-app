import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  requireOrganizationId,
  useCurrentOrganizationId,
} from "@/features/organizations/hooks/use-current-organization-id"
import { addProjectMembers } from "@/features/projects/api/add-project-members"
import { projectKeys } from "@/features/projects/api/project.keys"

export const useAddProjectMembers = (projectId: string) => {
  const queryClient = useQueryClient()
  const organizationId = useCurrentOrganizationId()

  return useMutation({
    mutationFn: (userIds: string[]) =>
      addProjectMembers(
        requireOrganizationId(organizationId),
        projectId,
        userIds
      ),
    meta: { errorMessage: "Failed to add project members." },
    onSuccess: (project) =>
      queryClient.setQueryData(
        projectKeys.detail(organizationId, projectId),
        project
      ),
  })
}
