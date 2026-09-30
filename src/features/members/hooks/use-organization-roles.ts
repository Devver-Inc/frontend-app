import { queryOptions, useQuery } from "@tanstack/react-query"
import { getOrganizationRoles } from "@/features/members/api/get-organization-roles"
import { memberKeys } from "@/features/members/api/member.keys"

export const organizationRolesQueryOptions = () =>
  queryOptions({
    queryKey: memberKeys.roles(),
    queryFn: ({ signal }) => getOrganizationRoles(signal),
    staleTime: Infinity,
  })

export const useOrganizationRoles = () =>
  useQuery(organizationRolesQueryOptions())
