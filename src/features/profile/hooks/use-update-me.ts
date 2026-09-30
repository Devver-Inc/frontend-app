import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"
import { profileKeys } from "@/features/profile/api/profile.keys"
import { updateMe } from "@/features/profile/api/update-me"
import type { UpdateMeInput } from "@/features/profile/types/profile.types"

export const useUpdateMe = () => {
  const queryClient = useQueryClient()
  const organizationId = useCurrentOrganizationId()

  return useMutation({
    mutationFn: (input: UpdateMeInput) => updateMe(organizationId, input),
    meta: { errorMessage: "Failed to update profile." },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: profileKeys.me() }),
  })
}
