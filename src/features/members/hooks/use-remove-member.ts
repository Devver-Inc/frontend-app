import { useMutation, useQueryClient } from "@tanstack/react-query"
import { memberKeys } from "@/features/members/api/member.keys"
import { removeMember } from "@/features/members/api/remove-member"
import {
  requireOrganizationId,
  useCurrentOrganizationId,
} from "@/features/organizations/hooks/use-current-organization-id"

export const useRemoveMember = () => {
  const queryClient = useQueryClient()
  const organizationId = useCurrentOrganizationId()

  return useMutation({
    mutationFn: (userId: string) =>
      removeMember(requireOrganizationId(organizationId), userId),
    meta: { errorMessage: "Failed to remove member." },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: memberKeys.lists(organizationId),
      }),
  })
}
