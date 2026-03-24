import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateInvitationInput } from '@/lib/api/members'
import { useOrganizationContext } from '@/lib/organization/organization-context'
import {
  createInvitation,
  getOrganizationInvitations,
  getOrganizationMembers,
  getOrganizationRoles,
  removeUserFromOrganization,
  revokeInvitation,
} from '@/lib/api/members'

export function useMembers(params?: {
  page?: number
  pageSize?: number
  search?: string
  rolesFilter?: Array<string>
}) {
  const { currentOrganizationId } = useOrganizationContext()

  return useQuery({
    queryKey: ['members', currentOrganizationId, params],
    queryFn: () => getOrganizationMembers(params),
    enabled: !!currentOrganizationId,
  })
}

export function useInvitations() {
  const { currentOrganizationId } = useOrganizationContext()

  return useQuery({
    queryKey: ['invitations', currentOrganizationId],
    queryFn: () => getOrganizationInvitations(),
    enabled: !!currentOrganizationId,
  })
}

export function useCreateInvitation() {
  const queryClient = useQueryClient()
  const { currentOrganizationId } = useOrganizationContext()

  return useMutation({
    mutationFn: (input: CreateInvitationInput) => createInvitation(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['invitations', currentOrganizationId],
      })
    },
  })
}

export function useRemoveMember() {
  const queryClient = useQueryClient()
  const { currentOrganizationId } = useOrganizationContext()

  return useMutation({
    mutationFn: (userId: string) => removeUserFromOrganization(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['members', currentOrganizationId],
      })
    },
  })
}

export function useRevokeInvitation() {
  const queryClient = useQueryClient()
  const { currentOrganizationId } = useOrganizationContext()

  return useMutation({
    mutationFn: (invitationId: string) => revokeInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['invitations', currentOrganizationId],
      })
    },
  })
}

export function useOrganizationRoles() {
  return useQuery({
    queryKey: ['organization-roles'],
    queryFn: getOrganizationRoles,
    staleTime: Infinity,
  })
}
