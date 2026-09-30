import { queryOptions, useQuery } from "@tanstack/react-query"
import type { QueryClient } from "@tanstack/react-query"
import { useAuthClient } from "@/features/auth/hooks/use-auth-client"
import { organizationKeys } from "@/features/organizations/api/organization.keys"
import type { AuthClient, UserOrganization } from "@/lib/auth/auth-client"

export const userOrganizationsQueryOptions = (auth: AuthClient) =>
  queryOptions({
    queryKey: organizationKeys.mine(),
    queryFn: () => auth.getUserOrganizations(),
    // Read from the access token, which only lists a new membership once
    // renewed: memberships created here are added to the cached list instead
    // of refetching it.
    staleTime: Infinity,
    gcTime: Infinity,
  })

export const useUserOrganizations = () =>
  useQuery(userOrganizationsQueryOptions(useAuthClient()))

export const addUserOrganization = (
  queryClient: QueryClient,
  organization: UserOrganization
) =>
  queryClient.setQueryData<UserOrganization[]>(
    organizationKeys.mine(),
    (organizations) =>
      organizations &&
      (organizations.some(({ id }) => id === organization.id)
        ? organizations
        : [...organizations, organization])
  )

export const removeUserOrganization = (
  queryClient: QueryClient,
  organizationId: string
) =>
  queryClient.setQueryData<UserOrganization[]>(
    organizationKeys.mine(),
    (organizations) => organizations?.filter(({ id }) => id !== organizationId)
  )
