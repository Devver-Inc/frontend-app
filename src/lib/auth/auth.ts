import type { AuthClient } from "@/lib/auth/auth-client"
import { logtoAuthClient } from "@/lib/auth/logto-auth-client"

export const authClient: AuthClient = logtoAuthClient
