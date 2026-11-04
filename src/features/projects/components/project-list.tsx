import { Link } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import { EmptyState } from "@/components/common/empty-state"
import { Monogram } from "@/components/common/monogram"
import { ROW_LINK, Row, RowList } from "@/components/common/row-list"
import { Skeleton } from "@/components/ui/skeleton"
import { formatRelativeDate } from "@/lib/utils/format-date"
import type { ProjectSummary } from "@/features/projects/types/project.types"

const SKELETON_ROWS = ["p-1", "p-2", "p-3", "p-4"]

type ProjectRowsProps = {
  projects: ProjectSummary[]
}

export function ProjectRows({ projects }: ProjectRowsProps) {
  return (
    <RowList>
      {projects.map((project) => (
        <Row key={project.id}>
          <Link
            to="/projects/$projectId"
            params={{ projectId: project.id }}
            className={ROW_LINK}
          >
            <Monogram name={project.name} />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{project.name}</span>
              {project.description && (
                <span className="block truncate text-sm text-muted-foreground">
                  {project.description}
                </span>
              )}
            </span>
            <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
              Created {formatRelativeDate(project.createdAt)}
            </span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </Link>
        </Row>
      ))}
    </RowList>
  )
}

type ProjectListProps = {
  projects: ProjectSummary[]
  isLoading: boolean
  isSearching: boolean
}

export function ProjectList({
  projects,
  isLoading,
  isSearching,
}: ProjectListProps) {
  if (isLoading) {
    return (
      <div className="space-y-px">
        {SKELETON_ROWS.map((key) => (
          <Skeleton key={key} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return isSearching ? (
      <p className="py-6 text-sm text-muted-foreground">
        No project matches this search.
      </p>
    ) : (
      <EmptyState
        title="No projects yet"
        description="A project gives your team a machine, its repositories, and a preview for every branch."
      />
    )
  }

  return <ProjectRows projects={projects} />
}
