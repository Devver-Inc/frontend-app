/**
 * Organizations API.
 * Backend: POST/GET/PATCH/DELETE /organizations, members, invitations.
 */

import { apiFetch, apiJson } from './client'
import type { PaginatedResponse, UserLight } from './types'

export interface OrganizationLight {
  id: string
  name: string
  coverImageUrl: string | null
}

export interface OrganizationDetails extends OrganizationLight {
  owner: UserLight | null
  admins: Array<UserLight>
  membersCount: number
}

export interface CreateOrganizationInput {
  name: string
  description?: string
  logoFile?: File
}

export interface UpdateOrganizationInput {
  name?: string
  description?: string
  logoFile?: File
}

export interface Invitation {
  id: string
  invitee: string
  inviterId: string
  organizationId: string
  organizationName: string
  status: string
  createdAt: string
  expiresAt: string
  organizationRoles: Array<string>
  message?: string
  acceptedAt?: string
}

export interface CreateInvitationInput {
  invitee: string
  expiresInHours?: number
  message?: string
  organizationRoleIds?: Array<string>
}

export type UpdateInvitationStatusInput = { status: 'Accepted' | 'Revoked' }

export interface OrganizationMembersQuery {
  page?: number
  pageSize?: number
  search?: string
}

/**
 * Create a new organization.
 * Backend: POST /api/v1/organizations (multipart/form-data)
 */
export async function createOrganization(
  input: CreateOrganizationInput,
): Promise<OrganizationLight> {
  const form = new FormData()
  form.append('name', input.name)
  if (input.description != null && input.description !== '') {
    form.append('description', input.description)
  }
  if (input.logoFile != null) {
    form.append('logoFile', input.logoFile)
  }

  const res = await apiFetch('/organizations', {
    method: 'POST',
    body: form,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Create organization failed: ${res.status} ${text}`)
  }

  return res.json() as Promise<OrganizationLight>
}

/**
 * Get current organization (user must have selected an organization in Logto).
 * Backend: GET /api/v1/organizations
 */
export async function getCurrentOrganization(): Promise<OrganizationLight> {
  return apiJson<OrganizationLight>('/organizations')
}

/**
 * Get current organization details (admin). Backend: GET /api/v1/organizations/details
 */
export async function getOrganizationDetails(): Promise<OrganizationDetails> {
  return apiJson<OrganizationDetails>('/organizations/details')
}

/**
 * Update current organization (admin). Backend: PATCH /api/v1/organizations (multipart/form-data)
 */
export async function updateOrganization(
  input: UpdateOrganizationInput,
): Promise<OrganizationLight> {
  const form = new FormData()
  if (input.name != null) form.append('name', input.name)
  if (input.description != null) form.append('description', input.description)
  if (input.logoFile != null) form.append('logoFile', input.logoFile)

  const res = await apiFetch('/organizations', {
    method: 'PATCH',
    body: form,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Update organization failed: ${res.status} ${text}`)
  }
  return res.json() as Promise<OrganizationLight>
}

/**
 * Delete current organization (admin). Backend: DELETE /api/v1/organizations
 */
export async function deleteOrganization(): Promise<void> {
  const res = await apiFetch('/organizations', { method: 'DELETE' })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Delete organization failed: ${res.status} ${text}`)
  }
}

/**
 * Get organization members (paginated). Backend: GET /api/v1/organizations/members
 */
export async function getOrganizationMembers(
  query: OrganizationMembersQuery = {},
): Promise<PaginatedResponse<Array<UserLight>>> {
  const params = new URLSearchParams()
  if (query.page != null) params.set('page', String(query.page))
  if (query.pageSize != null) params.set('pageSize', String(query.pageSize))
  if (query.search != null && query.search !== '')
    params.set('search', query.search)
  const qs = params.toString()
  const path = qs ? `/organizations/members?${qs}` : '/organizations/members'
  return apiJson<PaginatedResponse<Array<UserLight>>>(path)
}

/**
 * Get organization invitations. Backend: GET /api/v1/organizations/invitations
 */
export async function getOrganizationInvitations(): Promise<Array<Invitation>> {
  return apiJson<Array<Invitation>>('/organizations/invitations')
}

/**
 * Create invitation. Backend: POST /api/v1/organizations/invitations
 */
export async function createInvitation(
  input: CreateInvitationInput,
): Promise<Invitation> {
  return apiJson<Invitation>('/organizations/invitations', {
    method: 'POST',
    body: input,
  })
}

/**
 * Update invitation status (accept/revoke). Backend: PATCH /api/v1/organizations/invitations/:id/status
 */
export async function updateInvitationStatus(
  invitationId: string,
  input: UpdateInvitationStatusInput,
): Promise<void> {
  const res = await apiFetch(
    `/organizations/invitations/${encodeURIComponent(invitationId)}/status`,
    { method: 'PATCH', body: input },
  )
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Update invitation failed: ${res.status} ${text}`)
  }
}
