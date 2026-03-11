import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, Save, Settings, Trash2, Upload, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  useDeleteOrganization,
  useOrganizationInfo,
  useUpdateOrganization,
} from '@/lib/hooks/use-organization'
import { useOrganizationContext } from '@/lib/organization/organization-context'

export const Route = createFileRoute('/organization/settings')({
  component: OrganizationSettingsPage,
})

function OrganizationSettingsPage() {
  const {
    currentOrganizationId,
    setCurrentOrganizationId,
    removeOrganization,
  } = useOrganizationContext()
  const navigate = useNavigate()

  const { data: org, isLoading } = useOrganizationInfo()
  const updateMutation = useUpdateOrganization()
  const deleteMutation = useDeleteOrganization()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [confirmName, setConfirmName] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (org && !initialized.current) {
      setName(org.name)
      setDescription('')
      setLogoPreview(org.coverImageUrl)
      initialized.current = true
    }
  }, [org])

  const isDirty =
    initialized.current &&
    (name !== (org?.name ?? '') || description !== '' || logoFile !== null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleRemoveLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDiscard = () => {
    if (!org) return
    setName(org.name)
    setDescription('')
    setLogoFile(null)
    setLogoPreview(org.coverImageUrl)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSave = () => {
    updateMutation.mutate(
      {
        name: name.trim() || undefined,
        description: description.trim() || undefined,
        logoFile,
      },
      {
        onSuccess: () => {
          initialized.current = false
          setLogoFile(null)
          setDescription('')
        },
      },
    )
  }

  const handleDelete = () => {
    const orgId = currentOrganizationId
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        if (orgId) removeOrganization(orgId)
        setCurrentOrganizationId(null)
        navigate({ to: '/organizations/new' })
      },
    })
  }

  if (!currentOrganizationId) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Select an organization to manage its settings.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const initials = org?.name
    ? org.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'ORG'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          <Settings className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Organization Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your organization details and preferences
          </p>
        </div>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Organization Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20 rounded-lg">
              <AvatarImage src={logoPreview ?? undefined} />
              <AvatarFallback className="rounded-lg bg-muted text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <p className="text-sm font-medium">Organization Avatar</p>
              <p className="text-xs text-muted-foreground">
                Upload a logo or avatar for your organization. Recommended size:
                200x200px.
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                  Upload Image
                </Button>
                {logoPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveLogo}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleLogoChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-name">
              Organization Name{' '}
              <span className="text-destructive-foreground">*</span>
            </Label>
            <Input
              id="org-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Organization name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-desc">Description</Label>
            <Textarea
              id="org-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A modern deployment platform for developers"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {isDirty && (
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card px-4 py-3">
          <div>
            <p className="text-sm font-medium">You have unsaved changes</p>
            <p className="text-xs text-muted-foreground">
              Save your changes to update the organization settings.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDiscard}>
              <X className="mr-1.5 h-3.5 w-3.5" />
              Discard
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={updateMutation.isPending || !name.trim()}
            >
              <Save className="mr-1.5 h-3.5 w-3.5" />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      )}

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-destructive-foreground">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium">Delete Organization</p>
            <p className="text-xs text-muted-foreground">
              Once you delete your organization, there is no going back. This
              will permanently delete all projects, deployments, and team member
              associations.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Delete Organization
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Organization</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Type{' '}
                  <span className="font-mono font-semibold text-foreground">
                    {org?.name}
                  </span>{' '}
                  to confirm.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Input
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                placeholder={org?.name ?? 'Organization name'}
              />
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmName('')}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={
                    confirmName !== org?.name || deleteMutation.isPending
                  }
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteMutation.isPending
                    ? 'Deleting...'
                    : 'Delete Organization'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
