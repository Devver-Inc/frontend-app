import { X } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddProjectMembersDialog } from "@/features/projects/components/add-project-members-dialog"
import { useRemoveProjectMember } from "@/features/projects/hooks/use-remove-project-member"
import type { Project } from "@/features/projects/types/project.types"

export function ProjectTeamCard({ project }: { project: Project }) {
  const removeProjectMember = useRemoveProjectMember(project.id)

  const onRemove = (userId: string) =>
    removeProjectMember.mutate(userId, {
      onSuccess: () => toast.success("Member removed from project."),
    })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Team Members</CardTitle>
        <AddProjectMembersDialog project={project} />
      </CardHeader>
      <CardContent>
        {project.teamMembers.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            No project members yet.
          </p>
        ) : (
          <div className="space-y-2">
            {project.teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatarUrl ?? undefined} />
                    <AvatarFallback>
                      {member.name?.charAt(0).toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium">
                    {member.name ?? "Unnamed User"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onRemove(member.id)}
                  disabled={removeProjectMember.isPending}
                  className="text-muted-foreground hover:text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
