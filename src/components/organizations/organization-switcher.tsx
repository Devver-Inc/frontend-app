import { ChevronsUpDown } from 'lucide-react'

import { useOrganizationContext } from '@/lib/organization/organization-context'

export function OrganizationSwitcher() {
  const { currentOrganizationId, setCurrentOrganizationId, organizations } =
    useOrganizationContext()

  const current =
    organizations.find((org) => org.id === currentOrganizationId) ??
    (organizations.length > 0 ? organizations[0] : undefined)

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value || null
    setCurrentOrganizationId(value)
  }

  return (
    <div className="relative">
      <select
        id="org-switcher"
        className="w-full cursor-pointer appearance-none truncate rounded-lg border border-sidebar-border bg-sidebar-accent/50 py-2 pl-3 pr-8 text-sm text-sidebar-foreground transition-colors focus:border-sidebar-ring focus:outline-none"
        value={current?.id ?? ''}
        onChange={handleChange}
        disabled={organizations.length === 0}
      >
        {organizations.length === 0 && (
          <option value="">No organization</option>
        )}
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
      <ChevronsUpDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-sidebar-foreground/40" />
    </div>
  )
}
