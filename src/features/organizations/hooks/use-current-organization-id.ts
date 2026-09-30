import { useOrganizationStore } from "@/stores/organization.store"

export const useCurrentOrganizationId = () =>
  useOrganizationStore((state) => state.currentOrganizationId)

// Organization-scoped mutations only render once an organization is selected.
export const requireOrganizationId = (
  organizationId: string | null
): string => {
  if (!organizationId) throw new Error("No organization selected.")
  return organizationId
}
