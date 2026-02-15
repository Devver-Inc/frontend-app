import { createFileRoute } from '@tanstack/react-router'

import { OrganizationPage } from '@/components/pages/organization-page'

export const Route = createFileRoute('/organization/')({
  component: OrganizationRoute,
})

function OrganizationRoute() {
  return <OrganizationPage />
}
