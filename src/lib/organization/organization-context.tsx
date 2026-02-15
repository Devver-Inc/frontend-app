/**
 * Current organization context for API calls.
 * The backend expects the access token to include organization_id (organization token).
 * We persist the selected organization ID so getAccessToken(resource, organizationId) is used.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'

const STORAGE_KEY = 'devver_current_organization_id'

type OrganizationContextValue = {
  currentOrganizationId: string | null
  setCurrentOrganizationId: (id: string | null) => void
  /** Used by API client to get token with organization context. */
  getOrganizationId: () => string | null
}

const OrganizationContext = createContext<OrganizationContextValue | null>(null)

type OrganizationProviderProps = Readonly<{ children: ReactNode }>

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const [currentOrganizationId, setCurrentOrganizationId] = useState<
    string | null
  >(() => {
    if (globalThis.window === undefined) return null
    return globalThis.localStorage.getItem(STORAGE_KEY)
  })

  const ref = useRef<string | null>(currentOrganizationId)
  ref.current = currentOrganizationId

  const persistAndSetCurrentOrganizationId = useCallback(
    (id: string | null) => {
      setCurrentOrganizationId(id)
      try {
        if (id === null) {
          globalThis.localStorage.removeItem(STORAGE_KEY)
        } else {
          globalThis.localStorage.setItem(STORAGE_KEY, id)
        }
      } catch {
        // ignore
      }
    },
    [],
  )

  const getOrganizationId = useCallback(() => ref.current, [])

  const value = useMemo<OrganizationContextValue>(
    () => ({
      currentOrganizationId,
      setCurrentOrganizationId: persistAndSetCurrentOrganizationId,
      getOrganizationId,
    }),
    [
      currentOrganizationId,
      persistAndSetCurrentOrganizationId,
      getOrganizationId,
    ],
  )

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganizationContext(): OrganizationContextValue {
  const ctx = useContext(OrganizationContext)
  if (!ctx) {
    throw new Error(
      'useOrganizationContext must be used within OrganizationProvider',
    )
  }
  return ctx
}
