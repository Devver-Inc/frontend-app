import { FolderOpen, Rocket, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

type StatsCardsProps = {
  totalDeployments: number
  activeProjects: number
  teamMembers: number
}

export function StatsCards({
  totalDeployments,
  activeProjects,
  teamMembers,
}: StatsCardsProps) {
  const stats = [
    { label: "Total Deployments", value: totalDeployments, icon: Rocket },
    { label: "Active Projects", value: activeProjects, icon: FolderOpen },
    { label: "Team Members", value: teamMembers, icon: Users },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map(({ label, value, icon: Icon }) => (
        <Card key={label} className="border-border/50">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
