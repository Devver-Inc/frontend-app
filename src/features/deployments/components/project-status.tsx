import { StatusLabel } from "@/components/common/status"
import type { ArgoCdStatus } from "@/features/deployments/types/deployment.types"
import { getProjectHealth } from "@/features/deployments/utils/deployment-status"
import { formatDateTime } from "@/lib/utils/format-date"

type ProjectStatusProps = {
  status: ArgoCdStatus | null
  isConnected: boolean
}

export function ProjectStatus({ status, isConnected }: ProjectStatusProps) {
  const health = getProjectHealth(status)
  const detail =
    status && !isConnected
      ? "Status may be out of date, reconnecting."
      : (status?.operationMessage ?? health.description)

  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
      <StatusLabel tone={health.tone}>{health.label}</StatusLabel>
      <span className="text-sm text-muted-foreground">{detail}</span>
      {/* The stream only sends changes, so this is not a live "checked" time. */}
      {status && (
        <time
          dateTime={status.timestamp}
          className="text-sm text-muted-foreground"
        >
          Last update {formatDateTime(status.timestamp)}
        </time>
      )}
    </span>
  )
}
