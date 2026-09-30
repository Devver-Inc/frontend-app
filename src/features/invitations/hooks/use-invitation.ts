import { queryOptions, skipToken, useQuery } from "@tanstack/react-query"
import { getInvitation } from "@/features/invitations/api/get-invitation"
import { invitationKeys } from "@/features/invitations/api/invitation.keys"

export const invitationQueryOptions = (invitationId: string | undefined) =>
  queryOptions({
    queryKey: invitationKeys.detail(invitationId),
    queryFn: invitationId
      ? ({ signal }) => getInvitation(invitationId, signal)
      : skipToken,
    // The page explains the error itself (wrong account, expired link…).
    retry: false,
  })

export const useInvitation = (invitationId: string | undefined) =>
  useQuery(invitationQueryOptions(invitationId))
