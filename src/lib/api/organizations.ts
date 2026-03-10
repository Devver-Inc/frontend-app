import { apiJsonWithoutOrganization } from './client'

export type OrganizationLight = {
  id: string
  name: string
  coverImageUrl: string | null
}

export type CreateOrganizationInput = {
  name: string
  description?: string
  logoFile?: File | null
}

export async function createOrganization(
  input: CreateOrganizationInput,
): Promise<OrganizationLight> {
  const formData = new FormData()
  formData.append('name', input.name)
  if (input.description) {
    formData.append('description', input.description)
  }
  if (input.logoFile) {
    formData.append('logoFile', input.logoFile)
  }

  return apiJsonWithoutOrganization<OrganizationLight>('/organizations', {
    method: 'POST',
    body: formData,
  })
}
