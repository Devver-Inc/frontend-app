import { useId, useRef, type KeyboardEvent } from 'react'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { OverlayCommentPermission } from '@/lib/api/projects'

export type CommentPermissionRadiosProps = Readonly<{
  value: OverlayCommentPermission
  onChange: (value: OverlayCommentPermission) => void
  /** Merged onto the radiogroup container (e.g. bordered panel in a dialog). */
  groupClassName?: string
}>

function optionButtonClassName(selected: boolean) {
  return cn(
    'w-full rounded-lg border px-3 py-2.5 text-left transition',
    selected
      ? 'border-primary/50 bg-primary/10'
      : 'border-border/60 hover:bg-accent/40',
  )
}

export function CommentPermissionRadios({
  value,
  onChange,
  groupClassName,
}: CommentPermissionRadiosProps) {
  const reactId = useId()
  const labelId = `${reactId}-comment-permission-label`
  const teamTitleId = `${reactId}-comment-team-title`
  const teamDescId = `${reactId}-comment-team-desc`
  const emailTitleId = `${reactId}-comment-email-title`
  const emailDescId = `${reactId}-comment-email-desc`

  const teamRef = useRef<HTMLButtonElement>(null)
  const emailRef = useRef<HTMLButtonElement>(null)

  const focusOption = (next: OverlayCommentPermission) => {
    onChange(next)
    queueMicrotask(() => {
      if (next === 'team_only') {
        teamRef.current?.focus()
      } else {
        emailRef.current?.focus()
      }
    })
  }

  const handleKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    current: OverlayCommentPermission,
  ) => {
    if (
      e.key !== 'ArrowDown' &&
      e.key !== 'ArrowUp' &&
      e.key !== 'ArrowLeft' &&
      e.key !== 'ArrowRight'
    ) {
      return
    }
    e.preventDefault()
    const next: OverlayCommentPermission =
      current === 'team_only' ? 'email_required' : 'team_only'
    focusOption(next)
  }

  return (
    <div className="space-y-3">
      <Label id={labelId}>Comment permission</Label>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className={cn('space-y-2', groupClassName)}
      >
        <button
          ref={teamRef}
          type="button"
          role="radio"
          aria-checked={value === 'team_only'}
          aria-labelledby={`${teamTitleId} ${teamDescId}`}
          tabIndex={value === 'team_only' ? 0 : -1}
          onClick={() => onChange('team_only')}
          onKeyDown={(e) => handleKeyDown(e, 'team_only')}
          className={optionButtonClassName(value === 'team_only')}
        >
          <p id={teamTitleId} className="text-sm font-medium">
            Team only
          </p>
          <p id={teamDescId} className="text-xs text-muted-foreground">
            Only project team members can read and post comments.
          </p>
        </button>

        <button
          ref={emailRef}
          type="button"
          role="radio"
          aria-checked={value === 'email_required'}
          aria-labelledby={`${emailTitleId} ${emailDescId}`}
          tabIndex={value === 'email_required' ? 0 : -1}
          onClick={() => onChange('email_required')}
          onKeyDown={(e) => handleKeyDown(e, 'email_required')}
          className={optionButtonClassName(value === 'email_required')}
        >
          <p id={emailTitleId} className="text-sm font-medium">
            Email required
          </p>
          <p id={emailDescId} className="text-xs text-muted-foreground">
            Guests can comment with an email; members/admins can comment
            directly.
          </p>
        </button>
      </div>
    </div>
  )
}
