import { queryOptions, useQuery } from "@tanstack/react-query"
import { getMyInvitations } from "@/features/invitations/api/get-my-invitations"
import { invitationKeys } from "@/features/invitations/api/invitation.keys"

export const myInvitationsQueryOptions = () =>
  queryOptions({
    queryKey: invitationKeys.mine(),
    queryFn: ({ signal }) => getMyInvitations(signal),
    meta: { silent: true },
  })

export const useMyInvitations = () => useQuery(myInvitationsQueryOptions())
