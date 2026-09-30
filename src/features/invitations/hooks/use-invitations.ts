import { queryOptions, skipToken, useQuery } from "@tanstack/react-query"
import { getInvitations } from "@/features/invitations/api/get-invitations"
import { invitationKeys } from "@/features/invitations/api/invitation.keys"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"

export const invitationsQueryOptions = (organizationId: string | null) =>
  queryOptions({
    queryKey: invitationKeys.list(organizationId),
    queryFn: organizationId
      ? ({ signal }) => getInvitations(organizationId, signal)
      : skipToken,
  })

export const useInvitations = () => {
  const organizationId = useCurrentOrganizationId()
  return useQuery(invitationsQueryOptions(organizationId))
}
