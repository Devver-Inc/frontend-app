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
  userId: string
  content: string
  position: CommentPosition
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
  position: CommentPosition
}

export async function getProjectComments(
  projectId: string,
  params?: { page?: number; pageSize?: number; search?: string },
): Promise<PaginatedComments> {
  const qs = new URLSearchParams()
  if (params?.page != null) qs.set('page', String(params.page))
  if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
  if (params?.search) qs.set('search', params.search)
  const query = qs.toString()
  const path = query
    ? `/comments/${projectId}?${query}`
    : `/comments/${projectId}`
  return apiJson<PaginatedComments>(path)
}

export async function createProjectComment(
  projectId: string,
  input: CreateCommentInput,
): Promise<ProjectComment> {
  return apiJson<ProjectComment>(`/comments/${projectId}`, {
    method: 'POST',
    body: input,
  })
}
