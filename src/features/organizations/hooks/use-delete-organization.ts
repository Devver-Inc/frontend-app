import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteOrganization } from "@/features/organizations/api/delete-organization"
import { removeUserOrganization } from "@/features/organizations/hooks/use-user-organizations"
import { useOrganizationStore } from "@/stores/organization.store"

export const useDeleteOrganization = (organizationId: string) => {
  const queryClient = useQueryClient()
  const setCurrentOrganizationId = useOrganizationStore(
    (state) => state.setCurrentOrganizationId
  )

  return useMutation({
    mutationFn: () => deleteOrganization(organizationId),
    meta: { errorMessage: "Failed to delete organization." },
    onSuccess: () => {
      removeUserOrganization(queryClient, organizationId)
      setCurrentOrganizationId(null)
    },
  })
}
