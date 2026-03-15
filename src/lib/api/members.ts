import { apiFetch, apiJson, apiJsonWithoutOrganization } from './client'

export type OrganizationRole = {
  id: string
  name: string
}

export type UserLight = {
  id: string
  name: string | null
  avatarUrl: string | null
}

export type PaginatedMembers = {
  data: Array<UserLight>
  meta: {
    currentPage: number
    totalItemsCount: number
    totalPagesCount: number
    itemsPerPage: number
  }
}

export type Invitation = {
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

export type CreateInvitationInput = {
  invitee: string
  organizationRoleIds?: Array<string>
  message?: string
  expiresInHours?: number
}

export async function getOrganizationMembers(params?: {
  page?: number
  pageSize?: number
  search?: string
  rolesFilter?: Array<string>
}): Promise<PaginatedMembers> {
  const qs = new URLSearchParams()
  if (params?.page != null) qs.set('page', String(params.page))
  if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
  if (params?.search) qs.set('search', params.search)
  if (params?.rolesFilter) {
    for (const role of params.rolesFilter) {
      qs.append('rolesFilter', role)
    }
  }
  const query = qs.toString()
  const path = query
    ? `/organizations/members?${query}`
    : '/organizations/members'
  return apiJson<PaginatedMembers>(path)
}

export async function createInvitation(
  input: CreateInvitationInput,
): Promise<Invitation> {
  return apiJson<Invitation>('/organizations/invitations', {
    method: 'POST',
    body: input,
  })
}

export async function getOrganizationInvitations(): Promise<Array<Invitation>> {
  return apiJson<Array<Invitation>>('/organizations/invitations')
}

export async function removeUserFromOrganization(
  userId: string,
): Promise<void> {
  const res = await apiFetch(`/organizations/users/${userId}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }
}

export async function revokeInvitation(invitationId: string): Promise<void> {
  const res = await apiFetch(
    `/organizations/invitations/${invitationId}/status`,
    {
      method: 'PATCH',
      body: { status: 'Revoked' },
    },
  )
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }
}

export async function getOrganizationRoles(): Promise<Array<OrganizationRole>> {
  return apiJsonWithoutOrganization<Array<OrganizationRole>>(
    '/organizations/roles',
  )
}
