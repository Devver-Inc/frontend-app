import { useMutation } from "@tanstack/react-query"
import { createGitToken } from "@/features/deployments/api/create-git-token"
import {
  requireOrganizationId,
  useCurrentOrganizationId,
} from "@/features/organizations/hooks/use-current-organization-id"

export const useCreateGitToken = (projectId: string) => {
  const organizationId = useCurrentOrganizationId()

  return useMutation({
    mutationFn: (repo: string) =>
      createGitToken(requireOrganizationId(organizationId), projectId, repo),
    meta: { errorMessage: "Failed to create the push token." },
  })
}
