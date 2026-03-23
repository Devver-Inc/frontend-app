import { apiFetch, apiJson } from './client'
import type { UserLight } from './members'

export type MachineConfiguration = {
  cpuCores: number
  ram: number
  storage: number
}

export type MachineConfigurationInput = {
  cpuCores: number
  ram: number
}

export type AccessControl = {
  requireEmailAuth: boolean
  publicAccess: boolean
  restrictToTeamMembers: boolean
}

export type GetProjectLightDto = {
  id: string
  name: string
  description: string | null
  createdAt: string
}

export type GetProjectDto = GetProjectLightDto & {
  organizationId: string
  createdBy: UserLight | null
  teamMembers: Array<UserLight>
  machineConfiguration: MachineConfiguration
  accessControl: AccessControl
  updatedAt: string
}

export type PaginatedResponse<T> = {
  data: Array<T>
  meta: {
    currentPage: number
    totalItemsCount: number
    totalPagesCount: number
    itemsPerPage: number
  }
}

export type CreateProjectInput = {
  name: string
  description?: string
  machineConfiguration: MachineConfigurationInput
  teamMemberIds: Array<string>
  accessControl: AccessControl
}

export type UpdateProjectInput = Partial<CreateProjectInput>

export type AddProjectMembersInput = {
  userIds: Array<string>
}

export async function getProjects(params?: {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortDirection?: string
}): Promise<PaginatedResponse<GetProjectLightDto>> {
  const qs = new URLSearchParams()
  if (params?.page != null) qs.set('page', String(params.page))
  if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
  if (params?.search) qs.set('search', params.search)
  if (params?.sortBy) qs.set('sortBy', params.sortBy)
  if (params?.sortDirection) qs.set('sortDirection', params.sortDirection)
  const query = qs.toString()
  const path = query ? `/projects?${query}` : '/projects'
  return apiJson<PaginatedResponse<GetProjectLightDto>>(path)
}

export async function getProject(projectId: string): Promise<GetProjectDto> {
  return apiJson<GetProjectDto>(`/projects/${projectId}`)
}

export async function createProject(
  input: CreateProjectInput,
): Promise<GetProjectDto> {
  return apiJson<GetProjectDto>('/projects', {
    method: 'POST',
    body: input,
  })
}

export async function updateProject(
  projectId: string,
  input: UpdateProjectInput,
): Promise<GetProjectDto> {
  return apiJson<GetProjectDto>(`/projects/${projectId}`, {
    method: 'PATCH',
    body: input,
  })
}

export async function deleteProject(projectId: string): Promise<void> {
  const res = await apiFetch(`/projects/${projectId}`, { method: 'DELETE' })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }
}

export async function addProjectMembers(
  projectId: string,
  input: AddProjectMembersInput,
): Promise<GetProjectDto> {
  return apiJson<GetProjectDto>(`/projects/${projectId}/members`, {
    method: 'POST',
    body: input,
  })
}

export async function removeProjectMember(
  projectId: string,
  userId: string,
): Promise<GetProjectDto> {
  return apiJson<GetProjectDto>(`/projects/${projectId}/members/${userId}`, {
    method: 'DELETE',
  })
}
