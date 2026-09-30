import {
  CircleAlert,
  LoaderCircle,
  ShieldCheck,
  TerminalSquare,
  Wifi,
  WifiOff,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { ArgoCdStatus } from "@/features/deployments/types/deployment.types"
import { cn } from "@/lib/utils/cn"
import { formatDateTime } from "@/lib/utils/format-date"

type Tone = "critical" | "progress" | "healthy" | "neutral"

type DeploymentState = {
  label: string
  description: string
  tone: Tone
}

const TONE_CLASS_NAMES: Record<Tone, string> = {
  critical: "border-red-500/40 bg-red-500/10",
  progress: "border-amber-500/40 bg-amber-500/10",
  healthy: "border-emerald-500/40 bg-emerald-500/10",
  neutral: "border-border/60 bg-background/40",
}

const getDeploymentState = (status: ArgoCdStatus | null): DeploymentState => {
  if (!status) {
    return {
      label: "No status yet",
      description: "Waiting for ArgoCD status stream...",
      tone: "neutral",
    }
  }

  const { healthStatus, syncStatus, podReady } = status
  if (healthStatus === "Missing" && syncStatus === "OutOfSync") {
    return {
      label: "Deployment issue",
      description: "Missing + OutOfSync",
      tone: "critical",
    }
  }
  if (healthStatus === "Progressing" && syncStatus === "Synced") {
    return {
      label: "Stabilizing",
      description: "Progressing + Synced",
      tone: "progress",
    }
  }
  if (healthStatus === "Healthy" && syncStatus === "Synced") {
    return podReady
      ? {
          label: "Operational",
          description: "Healthy + Synced, pod ready",
          tone: "healthy",
        }
      : {
          label: "Pod warming up",
          description: "Healthy + Synced, pod not ready",
          tone: "progress",
        }
  }
  return {
    label: "Unknown state",
    description: `${healthStatus} + ${syncStatus}`,
    tone: "neutral",
  }
}

function ToneIcon({ tone }: { tone: Tone }) {
  if (tone === "critical")
    return <CircleAlert className="h-4 w-4 text-red-500" />
  if (tone === "progress") {
    return <LoaderCircle className="h-4 w-4 animate-spin text-amber-500" />
  }
  if (tone === "healthy") {
    return <ShieldCheck className="h-4 w-4 text-emerald-500" />
  }
  return <TerminalSquare className="h-4 w-4 text-muted-foreground" />
}

type ArgoCdStatusBannerProps = {
  status: ArgoCdStatus | null
  isConnected: boolean
  lastEventAt: string | null
}

export function ArgoCdStatusBanner({
  status,
  isConnected,
  lastEventAt,
}: ArgoCdStatusBannerProps) {
  const state = getDeploymentState(status)
  const updatedAt = lastEventAt ?? status?.timestamp

  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3",
        TONE_CLASS_NAMES[state.tone]
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ToneIcon tone={state.tone} />
          <p className="text-sm font-semibold">{state.label}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? (
              <span className="inline-flex items-center gap-1">
                <Wifi className="h-3.5 w-3.5" />
                Live stream
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <WifiOff className="h-3.5 w-3.5" />
                Stream disconnected
              </span>
            )}
          </Badge>
          <Badge variant="outline">{state.description}</Badge>
        </div>
      </div>
      {status && (
        <div className="mt-3 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
          <p className="truncate">
            App: <span className="font-medium">{status.appName}</span>
          </p>
          <p>
            Operation: {status.operationPhase ?? "N/A"}
            {status.operationMessage && ` - ${status.operationMessage}`}
          </p>
          <p>Updated: {updatedAt ? formatDateTime(updatedAt) : "N/A"}</p>
          <p>
            Health / Sync:{" "}
            <span className="font-medium">
              {status.healthStatus} / {status.syncStatus}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
