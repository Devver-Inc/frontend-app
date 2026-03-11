import { useEffect, useRef } from 'react'
import { useLogto } from '@logto/react'
import { useOrganizationContext } from '@/lib/organization/organization-context'

function decodeJwtPayload(token: string): unknown {
  const parts = token.split('.')
  if (parts.length !== 3) return {}
  const payload = parts[1].replaceAll('-', '+').replaceAll('_', '/')
  const padded = payload.padEnd(
    payload.length + ((4 - (payload.length % 4)) % 4),
    '=',
  )
  try {
    return JSON.parse(globalThis.atob(padded))
  } catch {
    return {}
  }
}

/**
 * Reads organizations from the access token and populates OrganizationContext.
 * Call this once at the root level (e.g. __root.tsx).
 */
export function useLoadOrganizationsFromToken() {
  const { isAuthenticated, getAccessToken } = useLogto()
  const { setOrganizations } = useOrganizationContext()

  const getAccessTokenRef = useRef(getAccessToken)
  getAccessTokenRef.current = getAccessToken

  const hasLoaded = useRef(false)

  useEffect(() => {
    if (!isAuthenticated) {
      hasLoaded.current = false
      return
    }
    if (hasLoaded.current) return

    const abortController = new AbortController()

    const load = async (signal: AbortSignal) => {
      try {
        const token = await getAccessTokenRef.current(
          import.meta.env.VITE_API_BASE_URL,
        )
        if (!token || signal.aborted) return
        const payload = decodeJwtPayload(token) as {
          organizations?: Array<{ id: string; name: string }>
        }
        const orgs =
          payload.organizations?.map((org) => ({
            id: org.id,
            name: org.name,
          })) ?? []
        if (!signal.aborted) {
          hasLoaded.current = true
          setOrganizations(orgs)
        }
      } catch {
        // token fetch failed, leave orgs as-is
      }
    }
    void load(abortController.signal)

    return () => {
      abortController.abort()
    }
  }, [isAuthenticated, setOrganizations])
}
