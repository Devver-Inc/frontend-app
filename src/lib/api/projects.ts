/**
 * Projects API. Backend: GET/POST /projects, GET/PATCH/DELETE /projects/:id, members.
 */

import { apiFetch, apiJson } from './client'
import type {
  AccessControl,
  MachineConfiguration,
  PaginatedResponse,
  UserLight,
} from './types'

export interface ProjectLight {
  id: string
  name: string
  description: string | null
  createdAt: string
}

export interface Project extends ProjectLight {
  organizationId: string
  createdBy: UserLight | null
  machineConfiguration: MachineConfiguration
  teamMembers: Array<UserLight>
  accessControl: AccessControl
  updatedAt: string
}

export interface ProjectsQuery {
  page?: number
  pageSize?: number
  search?: string
}

export interface CreateProjectInput {
  name: string
  description?: string
  machineConfiguration: MachineConfiguration
  teamMemberIds: Array<string>
  accessControl: AccessControl
}

export type UpdateProjectInput = Partial<CreateProjectInput>

/**
 * List projects for current organization. Backend: GET /api/v1/projects
 */
export async function getProjects(
  query: ProjectsQuery = {},
): Promise<PaginatedResponse<Array<ProjectLight>>> {
  const params = new URLSearchParams()
  if (query.page != null) params.set('page', String(query.page))
  if (query.pageSize != null) params.set('pageSize', String(query.pageSize))
  if (query.search != null && query.search !== '')
    params.set('search', query.search)
  const qs = params.toString()
  return apiJson<PaginatedResponse<Array<ProjectLight>>>(
    `/projects${qs ? `?${qs}` : ''}`,
  )
}

/**
 * Get project by id. Backend: GET /api/v1/projects/:projectId
 */
export async function getProject(projectId: string): Promise<Project> {
  return apiJson<Project>(`/projects/${encodeURIComponent(projectId)}`)
}

/**
 * Create project. Backend: POST /api/v1/projects (admin)
 */
export async function createProject(
  input: CreateProjectInput,
): Promise<ProjectLight> {
  return apiJson<ProjectLight>('/projects', {
    method: 'POST',
    body: input,
  })
}

/**
 * Update project. Backend: PATCH /api/v1/projects/:projectId (admin)
 */
export async function updateProject(
  projectId: string,
  input: UpdateProjectInput,
): Promise<Project> {
  return apiJson<Project>(`/projects/${encodeURIComponent(projectId)}`, {
    method: 'PATCH',
    body: input,
  })
}

/**
 * Delete project. Backend: DELETE /api/v1/projects/:projectId (admin)
 */
export async function deleteProject(projectId: string): Promise<void> {
  const res = await apiFetch(`/projects/${encodeURIComponent(projectId)}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Delete project failed: ${res.status} ${text}`)
  }
}

/**
 * Add team members to project. Backend: POST /api/v1/projects/:projectId/members (admin)
 */
export async function addProjectMembers(
  projectId: string,
  userIds: Array<string>,
): Promise<Project> {
  return apiJson<Project>(
    `/projects/${encodeURIComponent(projectId)}/members`,
    {
      method: 'POST',
      body: { userIds },
    },
  )
}

/**
 * Remove team member from project. Backend: DELETE /api/v1/projects/:projectId/members/:userId (admin)
 */
export async function removeProjectMember(
  projectId: string,
  userId: string,
): Promise<Project> {
  return apiJson<Project>(
    `/projects/${encodeURIComponent(projectId)}/members/${encodeURIComponent(userId)}`,
    { method: 'DELETE' },
  )
}
