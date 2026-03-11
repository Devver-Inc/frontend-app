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

export type OrganizationLight = {
  id: string
  name: string
}

type OrganizationContextValue = {
  currentOrganizationId: string | null
  setCurrentOrganizationId: (id: string | null) => void
  getOrganizationId: () => string | null
  organizations: Array<OrganizationLight>
  setOrganizations: (orgs: Array<OrganizationLight>) => void
  addOrganization: (org: OrganizationLight) => void
  removeOrganization: (id: string) => void
}

const OrganizationContext = createContext<OrganizationContextValue | null>(null)

type OrganizationProviderProps = Readonly<{ children: ReactNode }>

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const [currentOrganizationId, setCurrentOrganizationId] = useState<
    string | null
  >(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (globalThis.window === undefined) return null
    return globalThis.localStorage.getItem(STORAGE_KEY)
  })

  const [organizations, setOrganizations] = useState<Array<OrganizationLight>>(
    [],
  )

  const ref = useRef<string | null>(currentOrganizationId)
  ref.current = currentOrganizationId

  const persistAndSetCurrentOrganizationId = useCallback(
    (id: string | null) => {
      ref.current = id
      setCurrentOrganizationId(id)
      try {
        if (id === null) {
          globalThis.localStorage.removeItem(STORAGE_KEY)
        } else {
          globalThis.localStorage.setItem(STORAGE_KEY, id)
        }
      } catch {
        // ignore storage errors
      }
    },
    [],
  )

  const getOrganizationId = useCallback(() => ref.current, [])

  const addOrganization = useCallback((org: OrganizationLight) => {
    setOrganizations((prev) => {
      if (prev.some((o) => o.id === org.id)) return prev
      return [...prev, org]
    })
  }, [])

  const removeOrganization = useCallback((id: string) => {
    setOrganizations((prev) => prev.filter((o) => o.id !== id))
  }, [])

  const value = useMemo<OrganizationContextValue>(
    () => ({
      currentOrganizationId,
      setCurrentOrganizationId: persistAndSetCurrentOrganizationId,
      getOrganizationId,
      organizations,
      setOrganizations,
      addOrganization,
      removeOrganization,
    }),
    [
      currentOrganizationId,
      persistAndSetCurrentOrganizationId,
      getOrganizationId,
      organizations,
      addOrganization,
      removeOrganization,
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
