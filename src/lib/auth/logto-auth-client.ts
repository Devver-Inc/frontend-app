import LogtoClient, { UserScope } from "@logto/browser"
import { z } from "zod"
import type { AuthClient } from "@/lib/auth/auth-client"
import { env } from "@/lib/env"

const API_RESOURCE = env.VITE_API_BASE_URL

const optionalString = z.string().nullish().catch(undefined)

// ID token claims and the userinfo response share these claims; Logto only
// fills the ones allowed by the requested scopes.
const userClaimsSchema = z.object({
  sub: optionalString,
  username: optionalString,
  name: optionalString,
  given_name: optionalString,
  family_name: optionalString,
  email: optionalString,
  email_verified: z.boolean().optional().catch(undefined),
  picture: optionalString,
  created_at: z.number().optional().catch(undefined),
  organization_data: z.array(z.unknown()).optional().catch(undefined),
})

const organizationDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
})

// `organizations` is added to the API access tokens by the Custom JWT script
// configured in Logto.
const accessTokenClaimsSchema = z.object({
  organizations: z
    .array(z.object({ id: z.string(), name: z.string() }))
    .catch([]),
})

let client: LogtoClient | undefined

const getClient = (): LogtoClient | null => {
  if (typeof window === "undefined") return null
  client ??= new LogtoClient({
    endpoint: env.VITE_LOGTO_ENDPOINT,
    appId: env.VITE_LOGTO_APP_ID,
    scopes: [
      "access:api",
      UserScope.Organizations,
      UserScope.Email,
      UserScope.Profile,
    ],
    resources: [API_RESOURCE],
  })
  return client
}

const getAuthenticatedClient = async (): Promise<LogtoClient | null> => {
  const logto = getClient()
  return logto && (await logto.isAuthenticated()) ? logto : null
}

const requireClient = (): LogtoClient => {
  const logto = getClient()
  if (!logto) throw new Error("Logto only runs in the browser")
  return logto
}

export const logtoAuthClient: AuthClient = {
  async getUser() {
    const logto = await getAuthenticatedClient()
    if (!logto) return null
    try {
      const claims = userClaimsSchema.parse(await logto.getIdTokenClaims())
      return {
        id: claims.sub ?? "",
        username: claims.username ?? null,
        name: claims.name ?? null,
        email: claims.email ?? null,
        picture: claims.picture ?? null,
      }
    } catch {
      return null
    }
  },

  async getUserProfile() {
    const logto = requireClient()
    const [idTokenClaims, userInfo] = await Promise.all([
      logto.getIdTokenClaims(),
      // The ID token alone still describes the user.
      logto.fetchUserInfo().catch(() => ({})),
    ])
    const token = userClaimsSchema.parse(idTokenClaims)
    const info = userClaimsSchema.parse(userInfo)
    const organizationData =
      info.organization_data ?? token.organization_data ?? []

    return {
      id: token.sub ?? "",
      username: token.username ?? null,
      name: info.name ?? token.name ?? null,
      givenName: info.given_name ?? token.given_name ?? null,
      familyName: info.family_name ?? token.family_name ?? null,
      email: info.email ?? token.email ?? null,
      emailVerified: info.email_verified ?? false,
      picture: info.picture ?? token.picture ?? null,
      createdAt: token.created_at ?? null,
      organizations: organizationData.flatMap((item) => {
        const parsed = organizationDataSchema.safeParse(item)
        if (!parsed.success) return []
        return [
          { ...parsed.data, description: parsed.data.description ?? null },
        ]
      }),
    }
  },

  async getUserOrganizations() {
    const logto = await getAuthenticatedClient()
    if (!logto) return []
    try {
      const claims = await logto.getAccessTokenClaims(API_RESOURCE)
      return accessTokenClaimsSchema.parse(claims).organizations
    } catch {
      return []
    }
  },

  async getAccessToken({ organizationId, resource = API_RESOURCE } = {}) {
    const logto = await getAuthenticatedClient()
    if (!logto) return null
    try {
      return await logto.getAccessToken(resource, organizationId ?? undefined)
    } catch {
      // The refresh token expired or the user left the organization.
      return null
    }
  },

  async clearAccessTokens() {
    await getClient()?.clearAccessToken()
  },

  async signIn({
    redirectTo,
    callbackUrl = env.VITE_LOGTO_CALLBACK_URI,
    keepTokens = false,
  }) {
    const logto = getClient()
    if (!logto) return
    // Logto sends the browser back to postRedirectUri once the callback is
    // handled (handleSignInCallback).
    await logto.signIn({
      redirectUri: callbackUrl,
      postRedirectUri: new URL(redirectTo, window.location.origin).href,
      clearTokens: !keepTokens,
    })
  },

  async signOut() {
    await getClient()?.signOut(env.VITE_LOGTO_SIGN_OUT_URI)
  },

  async isSignInCallback(url) {
    return (await getClient()?.isSignInRedirected(url)) ?? false
  },

  async handleSignInCallback(url) {
    await requireClient().handleSignInCallback(url)
  },
}
