import type { ReactNode } from "react"
import { cn } from "@/lib/utils/cn"

export type StatusTone = "live" | "busy" | "danger" | "idle"

const DOT_TONES: Record<StatusTone, string> = {
  live: "bg-live",
  busy: "bg-busy",
  danger: "bg-danger",
  idle: "bg-idle",
}

const TEXT_TONES: Record<StatusTone, string> = {
  live: "text-live",
  busy: "text-busy",
  danger: "text-danger",
  idle: "text-muted-foreground",
}

export function StatusDot({
  tone,
  className,
}: {
  tone: StatusTone
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-1.5 shrink-0 rounded-full",
        DOT_TONES[tone],
        className
      )}
    />
  )
}

type StatusLabelProps = {
  tone: StatusTone
  children: ReactNode
  className?: string
}

export function StatusLabel({ tone, children, className }: StatusLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium",
        TEXT_TONES[tone],
        className
      )}
    >
      <StatusDot tone={tone} />
      {children}
    </span>
  )
}
