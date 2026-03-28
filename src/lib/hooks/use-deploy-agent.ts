import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import { useLogto } from '@logto/react'

import type {
  ArgoDeploymentStatusEvent,
  CreateProjectRepoInput,
} from '@/lib/api/deploy-agent'
import {
  createProjectRepo,
  deleteProjectRepo,
  getArgoCdStatus,
  getProjectDeploymentLogs,
  getProjectDeployments,
  getProjectRepos,
} from '@/lib/api/deploy-agent'
import { useOrganizationContext } from '@/lib/organization/organization-context'

const ARGO_SSE_RETRY_MS = 3_000

function isArgoStreamAuthError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  if (msg.includes('Missing access token')) return true
  return /Unable to open SSE stream:\s*(401|403)\b/.test(msg)
}

function sleepAbortable(signal: AbortSignal, ms: number): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve()
      return
    }
    const t = globalThis.setTimeout(() => resolve(), ms)
    signal.addEventListener(
      'abort',
      () => {
        globalThis.clearTimeout(t)
        resolve()
      },
      { once: true },
    )
  })
}

type ArgoSseLoopCtx = Readonly<{
  signal: AbortSignal
  projectId: string
  organizationId: string
  apiBaseUrl: string
  getAccessToken: (
    resource?: string,
    organizationId?: string,
  ) => Promise<string | undefined>
  setStatus: Dispatch<SetStateAction<ArgoDeploymentStatusEvent | null>>
  setLastEventAt: Dispatch<SetStateAction<string | null>>
  setIsConnected: Dispatch<SetStateAction<boolean>>
  setStreamError: Dispatch<SetStateAction<string | null>>
}>

function applyArgoSseMessage(
  ctx: ArgoSseLoopCtx,
  data: string | null,
): void {
  ctx.setLastEventAt(new Date().toISOString())
  if (!data) return
  try {
    const parsed = JSON.parse(data) as ArgoDeploymentStatusEvent
    ctx.setStatus(parsed)
  } catch {
    // Ignore malformed SSE payloads.
  }
}

function handleArgoSseTransportError(ctx: ArgoSseLoopCtx, err: unknown): number {
  ctx.setIsConnected(false)
  const message = err instanceof Error ? err.message : 'SSE error'
  ctx.setStreamError(message)
  if (isArgoStreamAuthError(err)) {
    throw err
  }
  return ARGO_SSE_RETRY_MS
}

function subscribeArgoStatusEventSource(
  ctx: ArgoSseLoopCtx,
  token: string,
): Promise<void> {
  return fetchEventSource(
    `${ctx.apiBaseUrl}/projects/${ctx.projectId}/argocd/status/stream`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-organization-id': ctx.organizationId,
      },
      signal: ctx.signal,
      openWhenHidden: true,
      async onopen(response) {
        if (!response.ok) {
          throw new Error(`Unable to open SSE stream: ${response.status}`)
        }
        ctx.setIsConnected(true)
        ctx.setStreamError(null)
        await Promise.resolve()
      },
      onmessage(event) {
        applyArgoSseMessage(ctx, event.data)
      },
      onerror(err) {
        return handleArgoSseTransportError(ctx, err)
      },
      onclose() {
        ctx.setIsConnected(false)
      },
    },
  )
}

async function runOneArgoSseSession(
  ctx: ArgoSseLoopCtx,
): Promise<'exit' | 'repeat'> {
  try {
    const token = await ctx.getAccessToken(
      ctx.apiBaseUrl,
      ctx.organizationId,
    )
    if (!token) throw new Error('Missing access token for ArgoCD stream')

    try {
      const snapshot = await getArgoCdStatus(ctx.projectId)
      if (ctx.signal.aborted) return 'exit'
      ctx.setStatus(snapshot)
      ctx.setLastEventAt(new Date().toISOString())
    } catch {
      // Snapshot is best-effort; SSE still delivers updates.
    }

    await subscribeArgoStatusEventSource(ctx, token)
    return 'repeat'
  } catch (err) {
    if (ctx.signal.aborted) return 'exit'
    ctx.setIsConnected(false)
    ctx.setStreamError(
      err instanceof Error ? err.message : 'ArgoCD status stream failed',
    )
    return isArgoStreamAuthError(err) ? 'exit' : 'repeat'
  }
}

async function runArgoStatusSseLoop(ctx: ArgoSseLoopCtx): Promise<void> {
  while (!ctx.signal.aborted) {
    const next = await runOneArgoSseSession(ctx)
    if (next === 'exit' || ctx.signal.aborted) return
    await sleepAbortable(ctx.signal, ARGO_SSE_RETRY_MS)
  }
}

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

export function useProjectDeployments(
  projectId: string | undefined,
  enabled: boolean,
) {
  const { currentOrganizationId } = useOrganizationContext()
  return useQuery({
    queryKey: ['project-deployments', currentOrganizationId, projectId],
    queryFn: () => getProjectDeployments(projectId as string),
    enabled: enabled && !!currentOrganizationId && !!projectId,
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

  useEffect(() => {
    if (!projectId || !isAuthenticated || !currentOrganizationId) {
      setStatus(null)
      setStreamError(null)
      setLastEventAt(null)
      setIsConnected(false)
      return
    }

    setStatus(null)
    setStreamError(null)
    setLastEventAt(null)

    const abortController = new AbortController()

    void runArgoStatusSseLoop({
      signal: abortController.signal,
      projectId,
      organizationId: currentOrganizationId,
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
      getAccessToken,
      setStatus,
      setLastEventAt,
      setIsConnected,
      setStreamError,
    })

    return () => {
      abortController.abort()
      setIsConnected(false)
    }
  }, [projectId, isAuthenticated, getAccessToken, currentOrganizationId])

  return { status, isConnected, streamError, lastEventAt }
}
