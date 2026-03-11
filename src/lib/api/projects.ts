import { apiFetch, apiJson } from './client'
import type { UserLight } from './members'

export type MachineConfiguration = {
  cpuCores: number
  ram: number
  storage: number
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
  total: number
  page: number
  pageSize: number
}

export type CreateProjectInput = {
  name: string
  description?: string
  machineConfiguration: MachineConfiguration
  teamMemberIds: Array<string>
  accessControl: AccessControl
}

export type UpdateProjectInput = Partial<CreateProjectInput>

export async function getProjects(params?: {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortDirection?: string
}): Promise<PaginatedResponse<GetProjectLightDto>> {
  const qs = new URLSearchParams()
  if (params?.page) qs.set('page', String(params.page))
  if (params?.pageSize) qs.set('pageSize', String(params.pageSize))
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
