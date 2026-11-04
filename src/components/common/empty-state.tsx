import type { ReactNode } from "react"
import { cn } from "@/lib/utils/cn"

type EmptyStateProps = {
  title: string
  description: ReactNode
  action?: ReactNode
  className?: string
}

// A line that is planned but not built yet: a hollow station, then dashes.
export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex gap-4 py-2", className)}>
      <div aria-hidden className="flex w-3 shrink-0 flex-col items-center">
        <span className="mt-1.5 size-3 shrink-0 rounded-full border-2 border-idle bg-background" />
        <span className="mt-1 w-0.5 flex-1 bg-[repeating-linear-gradient(to_bottom,var(--idle)_0_.25rem,transparent_.25rem_.5rem)] mask-b-from-20%" />
      </div>
      <div className="min-w-0 pb-4">
        <p className="text-heading">{title}</p>
        <div className="mt-1 max-w-prose text-sm text-muted-foreground">
          {description}
        </div>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  )
}
