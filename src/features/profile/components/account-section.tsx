import { LogOut } from "lucide-react"
import { Monogram } from "@/components/common/monogram"
import { ROW_CONTENT, Row, RowList } from "@/components/common/row-list"
import { SettingsRow } from "@/components/common/section"
import { Button } from "@/components/ui/button"
import { useAuthClient } from "@/features/auth/hooks/use-auth-client"
import { useUserOrganizations } from "@/features/organizations/hooks/use-user-organizations"
import type { UserProfile } from "@/lib/auth/auth-client"

export function AccountSection({
  profile,
}: {
  profile: UserProfile | undefined
}) {
  const auth = useAuthClient()
  const { data: organizations = [] } = useUserOrganizations()
  const isAvailable = (organizationId: string) =>
    organizations.some(({ id }) => id === organizationId)

  return (
    <>
      {profile?.organizations.length ? (
        <SettingsRow title="Organizations">
          <RowList className="max-w-md">
            {profile.organizations.map((organization) => (
              <Row key={organization.id}>
                <div className={ROW_CONTENT}>
                  <Monogram name={organization.name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{organization.name}</p>
                    {organization.description?.trim() && (
                      <p className="truncate text-sm text-muted-foreground">
                        {organization.description}
                      </p>
                    )}
                  </div>
                  {!isAvailable(organization.id) && (
                    <span className="text-sm text-muted-foreground">
                      Unavailable
                    </span>
                  )}
                </div>
              </Row>
            ))}
          </RowList>
        </SettingsRow>
      ) : null}

      <SettingsRow title="Sign out" description="On this device only.">
        <Button variant="outline" onClick={() => void auth.signOut()}>
          <LogOut />
          Sign out
        </Button>
      </SettingsRow>
    </>
  )
}
