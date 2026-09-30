import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"
import { deleteProfilePicture } from "@/features/profile/api/delete-profile-picture"
import { profileKeys } from "@/features/profile/api/profile.keys"

export const useDeleteProfilePicture = () => {
  const queryClient = useQueryClient()
  const organizationId = useCurrentOrganizationId()

  return useMutation({
    mutationFn: () => deleteProfilePicture(organizationId),
    meta: { errorMessage: "Failed to update profile." },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: profileKeys.me() }),
  })
}
