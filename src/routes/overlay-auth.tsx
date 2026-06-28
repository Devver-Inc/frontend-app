import { useHandleSignInCallback, useLogto } from '@logto/react'
import { createFileRoute } from '@tanstack/react-router'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type OverlayAuthSearch = {
  nonce?: string
  targetOrigin?: string
  organizationId?: string
  resource?: string
}

type OverlayAuthMessage = {
  type: 'devver-overlay-auth'
  nonce: string
  accessToken?: string
  expiresAt?: number
  userName?: string
  userEmail?: string
  error?: string
}

const OIDC_CALLBACK_PARAMS = [
  'code',
  'state',
  'iss',
  'error',
  'error_description',
]

export const Route = createFileRoute('/overlay-auth')({
  validateSearch: (search: Record<string, unknown>): OverlayAuthSearch => ({
    nonce:
      typeof search.nonce === 'string' && search.nonce.length > 0
        ? search.nonce
        : undefined,
    targetOrigin:
      typeof search.targetOrigin === 'string' && search.targetOrigin.length > 0
        ? search.targetOrigin
        : undefined,
    organizationId:
      typeof search.organizationId === 'string' &&
      search.organizationId.length > 0
        ? search.organizationId
        : undefined,
    resource:
      typeof search.resource === 'string' && search.resource.length > 0
        ? search.resource
        : undefined,
  }),
  component: OverlayAuthRoute,
})

function getRedirectUri(): string {
  return `${window.location.origin}/overlay-auth`
}

function getPostRedirectUri(): string {
  const url = new URL(window.location.href)
  OIDC_CALLBACK_PARAMS.forEach((key) => url.searchParams.delete(key))
  return url.toString()
}

function getJwtExpiration(token: string): number | undefined {
  try {
    const [, payload] = token.split('.')
    if (!payload) return undefined
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = `${base64}${'='.repeat((4 - (base64.length % 4)) % 4)}`
    const json = new TextDecoder().decode(
      Uint8Array.from(atob(padded), (char) => char.charCodeAt(0)),
    )
    const claims = JSON.parse(json) as { exp?: number }
    return typeof claims.exp === 'number' ? claims.exp : undefined
  } catch {
    return undefined
  }
}

function isValidOrigin(origin: string | undefined): origin is string {
  if (!origin) return false

  try {
    const url = new URL(origin)
    return url.origin === origin
  } catch {
    return false
  }
}

function postToOverlay(targetOrigin: string, message: OverlayAuthMessage) {
  if (!window.opener) return
  window.opener.postMessage(message, targetOrigin)
}

function OverlayAuthRoute() {
  const search = Route.useSearch()
  const {
    isAuthenticated,
    isLoading,
    signIn,
    getAccessToken,
    fetchUserInfo,
  } = useLogto()
  const callbackState = useHandleSignInCallback()
  const [message, setMessage] = useState('Connexion Devver...')
  const signInStartedRef = useRef(false)
  const tokenSentRef = useRef(false)

  useEffect(() => {
    if (!search.nonce || !isValidOrigin(search.targetOrigin)) {
      setMessage('Configuration de connexion invalide.')
      return
    }

    const nonce = search.nonce
    const targetOrigin = search.targetOrigin

    if (isLoading || callbackState.isLoading) return

    if (!isAuthenticated) {
      if (signInStartedRef.current) return
      signInStartedRef.current = true
      void signIn({
        redirectUri: getRedirectUri(),
        postRedirectUri: getPostRedirectUri(),
        clearTokens: false,
      })
      return
    }

    if (tokenSentRef.current) return
    tokenSentRef.current = true

    const sendToken = async () => {
      try {
        const resource = search.resource ?? import.meta.env.VITE_API_BASE_URL
        const accessToken = await getAccessToken(
          resource,
          search.organizationId,
        )

        if (!accessToken) {
          throw new Error('Unable to get a Logto access token.')
        }

        const userInfo = await fetchUserInfo().catch(() => undefined)
        postToOverlay(targetOrigin, {
          type: 'devver-overlay-auth',
          nonce,
          accessToken,
          expiresAt: getJwtExpiration(accessToken),
          userName:
            userInfo?.name ?? userInfo?.username ?? userInfo?.email ?? undefined,
          userEmail: userInfo?.email ?? undefined,
        })
        setMessage('Connexion terminee.')
        window.setTimeout(() => window.close(), 100)
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Connexion impossible.'
        postToOverlay(targetOrigin, {
          type: 'devver-overlay-auth',
          nonce,
          error: errorMessage,
        })
        setMessage(errorMessage)
      }
    }

    void sendToken()
  }, [
    callbackState.isLoading,
    fetchUserInfo,
    getAccessToken,
    isAuthenticated,
    isLoading,
    search.nonce,
    search.organizationId,
    search.resource,
    search.targetOrigin,
    signIn,
  ])

  return (
    <div className="grid h-screen place-items-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
        <LoaderCircle size={32} className="animate-spin" />
        <span>{message}</span>
      </div>
    </div>
  )
}
