import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateProjectInput } from '@/lib/api/projects'
import { useOrganizationContext } from '@/lib/organization/organization-context'
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
} from '@/lib/api/projects'

export function useProjects(params?: {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortDirection?: string
}) {
  const { currentOrganizationId } = useOrganizationContext()

  return useQuery({
    queryKey: ['projects', currentOrganizationId, params],
    queryFn: () => getProjects(params),
    enabled: !!currentOrganizationId,
  })
}

export function useProject(projectId: string | undefined) {
  const { currentOrganizationId } = useOrganizationContext()

  return useQuery({
    queryKey: ['project', currentOrganizationId, projectId],
    queryFn: () => {
      if (!projectId) throw new Error('projectId is required')
      return getProject(projectId)
    },
    enabled: !!currentOrganizationId && !!projectId,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  const { currentOrganizationId } = useOrganizationContext()

  return useMutation({
    mutationFn: (input: CreateProjectInput) => createProject(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects', currentOrganizationId],
      })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  const { currentOrganizationId } = useOrganizationContext()

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects', currentOrganizationId],
      })
    },
  })
}
