import { useMutation, useQueryClient } from "@tanstack/react-query"
import { organizationKeys } from "@/features/organizations/api/organization.keys"
import { updateOrganization } from "@/features/organizations/api/update-organization"
import type { UpdateOrganizationInput } from "@/features/organizations/types/organization.types"

export const useUpdateOrganization = (organizationId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateOrganizationInput) =>
      updateOrganization(organizationId, input),
    meta: { errorMessage: "Failed to update organization." },
    onSuccess: (organization) =>
      queryClient.setQueryData(
        organizationKeys.detail(organizationId),
        organization
      ),
  })
}
