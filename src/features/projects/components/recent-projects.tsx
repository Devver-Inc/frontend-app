import { Link } from "@tanstack/react-router"
import { Section } from "@/components/common/section"
import { Button } from "@/components/ui/button"
import { GettingStarted } from "@/features/projects/components/getting-started"
import { ProjectList } from "@/features/projects/components/project-list"
import { useRecentProjects } from "@/features/projects/hooks/use-projects"

export function RecentProjects() {
  const { data, isLoading } = useRecentProjects()
  const projects = data?.data ?? []

  if (!isLoading && projects.length === 0) return <GettingStarted />

  return (
    <Section
      title="Recent projects"
      action={
        <Button variant="ghost" size="sm" className="-mr-2.5" asChild>
          <Link to="/projects">All projects</Link>
        </Button>
      }
    >
      <ProjectList
        projects={projects}
        isLoading={isLoading}
        isSearching={false}
      />
    </Section>
  )
}
