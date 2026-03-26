import { apiJson } from './client'

export type CommentPosition = {
  pageUrl: string
  anchor: string
  normX: number
  normY: number
  anchorOffsetX: number
  anchorOffsetY: number
}

export type ProjectComment = {
  id: string
  author: {
    id: string
    email: string | null
    name: string | null
    avatarUrl: string | null
  } | null
  repo: string | null
  branch: string | null
  content: string
  position: CommentPosition | null
  createdAt: string
}

export type PaginatedComments = {
  data: Array<ProjectComment>
  meta: {
    currentPage: number
    totalItemsCount: number
    totalPagesCount: number
    itemsPerPage: number
  }
}

export type CreateCommentInput = {
  content: string
  guestEmail?: string
  repo?: string
  branch?: string
  position?: CommentPosition
}

export async function getProjectComments(
  projectId: string,
  params?: {
    page?: number
    pageSize?: number
    search?: string
    repo?: string
    branch?: string
  },
): Promise<PaginatedComments> {
  const qs = new URLSearchParams()
  if (params?.page != null) qs.set('page', String(params.page))
  if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
  if (params?.search) qs.set('search', params.search)
  if (params?.repo) qs.set('repo', params.repo)
  if (params?.branch) qs.set('branch', params.branch)
  const query = qs.toString()
  const path = query
    ? `/projects/${projectId}/comments?${query}`
    : `/projects/${projectId}/comments`
  return apiJson<PaginatedComments>(path)
}

export async function createProjectComment(
  projectId: string,
  input: CreateCommentInput,
): Promise<ProjectComment> {
  return apiJson<ProjectComment>(`/projects/${projectId}/comments`, {
    method: 'POST',
    body: input,
  })
}
