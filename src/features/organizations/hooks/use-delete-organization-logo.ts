import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteOrganizationLogo } from "@/features/organizations/api/delete-organization-logo"
import { organizationKeys } from "@/features/organizations/api/organization.keys"

export const useDeleteOrganizationLogo = (organizationId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteOrganizationLogo(organizationId),
    meta: { errorMessage: "Failed to update organization." },
    onSuccess: (organization) =>
      queryClient.setQueryData(
        organizationKeys.detail(organizationId),
        organization
      ),
  })
}
