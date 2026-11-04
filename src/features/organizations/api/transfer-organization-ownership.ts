import { api } from "@/lib/api/client"

export const transferOrganizationOwnership = (
  organizationId: string,
  newOwnerId: string
) =>
  api.put(`/organizations/owner/${encodeURIComponent(newOwnerId)}`, {
    organizationId,
  })
