import { createFileRoute } from "@tanstack/react-router"
import { User } from "lucide-react"
import { PageHeader } from "@/components/common/page-header"
import { AccountCard } from "@/features/profile/components/account-card"
import { PersonalInformationCard } from "@/features/profile/components/personal-information-card"
import { ProfileSkeleton } from "@/features/profile/components/profile-skeleton"
import { useProfile } from "@/features/profile/hooks/use-profile"

export const Route = createFileRoute("/_protected/_dashboard/profile/")({
  component: ProfilePage,
})

function ProfilePage() {
  const { data: profile, isPending } = useProfile()

  if (isPending) return <ProfileSkeleton />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal information and account settings"
        icon={User}
      />
      <PersonalInformationCard profile={profile} />
      <AccountCard profile={profile} />
    </div>
  )
}
