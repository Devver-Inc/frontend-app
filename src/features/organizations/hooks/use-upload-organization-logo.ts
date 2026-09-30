import { useMutation, useQueryClient } from "@tanstack/react-query"
import { organizationKeys } from "@/features/organizations/api/organization.keys"
import { uploadOrganizationLogo } from "@/features/organizations/api/upload-organization-logo"

export const useUploadOrganizationLogo = (organizationId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (logoFile: File) =>
      uploadOrganizationLogo(organizationId, logoFile),
    meta: { errorMessage: "Failed to update organization." },
    onSuccess: (organization) =>
      queryClient.setQueryData(
        organizationKeys.detail(organizationId),
        organization
      ),
  })
}
