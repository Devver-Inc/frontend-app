import { queryOptions, useQuery } from "@tanstack/react-query"
import { useAuthClient } from "@/features/auth/hooks/use-auth-client"
import type { AuthClient, AuthUser } from "@/lib/auth/auth-client"

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
}

export const authUserQueryOptions = (auth: AuthClient) =>
  queryOptions({
    queryKey: authKeys.user(),
    queryFn: () => auth.getUser(),
  })

// `undefined` until loaded, then `null` (signed out) or the user.
export const useAuthUser = (): AuthUser | null | undefined =>
  useQuery(authUserQueryOptions(useAuthClient())).data
