import { ChevronDown } from 'lucide-react'

import { useOrganizationContext } from '@/lib/organization/organization-context'
import { Button } from '@/components/ui/button'

export function OrganizationSwitcher() {
  const { currentOrganizationId, setCurrentOrganizationId, organizations } =
    useOrganizationContext()

  const current =
    organizations.find((org) => org.id === currentOrganizationId) ??
    organizations[0] ??
    null

  let label = 'Select organization'
  if (current) {
    label = current.name
  } else if (organizations.length === 0) {
    label = 'No organization'
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value || null
    setCurrentOrganizationId(value)
  }

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="org-switcher"
        className="hidden text-sm font-medium text-gray-700 lg:inline"
      >
        Organization
      </label>
      <div className="relative inline-flex items-center">
        <select
          id="org-switcher"
          className="appearance-none rounded-md border border-gray-300 bg-white py-1.5 pl-3 pr-8 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={current?.id ?? ''}
          onChange={handleChange}
          disabled={organizations.length === 0}
        >
          {organizations.length === 0 && <option value="">{label}</option>}
          {organizations.length > 0 &&
            organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
        </select>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="pointer-events-none absolute right-0 h-7 w-7 text-gray-500"
          aria-hidden
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
