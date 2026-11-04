import { useMutation, useQueryClient } from "@tanstack/react-query"
import { organizationKeys } from "@/features/organizations/api/organization.keys"
import { transferOrganizationOwnership } from "@/features/organizations/api/transfer-organization-ownership"
import {
  requireOrganizationId,
  useCurrentOrganizationId,
} from "@/features/organizations/hooks/use-current-organization-id"

export const useTransferOrganizationOwnership = () => {
  const queryClient = useQueryClient()
  const organizationId = useCurrentOrganizationId()

  return useMutation({
    mutationFn: (newOwnerId: string) =>
      transferOrganizationOwnership(
        requireOrganizationId(organizationId),
        newOwnerId
      ),
    meta: { errorMessage: "Failed to transfer ownership." },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: organizationKeys.governance(organizationId),
      }),
  })
}
