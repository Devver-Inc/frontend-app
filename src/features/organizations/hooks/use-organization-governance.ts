import { queryOptions, skipToken, useQuery } from "@tanstack/react-query"
import { getOrganizationGovernance } from "@/features/organizations/api/get-organization-governance"
import { organizationKeys } from "@/features/organizations/api/organization.keys"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"

export const organizationGovernanceQueryOptions = (
  organizationId: string | null
) =>
  queryOptions({
    queryKey: organizationKeys.governance(organizationId),
    queryFn: organizationId
      ? ({ signal }) => getOrganizationGovernance(organizationId, signal)
      : skipToken,
    // Reserved to administrators: for anyone else, the page just goes without.
    meta: { silent: true },
  })

export const useOrganizationGovernance = () => {
  const organizationId = useCurrentOrganizationId()
  return useQuery(organizationGovernanceQueryOptions(organizationId))
}
