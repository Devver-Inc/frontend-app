import { organizationSchema } from "@/features/organizations/schemas/organization.schema"
import type { CreateOrganizationInput } from "@/features/organizations/types/organization.types"
import { api } from "@/lib/api/client"

export const createOrganization = ({
  name,
  description,
  logoFile,
}: CreateOrganizationInput) => {
  const body = new FormData()
  body.append("name", name)
  if (description) body.append("description", description)
  if (logoFile) body.append("logoFile", logoFile)
  return api.post("/organizations", { schema: organizationSchema, body })
}
