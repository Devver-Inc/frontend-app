import { Check } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/features/users/types/user.types"
import { cn } from "@/lib/utils/cn"
import { getInitials } from "@/lib/utils/get-initials"

type MemberPickerProps = {
  members: User[]
  selectedIds: string[]
  onChange: (selectedIds: string[]) => void
  emptyMessage: string
  className?: string
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
    <div className={cn("space-y-1", className)}>
      {members.map((member) => {
        const isSelected = selectedIds.includes(member.id)
        const name = member.name ?? member.email ?? "Unnamed member"
        return (
          <button
            key={member.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => toggle(member.id)}
            className={cn(
              "flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors duration-100 outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isSelected ? "bg-accent" : "hover:bg-accent"
            )}
          >
            <Avatar className="size-8">
              <AvatarImage
                src={member.avatarUrl ?? undefined}
                className="object-cover"
              />
              <AvatarFallback className="text-xs font-medium">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{name}</span>
              {member.name && member.email && (
                <span className="block truncate text-xs text-muted-foreground">
                  {member.email}
                </span>
              )}
            </span>
            {isSelected && <Check className="size-4 shrink-0 text-primary" />}
          </button>
        )
      })}
    </div>
  )
}
