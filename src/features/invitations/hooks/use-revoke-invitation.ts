import { useMutation, useQueryClient } from "@tanstack/react-query"
import { invitationKeys } from "@/features/invitations/api/invitation.keys"
import { revokeInvitation } from "@/features/invitations/api/revoke-invitation"
import {
  requireOrganizationId,
  useCurrentOrganizationId,
} from "@/features/organizations/hooks/use-current-organization-id"

export const useRevokeInvitation = () => {
  const queryClient = useQueryClient()
  const organizationId = useCurrentOrganizationId()

  return useMutation({
    mutationFn: (invitationId: string) =>
      revokeInvitation(requireOrganizationId(organizationId), invitationId),
    meta: { errorMessage: "Failed to revoke invitation." },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: invitationKeys.list(organizationId),
      }),
  })
}
