import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type PageHeaderProps = Readonly<{
  title: string
  description: string
  icon: LucideIcon
  rightSlot?: ReactNode
}>

export function PageHeader({
  title,
  description,
  icon: Icon,
  rightSlot,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 pb-1">
      <div className="flex items-center gap-3">
        <div className="page-header-icon">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground/90">{description}</p>
        </div>
      </div>
      {rightSlot}
    </div>
  )
}
