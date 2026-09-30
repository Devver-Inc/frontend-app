import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  requireOrganizationId,
  useCurrentOrganizationId,
} from "@/features/organizations/hooks/use-current-organization-id"
import { createProject } from "@/features/projects/api/create-project"
import { projectKeys } from "@/features/projects/api/project.keys"
import type { CreateProjectInput } from "@/features/projects/types/project.types"

export const useCreateProject = () => {
  const queryClient = useQueryClient()
  const organizationId = useCurrentOrganizationId()

  return useMutation({
    mutationFn: (input: CreateProjectInput) =>
      createProject(requireOrganizationId(organizationId), input),
    meta: { errorMessage: "Failed to create project." },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: projectKeys.lists(organizationId),
      }),
  })
}
