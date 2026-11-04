import { X } from "lucide-react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { EmptyState } from "@/components/common/empty-state"
import { ROW_CONTENT, Row, RowList } from "@/components/common/row-list"
import { Section } from "@/components/common/section"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { AddProjectMembersDialog } from "@/features/projects/components/add-project-members-dialog"
import { useRemoveProjectMember } from "@/features/projects/hooks/use-remove-project-member"
import type { Project } from "@/features/projects/types/project.types"
import { getInitials } from "@/lib/utils/get-initials"

export function ProjectTeamTab({ project }: { project: Project }) {
  const removeProjectMember = useRemoveProjectMember(project.id)

  const onRemove = (userId: string) =>
    removeProjectMember.mutate(userId, {
      onSuccess: () => toast.success("Member removed."),
    })

  return (
    <Section
      title="Team"
      description="Members can open this project, deploy, and comment."
      action={<AddProjectMembersDialog project={project} />}
    >
      {project.teamMembers.length === 0 ? (
        <EmptyState
          title="Nobody on this project yet"
          description="Add members of your organization so they can deploy here."
        />
      ) : (
        <RowList>
          {project.teamMembers.map((member) => {
            const name = member.name ?? member.email ?? "Unnamed member"
            return (
              <Row key={member.id}>
                <div className={ROW_CONTENT}>
                  <Avatar>
                    <AvatarImage
                      src={member.avatarUrl ?? undefined}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xs font-medium">
                      {getInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{name}</p>
                    {member.name && member.email && (
                      <p className="truncate text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    )}
                  </div>
                  <ConfirmDialog
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove ${name} from the project`}
                        disabled={removeProjectMember.isPending}
                      >
                        <X />
                      </Button>
                    }
                    title={`Remove ${name}?`}
                    description="They lose access to this project. They stay in the organization."
                    actionLabel="Remove member"
                    onConfirm={() => onRemove(member.id)}
                  />
                </div>
              </Row>
            )
          })}
        </RowList>
      )}
    </Section>
  )
}
