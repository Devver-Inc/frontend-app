import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
  CreateDeploymentInput,
  CreateProjectRepoInput,
} from '@/lib/api/deploy-agent'
import {
  createProjectDeployment,
  createProjectRepo,
  deleteProjectDeployment,
  deleteProjectRepo,
  getProjectDeploymentLogs,
  getProjectDeployments,
  getProjectRepos,
  restoreProjectDeployAgentState,
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

export function useCreateProjectDeployment(projectId: string) {
  const queryClient = useQueryClient()
  const { currentOrganizationId } = useOrganizationContext()
  return useMutation({
    mutationFn: (input: CreateDeploymentInput) =>
      createProjectDeployment(projectId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-deployments', currentOrganizationId, projectId],
      })
    },
  })
}

export function useDeleteProjectDeployment(projectId: string) {
  const queryClient = useQueryClient()
  const { currentOrganizationId } = useOrganizationContext()
  return useMutation({
    mutationFn: (input: { repo: string; branch: string }) =>
      deleteProjectDeployment(projectId, input.repo, input.branch),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-deployments', currentOrganizationId, projectId],
      })
    },
  })
}

export function useProjectDeploymentLogs(projectId: string) {
  return useMutation({
    mutationFn: (deploymentId: string) =>
      getProjectDeploymentLogs(projectId, deploymentId),
  })
}

export function useRestoreProjectDeployAgentState(projectId: string) {
  const queryClient = useQueryClient()
  const { currentOrganizationId } = useOrganizationContext()
  return useMutation({
    mutationFn: () => restoreProjectDeployAgentState(projectId),
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
