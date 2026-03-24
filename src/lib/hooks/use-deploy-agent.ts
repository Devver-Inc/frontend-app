import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useLogto } from '@logto/react'

import type {
  ArgoDeploymentStatusEvent,
  CreateProjectRepoInput,
} from '@/lib/api/deploy-agent'
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

export function useArgoStatusStream(projectId: string | undefined) {
  const { isAuthenticated, getAccessToken } = useLogto()
  const { currentOrganizationId } = useOrganizationContext()
  const [status, setStatus] = useState<ArgoDeploymentStatusEvent | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [streamError, setStreamError] = useState<string | null>(null)
  const [lastEventAt, setLastEventAt] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!projectId || !isAuthenticated) return

    const abortController = new AbortController()
    abortRef.current = abortController

    const connect = async () => {
      try {
        const token = await getAccessToken(
          import.meta.env.VITE_API_BASE_URL,
          currentOrganizationId ?? undefined,
        )
        if (!token) throw new Error('Missing access token for ArgoCD stream')

        await fetchEventSource(
          `${import.meta.env.VITE_API_BASE_URL}/projects/${projectId}/argocd/status/stream`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              ...(currentOrganizationId
                ? { 'x-organization-id': currentOrganizationId }
                : {}),
            },
            signal: abortController.signal,
            openWhenHidden: true,
            async onopen(response) {
              if (!response.ok) {
                throw new Error(`Unable to open SSE stream: ${response.status}`)
              }
              setIsConnected(true)
              setStreamError(null)
            },
            onmessage(event) {
              setLastEventAt(new Date().toISOString())
              if (!event.data) return
              try {
                const parsed = JSON.parse(
                  event.data,
                ) as ArgoDeploymentStatusEvent
                setStatus(parsed)
              } catch {
                // Ignore malformed SSE payloads.
              }
            },
            onerror(err) {
              setIsConnected(false)
              setStreamError(err instanceof Error ? err.message : 'SSE error')
              throw err
            },
            onclose() {
              setIsConnected(false)
            },
          },
        )
      } catch (err) {
        if (abortController.signal.aborted) return
        setIsConnected(false)
        setStreamError(
          err instanceof Error ? err.message : 'ArgoCD status stream failed',
        )
      }
    }

    void connect()

    return () => {
      abortController.abort()
      setIsConnected(false)
    }
  }, [projectId, isAuthenticated, getAccessToken, currentOrganizationId])

  return { status, isConnected, streamError, lastEventAt }
}
