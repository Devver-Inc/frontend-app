import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createOrganization } from "@/features/organizations/api/create-organization"
import { addUserOrganization } from "@/features/organizations/hooks/use-user-organizations"
import { useOrganizationStore } from "@/stores/organization.store"

export const useCreateOrganization = () => {
  const queryClient = useQueryClient()
  const setCurrentOrganizationId = useOrganizationStore(
    (state) => state.setCurrentOrganizationId
  )

  return useMutation({
    mutationFn: createOrganization,
    meta: { errorMessage: "Failed to create organization." },
    onSuccess: ({ id, name }) => {
      addUserOrganization(queryClient, { id, name })
      setCurrentOrganizationId(id)
    },
  })
}
