import type { ReactNode } from "react"
import { Section } from "@/components/common/section"
import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog"

type StepProps = {
  title: string
  description: string
  isCurrent?: boolean
  children?: ReactNode
}

function Step({ title, description, isCurrent = false, children }: StepProps) {
  return (
    <li
      className="station"
      data-phase={isCurrent ? "active" : undefined}
      aria-current={isCurrent ? "step" : undefined}
    >
      <div className="station-stop">
        <span className="station-dot" />
        <span className="min-w-0">
          <span className={isCurrent ? "font-medium" : "text-muted-foreground"}>
            {title}
          </span>
          <span className="mt-0.5 block text-sm text-muted-foreground">
            {description}
          </span>
          {children && <span className="mt-3 block">{children}</span>}
        </span>
      </div>
    </li>
  )
}

export function GettingStarted() {
  return (
    <Section title="From code to preview">
      <ol className="stations" data-layout="route">
        <Step
          title="Create a project"
          description="It gets its own machine, repositories, and previews."
          isCurrent
        >
          <CreateProjectDialog />
        </Step>
        <Step
          title="Push your code"
          description="Add a repository, then push to it with git."
        />
        <Step
          title="Deploy a branch"
          description="Each branch gets its own preview URL."
        />
      </ol>
    </Section>
  )
}
