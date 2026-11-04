import { projectDatabaseListSchema } from "@/features/deployments/schemas/deployment.schema"
import type { DatabaseEngine } from "@/features/deployments/types/deployment.types"
import { api } from "@/lib/api/client"

export const getProjectDatabases = (
  organizationId: string,
  projectId: string,
  engine: DatabaseEngine,
  signal?: AbortSignal
) =>
  api.get(
    `/projects/${encodeURIComponent(projectId)}/databases/${encodeURIComponent(engine)}`,
    { schema: projectDatabaseListSchema, organizationId, signal }
  )
