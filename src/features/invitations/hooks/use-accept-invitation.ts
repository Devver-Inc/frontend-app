import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthClient } from "@/features/auth/hooks/use-auth-client"
import { acceptInvitation } from "@/features/invitations/api/accept-invitation"
import type { Invitation } from "@/features/invitations/types/invitation.types"
import { addUserOrganization } from "@/features/organizations/hooks/use-user-organizations"
import { useOrganizationStore } from "@/stores/organization.store"

export const useAcceptInvitation = () => {
  const auth = useAuthClient()
  const queryClient = useQueryClient()
  const setCurrentOrganizationId = useOrganizationStore(
    (state) => state.setCurrentOrganizationId
  )

  return useMutation({
    mutationFn: (invitation: Invitation) => acceptInvitation(invitation.id),
    onSuccess: async (_data, invitation) => {
      // Cached access tokens predate the membership: the next ones must
      // include the new organization.
      await auth.clearAccessTokens()
      addUserOrganization(queryClient, {
        id: invitation.organizationId,
        name: invitation.organizationName,
      })
      setCurrentOrganizationId(invitation.organizationId)
    },
  })
}
