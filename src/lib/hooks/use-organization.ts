import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UpdateOrganizationInput } from '@/lib/api/organizations'
import { useOrganizationContext } from '@/lib/organization/organization-context'
import {
  deleteOrganization,
  deleteOrganizationLogo,
  getOrganization,
  getOrganizationDetails,
  updateOrganization,
  uploadOrganizationLogo,
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
    onSuccess: (data) => {
      queryClient.setQueryData(['organization', currentOrganizationId], data)
      queryClient.invalidateQueries({
        queryKey: ['organization-details', currentOrganizationId],
      })
    },
  })
}

export function useUploadOrganizationLogo() {
  const queryClient = useQueryClient()
  const { currentOrganizationId } = useOrganizationContext()

  return useMutation({
    mutationFn: (logoFile: File) => uploadOrganizationLogo(logoFile),
    onSuccess: (data) => {
      queryClient.setQueryData(['organization', currentOrganizationId], data)
      queryClient.invalidateQueries({
        queryKey: ['organization-details', currentOrganizationId],
      })
    },
  })
}

export function useDeleteOrganizationLogo() {
  const queryClient = useQueryClient()
  const { currentOrganizationId } = useOrganizationContext()

  return useMutation({
    mutationFn: () => deleteOrganizationLogo(),
    onSuccess: (data) => {
      queryClient.setQueryData(['organization', currentOrganizationId], data)
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
