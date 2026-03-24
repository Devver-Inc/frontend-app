import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { CreateCommentInput } from '@/lib/api/comments'
import { createProjectComment, getProjectComments } from '@/lib/api/comments'
import { useOrganizationContext } from '@/lib/organization/organization-context'

export function useProjectComments(
  projectId: string,
  params?: { page?: number; pageSize?: number; search?: string },
) {
  const { currentOrganizationId } = useOrganizationContext()

  return useQuery({
    queryKey: ['project-comments', currentOrganizationId, projectId, params],
    queryFn: () => getProjectComments(projectId, params),
    enabled: !!currentOrganizationId && !!projectId,
  })
}

export function useCreateProjectComment(projectId: string) {
  const queryClient = useQueryClient()
  const { currentOrganizationId } = useOrganizationContext()

  return useMutation({
    mutationFn: (input: CreateCommentInput) =>
      createProjectComment(projectId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-comments', currentOrganizationId, projectId],
      })
    },
  })
}
