import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useRef, useState } from 'react'

import type { CreateOrganizationInput } from '@/lib/api/organizations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useOrganizationContext } from '@/lib/organization/organization-context'
import { createOrganization } from '@/lib/api/organizations'

export const Route = createFileRoute('/organizations/new')({
  component: NewOrganizationPage,
})

const ACCEPT_IMAGES = 'image/jpeg,image/png,image/webp,image/svg+xml'

function NewOrganizationPage() {
  const navigate = useNavigate()
  const { setCurrentOrganizationId } = useOrganizationContext()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const createMutation = useMutation({
    mutationFn: (input: CreateOrganizationInput) => createOrganization(input),
    onSuccess: (organization) => {
      setCurrentOrganizationId(organization.id)
      navigate({ to: '/organization' })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      logoFile: logoFile ?? undefined,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setLogoFile(file ?? null)
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-900">
        Create organization
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Create a new organization. You will be added as the first member.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            required
            minLength={1}
            maxLength={128}
            placeholder="My Organization"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={createMutation.isPending}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            maxLength={256}
            placeholder="Short description of the organization"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={createMutation.isPending}
            className="min-h-20 w-full resize-y"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo">Logo (optional)</Label>
          <Input
            ref={fileInputRef}
            id="logo"
            type="file"
            accept={ACCEPT_IMAGES}
            onChange={handleFileChange}
            disabled={createMutation.isPending}
            className="w-full"
          />
          {logoFile && (
            <p className="text-sm text-gray-500">Selected: {logoFile.name}</p>
          )}
        </div>

        {createMutation.isError && (
          <p className="text-sm text-red-600">
            {createMutation.error instanceof Error
              ? createMutation.error.message
              : 'Failed to create organization'}
          </p>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating…' : 'Create organization'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: '/' })}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
