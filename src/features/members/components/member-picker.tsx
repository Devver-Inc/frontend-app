import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/features/users/types/user.types"
import { cn } from "@/lib/utils/cn"

type MemberPickerProps = {
  members: User[]
  selectedIds: string[]
  onChange: (selectedIds: string[]) => void
  emptyMessage: string
  className: string
}

export function MemberPicker({
  members,
  selectedIds,
  onChange,
  emptyMessage,
  className,
}: MemberPickerProps) {
  if (members.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>
  }

  const toggle = (memberId: string) =>
    onChange(
      selectedIds.includes(memberId)
        ? selectedIds.filter((id) => id !== memberId)
        : [...selectedIds, memberId]
    )

  return (
    <div className={className}>
      {members.map((member) => {
        const isSelected = selectedIds.includes(member.id)
        return (
          <button
            key={member.id}
            type="button"
            onClick={() => toggle(member.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition",
              isSelected
                ? "border-primary/50 bg-primary/10"
                : "border-border/60 hover:bg-accent/40"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={member.avatarUrl ?? undefined} />
              <AvatarFallback>
                {member.name?.charAt(0).toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {member.name ?? "Unnamed User"}
              </p>
              <p className="text-xs text-muted-foreground">{member.id}</p>
            </div>
            {isSelected && <Badge>Selected</Badge>}
          </button>
        )
      })}
    </div>
  )
}
