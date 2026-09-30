import { api } from "@/lib/api/client"

export const removeMember = (organizationId: string, userId: string) =>
  api.delete(`/organizations/users/${encodeURIComponent(userId)}`, {
    organizationId,
  })
