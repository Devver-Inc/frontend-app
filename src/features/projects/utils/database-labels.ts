import type { DatabaseType } from "@/features/projects/types/project.types"

export const DATABASE_LABELS: Record<DatabaseType, string> = {
  mongo: "MongoDB",
  postgres: "PostgreSQL",
  redis: "Redis",
}
