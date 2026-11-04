import { EmptyState } from "@/components/common/empty-state"
import { ROW_CONTENT, Row, RowList } from "@/components/common/row-list"
import { Section } from "@/components/common/section"
import { Skeleton } from "@/components/ui/skeleton"
import { useProjectDatabases } from "@/features/deployments/hooks/use-project-databases"
import type {
  DatabaseEngine,
  ProjectDatabase,
} from "@/features/deployments/types/deployment.types"
import type { DatabaseConfiguration } from "@/features/projects/types/project.types"
import { DATABASE_LABELS } from "@/features/projects/utils/database-labels"
import { getErrorMessage } from "@/lib/api/api-error"
import { formatBytes } from "@/lib/utils/format-bytes"

type DatabaseSectionProps = {
  projectId: string
  configuration: DatabaseConfiguration
  isPodReady: boolean
}

const getResources = ({
  replicaCount,
  cpuCores,
  ram,
  storage,
}: DatabaseConfiguration) =>
  [
    replicaCount !== undefined &&
      `${replicaCount} ${replicaCount === 1 ? "replica" : "replicas"}`,
    cpuCores !== undefined && `${cpuCores} CPU`,
    ram !== undefined && `${ram} GB RAM`,
    storage !== undefined && `${storage} GB storage`,
  ].filter(Boolean)

const getDatabaseSummary = ({
  empty,
  keyCount,
  expiringKeyCount,
  sizeOnDisk,
}: ProjectDatabase) => {
  if (empty || keyCount === 0) return "Empty"
  if (keyCount !== undefined) {
    const keys = `${keyCount.toLocaleString("en-US")} ${keyCount === 1 ? "key" : "keys"}`
    return expiringKeyCount
      ? `${keys}, ${expiringKeyCount.toLocaleString("en-US")} expiring`
      : keys
  }
  return sizeOnDisk !== undefined ? formatBytes(sizeOnDisk) : undefined
}

function DatabaseSection({
  projectId,
  configuration,
  isPodReady,
}: DatabaseSectionProps) {
  const engine: DatabaseEngine = configuration.type
  const databases = useProjectDatabases(projectId, engine, isPodReady)
  const resources = getResources(configuration)

  return (
    <Section
      title={DATABASE_LABELS[engine]}
      description={
        <>
          {configuration.username && (
            <>Signed in as {configuration.username}. </>
          )}
          {resources.join(", ")}
        </>
      }
    >
      {databases.isError ? (
        <p className="text-sm text-destructive">
          {getErrorMessage(databases.error, "Could not load the databases.")}
        </p>
      ) : !isPodReady ? (
        <p className="text-sm text-muted-foreground">
          The list appears once the machine is ready.
        </p>
      ) : databases.isPending ? (
        <Skeleton className="h-14 w-full rounded-xl" />
      ) : databases.data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No database here yet.</p>
      ) : (
        <RowList>
          {databases.data.map((database) => (
            <Row key={database.name}>
              <div className={ROW_CONTENT}>
                <p className="min-w-0 flex-1 truncate font-medium">
                  {database.name}
                </p>
                <p className="shrink-0 text-sm text-muted-foreground">
                  {getDatabaseSummary(database)}
                </p>
              </div>
            </Row>
          ))}
        </RowList>
      )}
    </Section>
  )
}

type ProjectDatabasesTabProps = {
  projectId: string
  configurations: DatabaseConfiguration[]
  isPodReady: boolean
}

export function ProjectDatabasesTab({
  projectId,
  configurations,
  isPodReady,
}: ProjectDatabasesTabProps) {
  const enabledDatabases = configurations.filter((database) => database.enabled)

  if (enabledDatabases.length === 0) {
    return (
      <EmptyState
        title="No databases on this project"
        description="Databases are chosen when a project is created. Create a new project to add one."
      />
    )
  }

  return (
    <div className="space-y-10">
      {enabledDatabases.map((configuration) => (
        <DatabaseSection
          key={configuration.name}
          projectId={projectId}
          configuration={configuration}
          isPodReady={isPodReady}
        />
      ))}
    </div>
  )
}
