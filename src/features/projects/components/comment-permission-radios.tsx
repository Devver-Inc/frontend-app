import { useId, useRef } from "react"
import type { KeyboardEvent } from "react"
import { Label } from "@/components/ui/label"
import type { OverlayCommentPermission } from "@/features/projects/types/project.types"
import { cn } from "@/lib/utils/cn"

type CommentPermissionRadiosProps = {
  // Undefined on projects created before the overlay access control.
  value: OverlayCommentPermission | undefined
  onChange: (value: OverlayCommentPermission) => void
  groupClassName?: string
}

const ARROW_KEYS = new Set(["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"])

const optionClassName = (isSelected: boolean) =>
  cn(
    "w-full rounded-lg border px-3 py-2.5 text-left transition",
    isSelected
      ? "border-primary/50 bg-primary/10"
      : "border-border/60 hover:bg-accent/40"
  )

export function CommentPermissionRadios({
  value,
  onChange,
  groupClassName,
}: CommentPermissionRadiosProps) {
  const id = useId()
  const labelId = `${id}-comment-permission-label`
  const teamTitleId = `${id}-comment-team-title`
  const teamDescriptionId = `${id}-comment-team-desc`
  const emailTitleId = `${id}-comment-email-title`
  const emailDescriptionId = `${id}-comment-email-desc`

  const teamRef = useRef<HTMLButtonElement>(null)
  const emailRef = useRef<HTMLButtonElement>(null)

  // Radio group keyboard pattern: arrows move the selection and the focus.
  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    current: OverlayCommentPermission
  ) => {
    if (!ARROW_KEYS.has(event.key)) return
    event.preventDefault()
    const next = current === "team_only" ? "email_required" : "team_only"
    onChange(next)
    queueMicrotask(() =>
      (next === "team_only" ? teamRef : emailRef).current?.focus()
    )
  }

  return (
    <div className="space-y-3">
      <Label id={labelId}>Comment permission</Label>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className={cn("space-y-2", groupClassName)}
      >
        <button
          ref={teamRef}
          type="button"
          role="radio"
          aria-checked={value === "team_only"}
          aria-labelledby={`${teamTitleId} ${teamDescriptionId}`}
          tabIndex={value === "team_only" ? 0 : -1}
          onClick={() => onChange("team_only")}
          onKeyDown={(event) => onKeyDown(event, "team_only")}
          className={optionClassName(value === "team_only")}
        >
          <p id={teamTitleId} className="text-sm font-medium">
            Team only
          </p>
          <p id={teamDescriptionId} className="text-xs text-muted-foreground">
            Only project team members can read and post comments.
          </p>
        </button>

        <button
          ref={emailRef}
          type="button"
          role="radio"
          aria-checked={value === "email_required"}
          aria-labelledby={`${emailTitleId} ${emailDescriptionId}`}
          tabIndex={value === "email_required" ? 0 : -1}
          onClick={() => onChange("email_required")}
          onKeyDown={(event) => onKeyDown(event, "email_required")}
          className={optionClassName(value === "email_required")}
        >
          <p id={emailTitleId} className="text-sm font-medium">
            Email required
          </p>
          <p id={emailDescriptionId} className="text-xs text-muted-foreground">
            Guests can comment with an email; members/admins can comment
            directly.
          </p>
        </button>
      </div>
    </div>
  )
}
