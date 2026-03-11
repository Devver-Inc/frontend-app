import { FolderOpen, Rocket, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

type StatsCardsProps = Readonly<{
  totalDeployments: number
  activeProjects: number
  teamMembers: number
}>

const stats = [
  { key: 'deployments', icon: Rocket, label: 'Total Deployments' },
  { key: 'projects', icon: FolderOpen, label: 'Active Projects' },
  { key: 'members', icon: Users, label: 'Team Members' },
] as const

export function StatsCards({
  totalDeployments,
  activeProjects,
  teamMembers,
}: StatsCardsProps) {
  const values = {
    deployments: totalDeployments,
    projects: activeProjects,
    members: teamMembers,
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.key} className="border-border/50">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{values[stat.key]}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
