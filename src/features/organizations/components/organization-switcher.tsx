import { useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useCurrentOrganizationId } from "@/features/organizations/hooks/use-current-organization-id"
import { useUserOrganizations } from "@/features/organizations/hooks/use-user-organizations"
import { useOrganizationStore } from "@/stores/organization.store"

export function OrganizationSwitcher() {
  const currentOrganizationId = useCurrentOrganizationId()
  const setCurrentOrganizationId = useOrganizationStore(
    (state) => state.setCurrentOrganizationId
  )
  const { data: organizations = [], isPending } = useUserOrganizations()

  const current =
    organizations.find(({ id }) => id === currentOrganizationId) ??
    organizations.at(0)

  // Nothing selected yet, or the selected organization is gone: fall back to
  // the first one.
  useEffect(() => {
    if (current && current.id !== currentOrganizationId) {
      setCurrentOrganizationId(current.id)
    }
  }, [current, currentOrganizationId, setCurrentOrganizationId])

  if (isPending) {
    return <Skeleton className="h-10 w-full rounded-xl" />
  }

  return (
    <Select
      value={current?.id}
      onValueChange={setCurrentOrganizationId}
      disabled={organizations.length === 0}
    >
      <SelectTrigger
        id="org-switcher"
        className="h-10 w-full rounded-xl border-sidebar-border/80 bg-sidebar-accent/65 text-sidebar-foreground shadow-md shadow-black/20 hover:bg-sidebar-accent/85 focus-visible:border-sidebar-ring focus-visible:ring-sidebar-ring/35"
      >
        <SelectValue placeholder="No organization" />
      </SelectTrigger>
      <SelectContent>
        {organizations.map((organization) => (
          <SelectItem key={organization.id} value={organization.id}>
            {organization.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
