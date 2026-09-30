import { organizationSchema } from "@/features/organizations/schemas/organization.schema"
import { api } from "@/lib/api/client"

export const deleteOrganizationLogo = (organizationId: string) =>
  api.delete("/organizations/logo", {
    schema: organizationSchema,
    organizationId,
  })
