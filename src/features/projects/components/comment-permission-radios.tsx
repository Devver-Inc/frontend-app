import { useId, useRef } from "react"
import type { KeyboardEvent } from "react"
import type { OverlayCommentPermission } from "@/features/projects/types/project.types"
import { cn } from "@/lib/utils/cn"

type CommentPermissionRadiosProps = {
  // Undefined on projects created before the overlay access control.
  value: OverlayCommentPermission | undefined
  onChange: (value: OverlayCommentPermission) => void
}

const ARROW_KEYS = new Set(["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"])

const optionClassName = (isSelected: boolean) =>
  cn(
    "block w-full cursor-pointer rounded-lg px-3.5 py-3 text-left transition-[box-shadow,background-color] duration-100 outline-none focus-visible:ring-3 focus-visible:ring-ring/25",
    isSelected
      ? "bg-card shadow-[inset_0_0_0_1.5px_var(--primary)]"
      : "bg-card shadow-[inset_0_0_0_1px_var(--input)] hover:bg-accent"
  )

export function CommentPermissionRadios({
  value,
  onChange,
}: CommentPermissionRadiosProps) {
  const id = useId()
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
    <div role="radiogroup" aria-label="Who can comment" className="space-y-2">
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
        <span id={teamTitleId} className="block text-sm font-medium">
          Team only
        </span>
        <span
          id={teamDescriptionId}
          className="block text-xs text-muted-foreground"
        >
          Only members of this project can read and post comments.
        </span>
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
        <span id={emailTitleId} className="block text-sm font-medium">
          Guests with an email
        </span>
        <span
          id={emailDescriptionId}
          className="block text-xs text-muted-foreground"
        >
          Guests leave their email to comment. Members comment directly.
        </span>
      </button>
    </div>
  )
}
