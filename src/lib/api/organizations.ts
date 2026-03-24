import { apiFetch, apiJson, apiJsonWithoutOrganization } from './client'
import type { UserLight } from './members'

export type OrganizationLight = {
  id: string
  name: string
  coverImageUrl: string | null
}

export type OrganizationDetails = {
  id: string
  name: string
  coverImageUrl: string | null
  owner: UserLight | null
  admins: Array<UserLight>
  membersCount: number
}

export type CreateOrganizationInput = {
  name: string
  description?: string
  logoFile?: File | null
}

export type UpdateOrganizationInput = {
  name?: string
  description?: string
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

export async function getOrganization(): Promise<OrganizationLight> {
  return apiJson<OrganizationLight>('/organizations')
}

export async function getOrganizationDetails(): Promise<OrganizationDetails> {
  return apiJson<OrganizationDetails>('/organizations/details')
}

export async function updateOrganization(
  input: UpdateOrganizationInput,
): Promise<OrganizationLight> {
  return apiJson<OrganizationLight>('/organizations', {
    method: 'PATCH',
    body: input,
  })
}

export async function uploadOrganizationLogo(
  logoFile: File,
): Promise<OrganizationLight> {
  const formData = new FormData()
  formData.append('logoFile', logoFile)

  return apiJson<OrganizationLight>('/organizations/logo', {
    method: 'POST',
    body: formData,
  })
}

export async function deleteOrganizationLogo(): Promise<OrganizationLight> {
  return apiJson<OrganizationLight>('/organizations/logo', {
    method: 'DELETE',
  })
}

export async function deleteOrganization(): Promise<void> {
  const res = await apiFetch('/organizations', { method: 'DELETE' })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }
}
