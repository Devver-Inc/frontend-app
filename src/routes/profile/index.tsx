import { createFileRoute } from '@tanstack/react-router'

import { ProfileSettingsPage } from '@/components/pages/profile-settings-page'

export const Route = createFileRoute('/profile/')({
  component: ProfileRoute,
})

function ProfileRoute() {
  return <ProfileSettingsPage />
}
