import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, Camera, Save, Settings, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

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
import { PageHeader } from '@/components/ui/page-header'

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
  const [removeLogo, setRemoveLogo] = useState(false)
  const [confirmName, setConfirmName] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const blobUrlRef = useRef<string | null>(null)
  const prevOrgIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!org) return
    if (currentOrganizationId === prevOrgIdRef.current) return
    prevOrgIdRef.current = currentOrganizationId
    setName(org.name)
    setDescription('')
    setLogoFile(null)
    setRemoveLogo(false)
    setLogoPreview(org.coverImageUrl)
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [org, currentOrganizationId])

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
    }
  }, [])

  const isDirty =
    org != null &&
    (name !== org.name || description !== '' || logoFile !== null || removeLogo)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 5 MB.')
      return
    }
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
    const url = URL.createObjectURL(file)
    blobUrlRef.current = url
    setLogoFile(file)
    setLogoPreview(url)
    setRemoveLogo(false)
  }

  const handleRemoveLogo = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
    setLogoFile(null)
    setLogoPreview(null)
    setRemoveLogo(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDiscard = () => {
    if (!org) return
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
    setName(org.name)
    setDescription('')
    setLogoFile(null)
    setRemoveLogo(false)
    setLogoPreview(org.coverImageUrl)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSave = () => {
    updateMutation.mutate(
      {
        name: name.trim() || undefined,
        description: description.trim() || undefined,
        logoFile,
        removeLogo,
      },
      {
        onSuccess: () => {
          prevOrgIdRef.current = null
          setLogoFile(null)
          setRemoveLogo(false)
          setDescription('')
          if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current)
            blobUrlRef.current = null
          }
          toast.success('Organization updated successfully.')
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to update organization.')
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
        toast.success('Organization deleted.')
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to delete organization.')
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
      <PageHeader
        title="Organization Settings"
        description="Manage your organization details and preferences"
        icon={Settings}
      />

      <Card className="glass-surface border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Organization Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="group relative">
              <Avatar className="h-20 w-20 rounded-lg">
                <AvatarImage src={logoPreview ?? undefined} />
                <AvatarFallback className="rounded-lg bg-muted text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Change organization logo"
              >
                <Camera className="h-5 w-5 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleLogoChange}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Organization Avatar</p>
              <p className="text-xs text-muted-foreground">
                Upload a logo or avatar for your organization. Recommended size:
                200x200px (max 5 MB).
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!logoPreview}
                onClick={handleRemoveLogo}
              >
                Remove avatar
              </Button>
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
        <div className="glass-surface-strong flex items-center justify-between rounded-lg border border-border/50 px-4 py-3">
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

      <Card className="glass-surface border-destructive/30">
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
