import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { CreateProjectRepoInput } from '@/lib/api/deploy-agent'
import {
  createProjectRepo,
  deleteProjectRepo,
  getProjectDeploymentLogs,
  getProjectDeployments,
  getProjectRepos,
} from '@/lib/api/deploy-agent'
import { useOrganizationContext } from '@/lib/organization/organization-context'

export function useProjectRepos(projectId: string) {
  const { currentOrganizationId } = useOrganizationContext()
  return useQuery({
    queryKey: ['project-repos', currentOrganizationId, projectId],
    queryFn: () => getProjectRepos(projectId),
    enabled: !!currentOrganizationId && !!projectId,
  })
}

export function useCreateProjectRepo(projectId: string) {
  const queryClient = useQueryClient()
  const { currentOrganizationId } = useOrganizationContext()
  return useMutation({
    mutationFn: (input: CreateProjectRepoInput) =>
      createProjectRepo(projectId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-repos', currentOrganizationId, projectId],
      })
    },
  })
}

export function useDeleteProjectRepo(projectId: string) {
  const queryClient = useQueryClient()
  const { currentOrganizationId } = useOrganizationContext()
  return useMutation({
    mutationFn: (repoName: string) => deleteProjectRepo(projectId, repoName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-repos', currentOrganizationId, projectId],
      })
      queryClient.invalidateQueries({
        queryKey: ['project-deployments', currentOrganizationId, projectId],
      })
    },
  })
}

export function useProjectDeployments(projectId: string) {
  const { currentOrganizationId } = useOrganizationContext()
  return useQuery({
    queryKey: ['project-deployments', currentOrganizationId, projectId],
    queryFn: () => getProjectDeployments(projectId),
    enabled: !!currentOrganizationId && !!projectId,
  })
}

export function useProjectDeploymentLogs(projectId: string) {
  return useMutation({
    mutationFn: (deploymentId: string) =>
      getProjectDeploymentLogs(projectId, deploymentId),
  })
}
