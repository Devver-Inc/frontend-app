import { queryOptions, skipToken, useQuery } from "@tanstack/react-query"
import { getMembers } from "@/features/members/api/get-members"
import { memberKeys } from "@/features/members/api/member.keys"
import type { MemberFilters } from "@/features/members/types/member.types"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"

export const membersQueryOptions = (
  organizationId: string | null,
  filters: MemberFilters
) =>
  queryOptions({
    queryKey: memberKeys.list(organizationId, filters),
    queryFn: organizationId
      ? ({ signal }) => getMembers(organizationId, filters, signal)
      : skipToken,
  })

export const useMembers = (filters: MemberFilters) => {
  const organizationId = useCurrentOrganizationId()
  return useQuery(membersQueryOptions(organizationId, filters))
}
