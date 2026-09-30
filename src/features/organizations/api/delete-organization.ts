import { api } from "@/lib/api/client"

export const deleteOrganization = (organizationId: string) =>
  api.delete("/organizations", { organizationId })
