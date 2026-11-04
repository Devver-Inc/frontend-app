import { createFileRoute } from "@tanstack/react-router"
import { PageHeader } from "@/components/common/page-header"
import { AccountSection } from "@/features/profile/components/account-section"
import { PersonalInformationForm } from "@/features/profile/components/personal-information-form"
import { ProfileSkeleton } from "@/features/profile/components/profile-skeleton"
import { useProfile } from "@/features/profile/hooks/use-profile"

export const Route = createFileRoute("/_protected/_dashboard/profile/")({
  component: ProfilePage,
})

function ProfilePage() {
  const { data: profile, isPending } = useProfile()

  if (isPending) return <ProfileSkeleton />

  return (
    <>
      <PageHeader title="Profile" />
      <PersonalInformationForm profile={profile} />
      <AccountSection profile={profile} />
    </>
  )
}
