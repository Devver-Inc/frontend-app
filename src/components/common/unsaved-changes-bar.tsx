import type { ReactNode } from "react"

type UnsavedChangesBarProps = {
  title: string
  description: string
  children: ReactNode
}

export function UnsavedChangesBar({
  title,
  description,
  children,
}: UnsavedChangesBarProps) {
  return (
    <div className="glass-surface-strong flex items-center justify-between rounded-lg border border-border/50 px-4 py-3">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  )
}
