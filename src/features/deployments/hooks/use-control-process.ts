import { useMutation, useQueryClient } from "@tanstack/react-query"
import { controlProcess } from "@/features/deployments/api/control-process"
import { deploymentKeys } from "@/features/deployments/api/deployment.keys"
import type { ProcessAction } from "@/features/deployments/types/deployment.types"
import {
  requireOrganizationId,
  useCurrentOrganizationId,
} from "@/features/organizations/hooks/use-current-organization-id"

type ControlProcessInput = {
  action: ProcessAction
  name: string
}

export const useControlProcess = (projectId: string) => {
  const queryClient = useQueryClient()
  const organizationId = useCurrentOrganizationId()

  return useMutation({
    mutationFn: ({ action, name }: ControlProcessInput) =>
      controlProcess(
        requireOrganizationId(organizationId),
        projectId,
        action,
        name
      ),
    meta: { errorMessage: "Failed to control the process." },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: deploymentKeys.list(organizationId, projectId),
      }),
  })
}
