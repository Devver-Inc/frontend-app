import type { ReactNode } from "react"
import { cn } from "@/lib/utils/cn"

type SectionProps = {
  title: string
  description?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function Section({
  title,
  description,
  action,
  children,
  className,
}: SectionProps) {
  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div className="min-w-0">
          <h2 className="text-heading">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

// A setting reads as a sentence: what it is on the left, its value on the right.
export function SettingsRow({
  title,
  description,
  children,
  className,
}: Omit<SectionProps, "action">) {
  return (
    <section
      className={cn(
        "grid gap-x-10 gap-y-4 py-6 not-first:border-t first:pt-0 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]",
        className
      )}
    >
      <div>
        <h2 className="font-medium">{title}</h2>
        {description && (
          <p className="mt-0.5 text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  )
}
