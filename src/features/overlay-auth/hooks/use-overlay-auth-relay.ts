import { useEffect, useRef, useState } from "react"
import { z } from "zod"
import { useAuthClient } from "@/features/auth/hooks/use-auth-client"
import type {
  OverlayAuthErrorCode,
  OverlayAuthMessage,
  OverlayAuthSearch,
} from "@/features/overlay-auth/types/overlay-auth.types"
import type { AuthClient } from "@/lib/auth/auth-client"
import { decodeJwtPayload } from "@/lib/utils/jwt"

const OIDC_CALLBACK_PARAMS = [
  "code",
  "state",
  "iss",
  "error",
  "error_description",
]
const PROFILE_ONLY_SESSION_SECONDS = 3600

const jwtExpirySchema = z.object({ exp: z.number().optional() })

class OverlayAuthError extends Error {
  readonly code: OverlayAuthErrorCode

  constructor(code: OverlayAuthErrorCode, message: string) {
    super(message)
    this.name = "OverlayAuthError"
    this.code = code
  }
}

const isValidOrigin = (origin: string | undefined): origin is string => {
  if (!origin) return false
  try {
    return new URL(origin).origin === origin
  } catch {
    return false
  }
}

// Back to this page, without the parameters of the Logto callback.
const getReturnUrl = (): string => {
  const url = new URL(window.location.href)
  OIDC_CALLBACK_PARAMS.forEach((param) => url.searchParams.delete(param))
  return url.href
}

const getTokenExpiry = (token: string): number | undefined => {
  const result = jwtExpirySchema.safeParse(decodeJwtPayload(token))
  return result.success ? result.data.exp : undefined
}

const toOverlayAuthError = (error: unknown): OverlayAuthError =>
  error instanceof OverlayAuthError
    ? error
    : new OverlayAuthError(
        "unknown_error",
        error instanceof Error ? error.message : "Connexion impossible."
      )

const getAccessToken = async (
  auth: AuthClient,
  { organizationId, resource }: OverlayAuthSearch
): Promise<string | null> => {
  if (!organizationId) return auth.getAccessToken({ resource })

  const accessToken = await auth.getAccessToken({ resource, organizationId })
  if (!accessToken) {
    throw new OverlayAuthError(
      "organization_access_denied",
      "Votre compte Devver n'est pas membre de l'organisation de ce projet."
    )
  }
  return accessToken
}

const postToOverlay = (targetOrigin: string, message: OverlayAuthMessage) =>
  window.opener?.postMessage(message, targetOrigin)

// Popup opened by the overlay of a deployed project: signs in with Logto if
// needed (this page is its own redirect URI), then posts an access token back
// to the overlay and closes itself.
export function useOverlayAuthRelay(search: OverlayAuthSearch): string {
  const auth = useAuthClient()
  const [message, setMessage] = useState("Connexion Devver...")
  const hasStartedRef = useRef(false)
  const { nonce, targetOrigin } = search
  const isConfigurationValid = Boolean(nonce) && isValidOrigin(targetOrigin)

  useEffect(() => {
    if (!nonce || !isValidOrigin(targetOrigin)) return
    // Once per page load, even when effects run twice (StrictMode).
    if (hasStartedRef.current) return
    hasStartedRef.current = true

    const relay = async () => {
      const url = window.location.href
      if (await auth.isSignInCallback(url)) {
        // Logto then reloads this page without the callback parameters.
        await auth.handleSignInCallback(url)
        return
      }

      if (!(await auth.getUser())) {
        await auth.signIn({
          redirectTo: getReturnUrl(),
          callbackUrl: `${window.location.origin}/overlay-auth`,
          keepTokens: true,
        })
        return
      }

      const accessToken = await getAccessToken(auth, search)
      const profile = await auth.getUserProfile().catch(() => undefined)
      postToOverlay(targetOrigin, {
        type: "devver-overlay-auth",
        nonce,
        accessToken: accessToken ?? undefined,
        expiresAt: accessToken
          ? getTokenExpiry(accessToken)
          : Math.floor(Date.now() / 1000) + PROFILE_ONLY_SESSION_SECONDS,
        userName:
          profile?.name ?? profile?.username ?? profile?.email ?? undefined,
        userEmail: profile?.email ?? undefined,
        profileOnly: !accessToken,
      })
      setMessage("Connexion terminee.")
      window.setTimeout(() => window.close(), 100)
    }

    relay().catch((error: unknown) => {
      const overlayError = toOverlayAuthError(error)
      postToOverlay(targetOrigin, {
        type: "devver-overlay-auth",
        nonce,
        errorCode: overlayError.code,
        error: overlayError.message,
      })
      setMessage(overlayError.message)
    })
  }, [auth, nonce, targetOrigin, search])

  return isConfigurationValid ? message : "Configuration de connexion invalide."
}
