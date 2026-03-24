import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Building2 } from 'lucide-react'

import { createOrganization } from '@/lib/api/organizations'
import { useOrganizationContext } from '@/lib/organization/organization-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'

export const Route = createFileRoute('/organizations/new')({
  component: RouteComponent,
})

function RouteComponent() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const { addOrganization, setCurrentOrganizationId } = useOrganizationContext()
  const navigate = useNavigate()

  const { mutate, isPending, isError, error } = useMutation({
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
    <div className="mx-auto flex max-w-2xl flex-col gap-6 py-10">
      <PageHeader
        title="Create an organization"
        description="Give your organization a name, an optional description, and a logo."
        icon={Building2}
      />

      <Card className="glass-surface border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Organization Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="org-name">
                Organization name{' '}
                <span className="text-destructive-foreground">*</span>
              </Label>
              <Input
                id="org-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Acme Inc."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-description">Description</Label>
              <Textarea
                id="org-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this organization about?"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-logo">Logo (optional)</Label>
              <input
                id="org-logo"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  setLogoFile(file ?? null)
                }}
                className="block w-full text-sm text-foreground file:mr-3 file:rounded-md file:border file:border-border/70 file:bg-glass-surface-strong file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground file:hover:bg-accent"
              />
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WEBP or SVG. The image will be resized automatically.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={isPending || !name.trim()}>
                {isPending ? 'Creating...' : 'Create organization'}
              </Button>
              {isError && (
                <p className="text-sm font-medium text-destructive-foreground">
                  {error instanceof Error
                    ? error.message
                    : 'Failed to create organization.'}
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
