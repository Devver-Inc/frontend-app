import type { QueryClient } from "@tanstack/react-query"
import type { AuthClient } from "@/lib/auth/auth-client"

export type RouterContext = {
  queryClient: QueryClient
  auth: AuthClient
}
