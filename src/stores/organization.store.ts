import { create } from "zustand"
import { persist } from "zustand/middleware"

type OrganizationState = {
  currentOrganizationId: string | null
  setCurrentOrganizationId: (organizationId: string | null) => void
}

// Hydrated synchronously: only client-only routes and API calls read it, never
// the prerendered shell.
export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set) => ({
      currentOrganizationId: null,
      setCurrentOrganizationId: (currentOrganizationId) =>
        set({ currentOrganizationId }),
    }),
    { name: "organization" }
  )
)
