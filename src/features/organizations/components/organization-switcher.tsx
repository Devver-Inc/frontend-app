import { useEffect } from "react"
import { Monogram } from "@/components/common/monogram"
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
    return <Skeleton className="h-9 w-full rounded-lg bg-sidebar-accent" />
  }

  return (
    <Select
      value={current?.id ?? ""}
      onValueChange={setCurrentOrganizationId}
      disabled={organizations.length === 0}
    >
      <SelectTrigger
        id="org-switcher"
        aria-label="Organization"
        className="w-full bg-transparent pl-1.5 font-medium text-sidebar-foreground shadow-[inset_0_0_0_1px_var(--sidebar-border)] transition-colors hover:bg-sidebar-accent focus-visible:shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring data-[placeholder]:text-sidebar-muted [&_svg:not([class*='text-'])]:text-sidebar-muted"
      >
        <SelectValue placeholder="No organization" />
      </SelectTrigger>
      <SelectContent>
        {organizations.map((organization) => (
          <SelectItem key={organization.id} value={organization.id}>
            <Monogram name={organization.name} size="xs" />
            {organization.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
