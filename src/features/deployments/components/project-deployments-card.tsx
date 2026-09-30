import { TerminalSquare } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeploymentCard } from "@/features/deployments/components/deployment-card"
import { useDeploymentLogs } from "@/features/deployments/hooks/use-deployment-logs"
import { useProjectDeployments } from "@/features/deployments/hooks/use-project-deployments"

type ProjectDeploymentsCardProps = {
  projectId: string
  isPodReady: boolean
}

export function ProjectDeploymentsCard({
  projectId,
  isPodReady,
}: ProjectDeploymentsCardProps) {
  const { data = [] } = useProjectDeployments(projectId, isPodReady)
  const deploymentLogs = useDeploymentLogs(projectId)
  const [logsDeploymentId, setLogsDeploymentId] = useState<string | null>(null)
  const deployments = isPodReady ? data : []

  const onGetLogs = (deploymentId: string) => {
    setLogsDeploymentId(deploymentId)
    deploymentLogs.mutate(deploymentId)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <TerminalSquare className="h-4 w-4" />
          Deployments
        </CardTitle>
        {deployments.length > 0 && (
          <Badge variant="secondary">
            {deployments.length}{" "}
            {deployments.length === 1 ? "deployment" : "deployments"}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          {!isPodReady && (
            <p className="text-sm text-muted-foreground">
              Waiting for the project pod to become{" "}
              <span className="font-medium">ready</span>.
            </p>
          )}

          {isPodReady && deployments.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No deployments for this project yet.
            </p>
          )}

          {deployments.map((deployment) => {
            const isSelectedForLogs =
              logsDeploymentId === deployment.deploymentId
            return (
              <DeploymentCard
                key={deployment.deploymentId}
                deployment={deployment}
                isSelectedForLogs={isSelectedForLogs}
                isLogsPending={deploymentLogs.isPending}
                logs={isSelectedForLogs ? deploymentLogs.data : undefined}
                onGetLogs={onGetLogs}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
