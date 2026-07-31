import { apiFetch, apiJson } from './client'

export type ProjectRepo = {
  id: string
  name: string
  pushUrl: string
  projectId: string
  createdAt: string
}

export type DeploymentServiceResult = {
  port: number
  url: string
}

export type DeploymentProcessStatus = 'online' | 'stopped' | 'errored'

export type DeploymentProcess = {
  name: string
  pm_id: number
  status: DeploymentProcessStatus
  cpu: number
  memory: number
}

export type ProjectDeployment = {
  deploymentId: string
  repo: string
  branch: string
  commit: string
  service: Partial<Record<'web' | 'api', DeploymentServiceResult>>
  process: DeploymentProcess | null
}

export type DeploymentLogEntry = {
  service: string
  level: string
  message: string
  timestamp: string
}

export type DeploymentLogs = {
  logs: Array<DeploymentLogEntry>
}

/** Argo CD `ApplicationStatus.health.status` */
export type ArgoApplicationHealthStatus =
  | 'Healthy'
  | 'Progressing'
  | 'Degraded'
  | 'Suspended'
  | 'Missing'
  | 'Unknown'

/** Argo CD `ApplicationStatus.sync.status` */
export type ArgoApplicationSyncStatus =
  | 'Synced'
  | 'OutOfSync'
  | 'Unknown'

/** Typical `status.operationState.phase` values from Argo CD */
export type ArgoOperationPhase =
  | 'Pending'
  | 'Running'
  | 'Succeeded'
  | 'Failed'
  | 'Error'
  | 'Terminating'

export type ArgoApplicationDeploymentStatus = {
  appName: string
  type: string
  healthStatus: ArgoApplicationHealthStatus
  syncStatus: ArgoApplicationSyncStatus
  operationPhase?: ArgoOperationPhase
  operationMessage?: string
}

export type ArgoDeploymentStatusEvent = {
  appName: string
  healthStatus: ArgoApplicationHealthStatus
  syncStatus: ArgoApplicationSyncStatus
  operationPhase?: ArgoOperationPhase
  operationMessage?: string
  timestamp: string
  podReady: boolean
  applications: Array<ArgoApplicationDeploymentStatus>
}

export type CreateProjectRepoInput = {
  name: string
}

export async function getProjectRepos(
  projectId: string,
): Promise<Array<ProjectRepo>> {
  return apiJson<Array<ProjectRepo>>(`/projects/${projectId}/repos`)
}

export async function createProjectRepo(
  projectId: string,
  input: CreateProjectRepoInput,
): Promise<ProjectRepo> {
  return apiJson<ProjectRepo>(`/projects/${projectId}/repos`, {
    method: 'POST',
    body: input,
  })
}

export async function deleteProjectRepo(
  projectId: string,
  name: string,
): Promise<void> {
  const res = await apiFetch(
    `/projects/${projectId}/repos/${encodeURIComponent(name)}`,
    { method: 'DELETE' },
  )
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }
}

export async function getProjectDeployments(
  projectId: string,
): Promise<Array<ProjectDeployment>> {
  return apiJson<Array<ProjectDeployment>>(`/projects/${projectId}/deployments`)
}

export async function getArgoCdStatus(
  projectId: string,
): Promise<ArgoDeploymentStatusEvent> {
  return apiJson<ArgoDeploymentStatusEvent>(
    `/projects/${projectId}/argocd/status`,
  )
}

export async function getProjectDeploymentLogs(
  projectId: string,
  deploymentId: string,
): Promise<DeploymentLogs> {
  return apiJson<DeploymentLogs>(
    `/projects/${projectId}/deployments/${deploymentId}/logs`,
  )
}
