import { createFileRoute } from '@tanstack/react-router'

import { ProjectsListPage } from '@/components/pages/projects-list-page'

export const Route = createFileRoute('/')({
  component: HomeRoute,
})

function HomeRoute() {
  return <ProjectsListPage />
}
