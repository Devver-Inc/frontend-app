import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { createOrganization } from '@/lib/api/organizations'
import { useOrganizationContext } from '@/lib/organization/organization-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/organizations/new')({
  component: RouteComponent,
})

function RouteComponent() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const { addOrganization, setCurrentOrganizationId } = useOrganizationContext()
  const navigate = useNavigate()

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: () =>
      createOrganization({
        name,
        description: description.trim() || undefined,
        logoFile,
      }),
    onSuccess: (newOrg) => {
      addOrganization({ id: newOrg.id, name: newOrg.name })
      setCurrentOrganizationId(newOrg.id)
      navigate({ to: '/' })
    },
  })

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    mutate()
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col gap-6 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Create an organization
        </h1>
        <p className="text-sm text-gray-600">
          Give your organization a name, an optional description, and an optional logo.
        </p>
      </header>

      <form className="space-y-6 rounded-xl border bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label
            htmlFor="org-name"
            className="text-sm font-medium text-gray-800 after:ml-0.5 after:text-red-500 after:content-['*']"
          >
            Organization name
          </label>
          <Input
            id="org-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Acme Inc."
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="org-description" className="text-sm font-medium text-gray-800">
            Description
          </label>
          <Textarea
            id="org-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What is this organization about?"
            rows={4}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="org-logo" className="text-sm font-medium text-gray-800">
            Logo (optional)
          </label>
          <input
            id="org-logo"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(event) => {
              const file = event.target.files?.[0]
              setLogoFile(file ?? null)
            }}
            className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-gray-700 file:hover:bg-gray-200"
          />
          <p className="text-xs text-gray-500">
            PNG, JPG, WEBP or SVG. The image will be resized automatically.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isPending || !name.trim()}>
            {isPending ? 'Creating…' : 'Create organization'}
          </Button>
          {isSuccess && (
            <p className="text-sm font-medium text-green-600">
              Organization created successfully.
            </p>
          )}
          {isError && (
            <p className="text-sm font-medium text-red-600">
              {error instanceof Error ? error.message : 'Failed to create organization.'}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

