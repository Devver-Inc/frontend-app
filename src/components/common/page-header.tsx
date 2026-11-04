import type { ReactNode } from "react"

type PageHeaderProps = {
  title: string
  description?: ReactNode
  leading?: ReactNode
  actions?: ReactNode
}

export function PageHeader({
  title,
  description,
  leading,
  actions,
}: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4 pb-6">
      <div className="flex min-w-0 items-center gap-3">
        {leading}
        <div className="min-w-0">
          <h1 className="truncate text-title">{title}</h1>
          {description && (
            <div className="mt-0.5 text-muted-foreground">{description}</div>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}
