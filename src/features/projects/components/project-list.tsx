import { useNavigate } from "@tanstack/react-router"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectCard } from "@/features/projects/components/project-card"
import type { ProjectSummary } from "@/features/projects/types/project.types"

const SKELETON_CARDS = ["p-1", "p-2", "p-3"]

type ProjectListProps = {
  projects: ProjectSummary[]
  isLoading: boolean
}

export function ProjectList({ projects, isLoading }: ProjectListProps) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SKELETON_CARDS.map((key) => (
          <Skeleton key={key} className="h-64 w-full rounded-2xl" />
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="page-shell py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No projects yet. Create your first project to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={() =>
            void navigate({
              to: "/projects/$projectId",
              params: { projectId: project.id },
            })
          }
        />
      ))}
    </div>
  )
}
