import {
  ExternalLink,
  FileText,
  Play,
  RotateCw,
  Rocket,
  Square,
  Trash2,
} from "lucide-react"
import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { CopyButton } from "@/components/common/copy-button"
import { StatusLabel } from "@/components/common/status"
import { Button } from "@/components/ui/button"
import type {
  Deployment,
  DeploymentLogs,
  ProcessAction,
} from "@/features/deployments/types/deployment.types"
import {
  getDeploymentService,
  getProcessLabel,
  getProcessTone,
} from "@/features/deployments/utils/deployment-status"
import { formatBytes } from "@/lib/utils/format-bytes"

const MAX_LOG_LINES = 100

type DeploymentInspectorProps = {
  deployment: Deployment
  logs?: DeploymentLogs["logs"]
  isLogsPending: boolean
  isProcessPending: boolean
  isDeletePending: boolean
  isPodReady: boolean
  onGetLogs: (deploymentId: string) => void
  onProcessAction: (action: ProcessAction, name: string) => void
  onRedeploy: (deployment: Deployment) => void
  onDelete: (deploymentId: string) => void
}

export function DeploymentInspector({
  deployment,
  logs,
  isLogsPending,
  isProcessPending,
  isDeletePending,
  isPodReady,
  onGetLogs,
  onProcessAction,
  onRedeploy,
  onDelete,
}: DeploymentInspectorProps) {
  const { deploymentId, repo, branch, commit, process } = deployment
  const service = getDeploymentService(deployment)
  const isOnline = process?.status === "online"

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <h3 className="font-mono text-[.8125rem] leading-5 font-medium break-words">
            {branch}
          </h3>
          <StatusLabel
            tone={getProcessTone(process?.status)}
            className="mt-0.5 text-xs"
          >
            {getProcessLabel(process?.status)}
          </StatusLabel>
        </div>
        {service && (
          <Button size="sm" variant="outline" asChild>
            <a
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${repo} ${branch} deployment`}
            >
              <ExternalLink />
              Open preview
            </a>
          </Button>
        )}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        <div>
          <dt className="mb-0.5 text-xs text-muted-foreground">Commit</dt>
          <dd className="flex h-5 items-center gap-1 font-mono text-[.8125rem] font-medium">
            <span>{commit.slice(0, 7)}</span>
            <CopyButton value={commit} label="Copy commit hash" />
          </dd>
        </div>
        {service && (
          <div>
            <dt className="mb-0.5 text-xs text-muted-foreground">Service</dt>
            <dd className="font-medium">
              {service.name === "web" ? "Website" : "API"} on port{" "}
              {service.port}
            </dd>
          </div>
        )}
        {process && (
          <>
            <div>
              <dt className="mb-0.5 text-xs text-muted-foreground">CPU</dt>
              <dd className="font-medium">{process.cpu}%</dd>
            </div>
            <div>
              <dt className="mb-0.5 text-xs text-muted-foreground">Memory</dt>
              <dd className="font-medium">{formatBytes(process.memory)}</dd>
            </div>
          </>
        )}
      </dl>

      {!isPodReady && (
        <p className="mt-4 text-muted-foreground">
          These actions come back once the machine is ready.
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={isLogsPending || !isPodReady}
          onClick={() => onGetLogs(deploymentId)}
        >
          <FileText />
          {isLogsPending ? "Loading…" : "Logs"}
        </Button>
        {process &&
          (isOnline ? (
            <>
              <Button
                variant="outline"
                size="sm"
                disabled={isProcessPending || !isPodReady}
                onClick={() => onProcessAction("restart", process.name)}
              >
                <RotateCw />
                Restart
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isProcessPending || !isPodReady}
                onClick={() => onProcessAction("stop", process.name)}
              >
                <Square />
                Stop
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled={isProcessPending || !isPodReady}
              onClick={() => onProcessAction("start", process.name)}
            >
              <Play />
              Start
            </Button>
          ))}
        <Button
          variant="outline"
          size="sm"
          disabled={!isPodReady}
          onClick={() => onRedeploy(deployment)}
        >
          <Rocket />
          Deploy again
        </Button>
        <ConfirmDialog
          trigger={
            <Button
              variant="ghost"
              size="sm"
              disabled={isDeletePending || !isPodReady}
              className="sm:ml-auto"
            >
              <Trash2 />
              Delete
            </Button>
          }
          title={`Delete ${branch}?`}
          description="Its preview stops and the URL goes offline. The code stays in the repository."
          actionLabel="Delete deployment"
          onConfirm={() => onDelete(deploymentId)}
        />
      </div>

      {logs && (
        <div className="mt-4">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No logs for this deployment yet.
            </p>
          ) : (
            <pre className="max-h-80 overflow-auto rounded-lg bg-terminal p-3 font-mono text-xs leading-relaxed text-terminal-foreground">
              {logs
                .slice(-MAX_LOG_LINES)
                .map(
                  ({ timestamp, service: origin, level, message }) =>
                    `[${timestamp}] [${origin}] [${level}] ${message}`
                )
                .join("\n")}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
