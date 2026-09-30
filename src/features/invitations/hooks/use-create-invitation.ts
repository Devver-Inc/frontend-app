import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createInvitation } from "@/features/invitations/api/create-invitation"
import { invitationKeys } from "@/features/invitations/api/invitation.keys"
import type { CreateInvitationInput } from "@/features/invitations/types/invitation.types"
import {
  requireOrganizationId,
  useCurrentOrganizationId,
} from "@/features/organizations/hooks/use-current-organization-id"

export const useCreateInvitation = () => {
  const queryClient = useQueryClient()
  const organizationId = useCurrentOrganizationId()

  return useMutation({
    mutationFn: (input: CreateInvitationInput) =>
      createInvitation(requireOrganizationId(organizationId), input),
    meta: { errorMessage: "Failed to send invitation." },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: invitationKeys.list(organizationId),
      }),
  })
}
