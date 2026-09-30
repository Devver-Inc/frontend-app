import { LogOut, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuthClient } from "@/features/auth/hooks/use-auth-client"
import { useUserOrganizations } from "@/features/organizations/hooks/use-user-organizations"
import type { UserProfile } from "@/lib/auth/auth-client"

export function AccountCard({ profile }: { profile: UserProfile | undefined }) {
  const auth = useAuthClient()
  const { data: organizations = [] } = useUserOrganizations()
  const isAvailable = (organizationId: string) =>
    organizations.some(({ id }) => id === organizationId)

  return (
    <Card className="glass-surface border-border/50">
      <CardHeader>
        <CardTitle className="text-base">Account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Organizations</p>
              <p className="text-xs text-muted-foreground">
                You belong to {organizations.length} organization
                {organizations.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <Badge variant="secondary">{organizations.length}</Badge>
        </div>

        {profile?.organizations.length ? (
          <div className="space-y-2">
            {profile.organizations.map((organization) => (
              <div
                key={organization.id}
                className="rounded-md border border-border/50 bg-muted/30 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{organization.name}</p>
                  <Badge
                    variant={
                      isAvailable(organization.id) ? "default" : "secondary"
                    }
                  >
                    {isAvailable(organization.id) ? "Available" : "Token only"}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {organization.description?.trim() || "No description"}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <LogOut className="h-4 w-4 text-destructive-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Sign Out</p>
              <p className="text-xs text-muted-foreground">
                Sign out of your account on this device
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void auth.signOut()}
            className="text-destructive-foreground hover:text-destructive-foreground"
          >
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
