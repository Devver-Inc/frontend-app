import { useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

import { useOrganizationContext } from '@/lib/organization/organization-context'

export function OrganizationSwitcher() {
  const {
    currentOrganizationId,
    setCurrentOrganizationId,
    organizations,
    isLoadingOrganizations,
  } = useOrganizationContext()

  const matchedOrg = organizations.find(
    (org) => org.id === currentOrganizationId,
  )
  const fallbackOrg = organizations.length > 0 ? organizations[0] : undefined
  const current = matchedOrg ?? fallbackOrg

  useEffect(() => {
    if (organizations.length === 0) return

    const nextId = matchedOrg?.id ?? organizations[0].id
    if (currentOrganizationId !== nextId) {
      setCurrentOrganizationId(nextId)
    }
  }, [
    organizations,
    currentOrganizationId,
    matchedOrg,
    setCurrentOrganizationId,
  ])

  if (isLoadingOrganizations && organizations.length === 0) {
    return <Skeleton className="h-10 w-full rounded-xl" />
  }

  const handleChange = (value: string) => {
    setCurrentOrganizationId(value)
  }

  return (
    <Select
      value={current?.id}
      onValueChange={handleChange}
      disabled={organizations.length === 0}
    >
      <SelectTrigger
        id="org-switcher"
        className="h-10 w-full rounded-xl border-sidebar-border/80 bg-sidebar-accent/65 text-sidebar-foreground shadow-md shadow-black/20 hover:bg-sidebar-accent/85 focus-visible:border-sidebar-ring focus-visible:ring-sidebar-ring/35"
      >
        <SelectValue placeholder="No organization" />
      </SelectTrigger>
      <SelectContent>
        {organizations.map((org) => (
          <SelectItem key={org.id} value={org.id}>
            {org.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
