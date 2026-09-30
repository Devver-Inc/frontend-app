import { queryOptions, skipToken, useQuery } from "@tanstack/react-query"
import { getOrganization } from "@/features/organizations/api/get-organization"
import { organizationKeys } from "@/features/organizations/api/organization.keys"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"

export const organizationQueryOptions = (organizationId: string | null) =>
  queryOptions({
    queryKey: organizationKeys.detail(organizationId),
    queryFn: organizationId
      ? ({ signal }) => getOrganization(organizationId, signal)
      : skipToken,
  })

export const useOrganization = () => {
  const organizationId = useCurrentOrganizationId()
  return useQuery(organizationQueryOptions(organizationId))
}
