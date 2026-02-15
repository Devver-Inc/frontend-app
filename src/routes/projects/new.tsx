import { createFileRoute } from '@tanstack/react-router'

import { CreateProjectPage } from '@/components/pages/create-project-page'

export const Route = createFileRoute('/projects/new')({
  component: NewProjectRoute,
})

function NewProjectRoute() {
  return <CreateProjectPage />
}
