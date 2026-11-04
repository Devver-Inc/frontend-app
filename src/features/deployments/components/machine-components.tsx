import { ROW_CONTENT, Row, RowList } from "@/components/common/row-list"
import { Section } from "@/components/common/section"
import { StatusLabel } from "@/components/common/status"
import type { ArgoCdApplication } from "@/features/deployments/types/deployment.types"
import { getApplicationHealth } from "@/features/deployments/utils/deployment-status"
import { DATABASE_LABELS } from "@/features/projects/utils/database-labels"
import { capitalize } from "@/lib/utils/capitalize"

const getComponentName = ({ type }: ArgoCdApplication): string =>
  (DATABASE_LABELS as Record<string, string | undefined>)[type] ??
  capitalize(type)

function MachineComponent({ application }: { application: ArgoCdApplication }) {
  const health = getApplicationHealth(application)
  // An unknown state carries a raw error from the status check.
  const showMessage = health.tone === "busy" || health.tone === "danger"

  return (
    <Row>
      <div className={ROW_CONTENT}>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">
            {getComponentName(application)}
          </p>
          {showMessage && application.operationMessage && (
            <p className="text-sm text-muted-foreground">
              {application.operationMessage}
            </p>
          )}
        </div>
        <StatusLabel tone={health.tone} className="shrink-0 text-sm">
          {health.label}
        </StatusLabel>
      </div>
    </Row>
  )
}

export function MachineComponents({
  applications,
}: {
  applications: ArgoCdApplication[]
}) {
  // With a single component, the project status already says it all.
  if (applications.length < 2) return null

  return (
    <Section title="Machine">
      <RowList>
        {applications.map((application) => (
          <MachineComponent
            key={application.appName}
            application={application}
          />
        ))}
      </RowList>
    </Section>
  )
}
