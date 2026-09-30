import { queryOptions, useQuery } from "@tanstack/react-query"
import { useAuthClient } from "@/features/auth/hooks/use-auth-client"
import { profileKeys } from "@/features/profile/api/profile.keys"
import type { AuthClient } from "@/lib/auth/auth-client"

// The profile is Logto's (ID token and userinfo), not the API's.
export const profileQueryOptions = (auth: AuthClient) =>
  queryOptions({
    queryKey: profileKeys.me(),
    queryFn: () =>
      auth.getUserProfile().catch(() => {
        throw new Error("Failed to load profile.")
      }),
    retry: false,
  })

export const useProfile = () => useQuery(profileQueryOptions(useAuthClient()))
