import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"
import { profileKeys } from "@/features/profile/api/profile.keys"
import { uploadProfilePicture } from "@/features/profile/api/upload-profile-picture"

export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient()
  const organizationId = useCurrentOrganizationId()

  return useMutation({
    mutationFn: (file: File) => uploadProfilePicture(organizationId, file),
    meta: { errorMessage: "Failed to update profile." },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: profileKeys.me() }),
  })
}
