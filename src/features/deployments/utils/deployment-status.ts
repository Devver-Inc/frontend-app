import type { StatusTone } from "@/components/common/status"
import type {
  ArgoCdApplication,
  ArgoCdStatus,
  Deployment,
} from "@/features/deployments/types/deployment.types"

type ProjectHealth = {
  label: string
  description: string
  tone: StatusTone
}

export const getProjectHealth = (
  status: ArgoCdStatus | null
): ProjectHealth => {
  if (!status) {
    return {
      label: "Connecting",
      description: "Waiting for the first status from the machine.",
      tone: "idle",
    }
  }

  const { healthStatus, syncStatus, podReady } = status
  if (healthStatus === "Missing" && syncStatus === "OutOfSync") {
    return {
      label: "Machine missing",
      description: "It doesn't match its configuration and isn't running.",
      tone: "danger",
    }
  }
  if (healthStatus === "Progressing" && syncStatus === "Synced") {
    return {
      label: "Starting",
      description: "The machine is starting.",
      tone: "busy",
    }
  }
  if (healthStatus === "Healthy" && syncStatus === "Synced") {
    return podReady
      ? {
          label: "Running",
          description: "Ready to deploy.",
          tone: "live",
        }
      : {
          label: "Warming up",
          description: "You can deploy as soon as the machine is ready.",
          tone: "busy",
        }
  }
  return {
    label: "Unknown state",
    description: `Health is ${healthStatus}, sync is ${syncStatus}.`,
    tone: "idle",
  }
}

export const getApplicationHealth = ({
  healthStatus,
  syncStatus,
}: ArgoCdApplication): Pick<ProjectHealth, "label" | "tone"> => {
  if (healthStatus === "Missing") return { label: "Missing", tone: "danger" }
  if (healthStatus === "Degraded") return { label: "Failing", tone: "danger" }
  if (healthStatus === "Progressing") {
    return { label: "Starting", tone: "busy" }
  }
  if (healthStatus === "Healthy" && syncStatus === "Synced") {
    return { label: "Running", tone: "live" }
  }
  if (syncStatus === "OutOfSync") {
    return { label: "Out of sync", tone: "busy" }
  }
  return { label: "Unknown state", tone: "idle" }
}

const TRANSIENT_STATUSES = new Set([
  "launching",
  "stopping",
  "waiting restart",
  "one-launch-status",
])

export const getProcessTone = (status: string | undefined): StatusTone => {
  if (status === "online") return "live"
  if (status === "errored") return "danger"
  if (status && TRANSIENT_STATUSES.has(status)) return "busy"
  return "idle"
}

// PM2 reports its states in lowercase, one of them as a compound word.
export const getProcessLabel = (status: string | undefined): string => {
  if (!status) return "No process"
  if (status === "one-launch-status") return "Launching"
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export const getDeploymentService = ({ service }: Deployment) => {
  if (service.web) return { name: "web" as const, ...service.web }
  if (service.api) return { name: "api" as const, ...service.api }
  return null
}
