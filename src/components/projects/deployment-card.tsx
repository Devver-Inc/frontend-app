import {
  Activity,
  ExternalLink,
  GitCommitHorizontal,
  Globe2,
  LoaderCircle,
} from 'lucide-react'

import type {
  DeploymentLogs,
  DeploymentProcessStatus,
  ProjectDeployment,
} from '@/lib/api/deploy-agent'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type DeploymentCardProps = {
  deployment: ProjectDeployment
  isSelectedForLogs: boolean
  isLogsPending: boolean
  logs?: DeploymentLogs
  onGetLogs: (deploymentId: string) => void
}

function getDeploymentStatusClasses(
  status: DeploymentProcessStatus | undefined,
) {
  if (status === 'online') {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
  }
  if (status === 'errored') {
    return 'border-destructive/30 bg-destructive/10 text-destructive'
  }
  return 'border-border bg-muted/60 text-muted-foreground'
}

function getDeploymentService(deployment: ProjectDeployment) {
  if (deployment.service.web) {
    return { name: 'web', ...deployment.service.web }
  }
  if (deployment.service.api) {
    return { name: 'api', ...deployment.service.api }
  }
  return null
}

function formatMemory(bytes: number) {
  return `${new Intl.NumberFormat('en', {
    maximumFractionDigits: 1,
  }).format(bytes / 1024 / 1024)} MB`
}

export function DeploymentCard({
  deployment,
  isSelectedForLogs,
  isLogsPending,
  logs,
  onGetLogs,
}: DeploymentCardProps) {
  const service = getDeploymentService(deployment)
  const processStatus = deployment.process?.status

  return (
    <div className="rounded-xl border border-border/60 bg-background/20 p-4 transition-colors hover:border-border">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">
              {deployment.repo} <span className="text-muted-foreground">/</span>{' '}
              {deployment.branch}
            </p>
            <Badge
              variant="outline"
              className={getDeploymentStatusClasses(processStatus)}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              <span className="capitalize">
                {processStatus ?? 'unavailable'}
              </span>
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span
              className="inline-flex items-center gap-1.5"
              title={deployment.commit}
            >
              <GitCommitHorizontal className="h-3.5 w-3.5" />
              <span className="font-mono">{deployment.commit.slice(0, 7)}</span>
            </span>
            {service ? (
              <span className="inline-flex items-center gap-1.5">
                <Globe2 className="h-3.5 w-3.5" />
                <span className="capitalize">{service.name}</span>
                <span>· port {service.port}</span>
              </span>
            ) : null}
            {deployment.process ? (
              <span className="inline-flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                CPU {deployment.process.cpu}% ·{' '}
                {formatMemory(deployment.process.memory)}
              </span>
            ) : null}
          </div>

          {service ? (
            <a
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full items-center gap-1.5 text-xs text-primary hover:underline"
              title={service.url}
            >
              <span className="truncate">{service.url}</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          ) : (
            <p className="text-xs text-muted-foreground">
              No public URL available.
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {service ? (
            <Button asChild size="sm">
              <a
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${deployment.repo} ${deployment.branch} deployment`}
              >
                <ExternalLink className="h-4 w-4" />
                Open
              </a>
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onGetLogs(deployment.deploymentId)}
            disabled={isLogsPending}
          >
            {isSelectedForLogs && isLogsPending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : null}
            Logs
          </Button>
        </div>
      </div>

      {isSelectedForLogs && logs ? (
        <div className="mt-3 space-y-1 rounded-md border border-border/50 bg-background/40 p-2">
          {logs.logs.length === 0 ? (
            <p className="text-xs text-muted-foreground">No logs available.</p>
          ) : (
            logs.logs.slice(0, 100).map((entry, idx) => (
              <p key={`${deployment.deploymentId}-${idx}`} className="text-xs">
                <span className="text-muted-foreground">
                  [{entry.timestamp}] [{entry.service}] [{entry.level}]
                </span>{' '}
                {entry.message}
              </p>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}
