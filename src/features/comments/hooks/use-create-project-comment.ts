import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentKeys } from "@/features/comments/api/comment.keys"
import { createProjectComment } from "@/features/comments/api/create-project-comment"
import type { CreateCommentInput } from "@/features/comments/types/comment.types"
import {
  requireOrganizationId,
  useCurrentOrganizationId,
} from "@/features/organizations/hooks/use-current-organization-id"

export const useCreateProjectComment = (projectId: string) => {
  const queryClient = useQueryClient()
  const organizationId = useCurrentOrganizationId()

  return useMutation({
    mutationFn: (input: CreateCommentInput) =>
      createProjectComment(
        requireOrganizationId(organizationId),
        projectId,
        input
      ),
    meta: { errorMessage: "Failed to post comment." },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: commentKeys.lists(organizationId, projectId),
      }),
  })
}
