import type { GetProjectLightDto } from '@/lib/api/projects'
import { Card, CardContent } from '@/components/ui/card'

function hashColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (str.codePointAt(i) ?? 0) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 50%, 30%)`
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = Date.now()
  const diffMs = now - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60_000)
  const diffHours = Math.floor(diffMs / 3_600_000)
  const diffDays = Math.floor(diffMs / 86_400_000)

  if (diffMinutes < 1) return 'just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

type ProjectCardProps = Readonly<{
  project: GetProjectLightDto
  onClick?: () => void
}>

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const color1 = hashColor(project.name)
  const color2 = hashColor(project.name + project.id)

  return (
    <Card
      className="cursor-pointer overflow-hidden border-border/50 transition-all hover:border-border hover:shadow-lg"
      onClick={onClick}
    >
      <div
        className="h-32 w-full"
        style={{
          background: `linear-gradient(135deg, ${color1}, ${color2})`,
        }}
      />
      <CardContent className="space-y-2 p-4">
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold text-white"
            style={{ backgroundColor: color1 }}
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
