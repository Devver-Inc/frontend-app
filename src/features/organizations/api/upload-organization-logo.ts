import { organizationSchema } from "@/features/organizations/schemas/organization.schema"
import { api } from "@/lib/api/client"

export const uploadOrganizationLogo = (
  organizationId: string,
  logoFile: File
) => {
  const body = new FormData()
  body.append("logoFile", logoFile)
  return api.post("/organizations/logo", {
    schema: organizationSchema,
    organizationId,
    body,
  })
}
