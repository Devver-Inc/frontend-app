import { useState } from "react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { SettingsRow } from "@/components/common/section"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuthUser } from "@/features/auth/hooks/use-auth-user"
import { useTransferOrganizationOwnership } from "@/features/organizations/hooks/use-transfer-organization-ownership"
import type { OrganizationGovernance } from "@/features/organizations/types/organization.types"
import { getInitials } from "@/lib/utils/get-initials"

export function OrganizationOwnershipRow({
  governance,
}: {
  governance: OrganizationGovernance
}) {
  const user = useAuthUser()
  const transferOwnership = useTransferOrganizationOwnership()
  const [newOwnerId, setNewOwnerId] = useState<string>()

  const { owner } = governance
  const candidates = governance.admins.filter(({ id }) => id !== owner?.id)
  const newOwner = candidates.find(({ id }) => id === newOwnerId)
  const canTransfer = owner?.id === user?.id && candidates.length > 0

  const onConfirm = () => {
    if (!newOwner) return
    transferOwnership.mutate(newOwner.id, {
      onSuccess: () => {
        setNewOwnerId(undefined)
        toast.success("Ownership transferred.")
      },
    })
  }

  return (
    <SettingsRow
      title="Owner"
      description="The owner can't be removed from the organization. Ownership goes to an admin."
    >
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src={owner?.avatarUrl ?? undefined} alt="" />
            <AvatarFallback className="text-xs">
              {owner?.name ? getInitials(owner.name) : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium">
              {owner?.name ?? "No owner set"}
            </p>
            {owner?.email && (
              <p className="truncate text-sm text-muted-foreground">
                {owner.email}
              </p>
            )}
          </div>
        </div>

        {canTransfer && (
          <div className="flex flex-wrap gap-2">
            <Select value={newOwnerId} onValueChange={setNewOwnerId}>
              <SelectTrigger aria-label="New owner" className="w-64 max-w-full">
                <SelectValue placeholder="Choose an admin" />
              </SelectTrigger>
              <SelectContent>
                {candidates.map((admin) => (
                  <SelectItem key={admin.id} value={admin.id}>
                    {admin.name ?? admin.email ?? admin.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ConfirmDialog
              trigger={
                <Button
                  variant="outline"
                  disabled={!newOwner || transferOwnership.isPending}
                >
                  Transfer ownership
                </Button>
              }
              title="Transfer ownership?"
              description={`${newOwner?.name ?? newOwner?.email ?? "This admin"} becomes the owner. You stay an admin.`}
              actionLabel="Transfer ownership"
              onConfirm={onConfirm}
            />
          </div>
        )}
      </div>
    </SettingsRow>
  )
}
