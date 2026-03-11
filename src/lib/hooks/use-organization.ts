import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UpdateOrganizationInput } from '@/lib/api/organizations'
import { useOrganizationContext } from '@/lib/organization/organization-context'
import {
  deleteOrganization,
  getOrganization,
  getOrganizationDetails,
  updateOrganization,
} from '@/lib/api/organizations'

export function useOrganizationInfo() {
  const { currentOrganizationId } = useOrganizationContext()

  return useQuery({
    queryKey: ['organization', currentOrganizationId],
    queryFn: () => getOrganization(),
    enabled: !!currentOrganizationId,
  })
}

export function useOrganizationDetails() {
  const { currentOrganizationId } = useOrganizationContext()

  return useQuery({
    queryKey: ['organization-details', currentOrganizationId],
    queryFn: () => getOrganizationDetails(),
    enabled: !!currentOrganizationId,
  })
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient()
  const { currentOrganizationId } = useOrganizationContext()

  return useMutation({
    mutationFn: (input: UpdateOrganizationInput) => updateOrganization(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['organization', currentOrganizationId],
      })
      queryClient.invalidateQueries({
        queryKey: ['organization-details', currentOrganizationId],
      })
    },
  })
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteOrganization(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization'] })
      queryClient.invalidateQueries({ queryKey: ['organization-details'] })
    },
  })
}
