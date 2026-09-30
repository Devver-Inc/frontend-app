import { Card, CardContent } from "@/components/ui/card"
import type { ProjectSummary } from "@/features/projects/types/project.types"
import { formatRelativeDate } from "@/lib/utils/format-date"

// Stable per project: the same name always gets the same colors.
const hashColor = (value: string): string => {
  let hash = 0
  for (let index = 0; index < value.length; index++) {
    hash = (value.codePointAt(index) ?? 0) + ((hash << 5) - hash)
  }
  return `hsl(${Math.abs(hash) % 360}, 50%, 30%)`
}

type ProjectCardProps = {
  project: ProjectSummary
  onClick: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const primaryColor = hashColor(project.name)
  const secondaryColor = hashColor(project.name + project.id)

  return (
    <Card
      className="cursor-pointer overflow-hidden border-border/50 transition-all hover:border-border hover:shadow-lg"
      onClick={onClick}
    >
      <div
        className="h-32 w-full"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
        }}
      />
      <CardContent className="space-y-2 p-4">
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold text-white"
            style={{ backgroundColor: primaryColor }}
          >
            {project.name.charAt(0).toUpperCase()}
          </div>
          <h3 className="truncate text-sm font-semibold">{project.name}</h3>
        </div>
        {project.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {project.description}
          </p>
        )}
        <p className="text-xs text-muted-foreground/60">
          Created {formatRelativeDate(project.createdAt)}
        </p>
      </CardContent>
    </Card>
  )
}
