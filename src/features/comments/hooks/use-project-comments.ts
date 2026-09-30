import { queryOptions, skipToken, useQuery } from "@tanstack/react-query"
import { commentKeys } from "@/features/comments/api/comment.keys"
import { getProjectComments } from "@/features/comments/api/get-project-comments"
import type { CommentFilters } from "@/features/comments/types/comment.types"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"

export const projectCommentsQueryOptions = (
  organizationId: string | null,
  projectId: string,
  filters: CommentFilters
) =>
  queryOptions({
    queryKey: commentKeys.list(organizationId, projectId, filters),
    queryFn: organizationId
      ? ({ signal }) =>
          getProjectComments(organizationId, projectId, filters, signal)
      : skipToken,
  })

export const useProjectComments = (
  projectId: string,
  filters: CommentFilters
) => {
  const organizationId = useCurrentOrganizationId()
  return useQuery(
    projectCommentsQueryOptions(organizationId, projectId, filters)
  )
}
