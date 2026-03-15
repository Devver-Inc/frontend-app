import { useLogto } from '@logto/react'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { Camera, LogOut, Shield, User } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useOrganizationContext } from '@/lib/organization/organization-context'
import { apiFetch } from '@/lib/api/client'
import { PageHeader } from '@/components/ui/page-header'

export const Route = createFileRoute('/profile/')({
  component: ProfilePage,
})

type UserProfile = {
  sub: string
  username: string | null
  name: string | null
  given_name: string | null
  family_name: string | null
  email: string | null
  email_verified: boolean
  picture: string | null
  created_at: number
  organization_data: Array<{
    id: string
    name: string
    description: string | null
  }>
}

function ProfilePage() {
  const { getIdTokenClaims, fetchUserInfo, signOut } = useLogto()
  const { organizations } = useOrganizationContext()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [removeAvatar, setRemoveAvatar] = useState(false)
  const [initialFirstName, setInitialFirstName] = useState('')
  const [initialLastName, setInitialLastName] = useState('')
  const [initialAvatar, setInitialAvatar] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<{
    firstName?: string
    lastName?: string
  }>({})

  const fileInputRef = useRef<HTMLInputElement>(null)
  const blobUrlRef = useRef<string | null>(null)
  const initializedRef = useRef(false)

  const getIdTokenClaimsRef = useRef(getIdTokenClaims)
  getIdTokenClaimsRef.current = getIdTokenClaims
  const fetchUserInfoRef = useRef(fetchUserInfo)
  fetchUserInfoRef.current = fetchUserInfo

  useEffect(() => {
    const load = async () => {
      try {
        const [claims, userInfo] = await Promise.all([
          getIdTokenClaimsRef.current(),
          fetchUserInfoRef.current(),
        ])
        const raw = claims as Record<string, unknown>
        const info = userInfo as Record<string, unknown> | undefined
        const p: UserProfile = {
          sub: (raw.sub as string) ?? '',
          username: (raw.username as string | null) ?? null,
          name:
            (info?.name as string | null) ??
            (raw.name as string | null) ??
            null,
          given_name:
            (info?.given_name as string | null) ??
            (raw.given_name as string | null) ??
            null,
          family_name:
            (info?.family_name as string | null) ??
            (raw.family_name as string | null) ??
            null,
          email:
            (info?.email as string | null) ??
            (raw.email as string | null) ??
            null,
          email_verified: (info?.email_verified as boolean) ?? false,
          picture:
            (info?.picture as string | null) ??
            (raw.picture as string | null) ??
            null,
          created_at: (raw.created_at as number) ?? 0,
          organization_data: (
            (info?.organization_data as
              | Array<{
                  id?: string
                  name?: string
                  description?: string | null
                }>
              | undefined) ??
            (raw.organization_data as
              | Array<{
                  id?: string
                  name?: string
                  description?: string | null
                }>
              | undefined) ??
            []
          )
            .filter(
              (org) =>
                typeof org.id === 'string' && typeof org.name === 'string',
            )
            .map((org) => ({
              id: org.id as string,
              name: org.name as string,
              description: org.description ?? null,
            })),
        }
        setProfile(p)

        if (!initializedRef.current) {
          const initialFirst = p.given_name ?? ''
          const initialLast = p.family_name ?? ''
          setFirstName(initialFirst)
          setLastName(initialLast)
          setInitialFirstName(initialFirst)
          setInitialLastName(initialLast)
          setInitialAvatar(p.picture)
          setAvatarPreview(p.picture)
          initializedRef.current = true
        }
      } catch {
        toast.error('Failed to load profile.')
      } finally {
        setLoading(false)
      }
    }
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
    }
  }, [])

  const MAX_AVATAR_SIZE = 8 * 1024 * 1024

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error('File too large. Maximum size is 8 MB.')
      return
    }
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
    const url = URL.createObjectURL(file)
    blobUrlRef.current = url
    setAvatarFile(file)
    setAvatarPreview(url)
    setRemoveAvatar(false)
  }

  const handleRemoveAvatar = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
    setAvatarFile(null)
    setAvatarPreview(null)
    setRemoveAvatar(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const validate = (): boolean => {
    const newErrors: { firstName?: string; lastName?: string } = {}
    if (!firstName.trim()) newErrors.firstName = 'First name is required.'
    if (!lastName.trim()) newErrors.lastName = 'Last name is required.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getApiErrorMessage = async (res: Response): Promise<string> => {
    const body = await res.text()
    try {
      const parsed = JSON.parse(body) as { message?: string | Array<string> }
      return Array.isArray(parsed.message)
        ? parsed.message.join(', ')
        : (parsed.message ?? res.statusText)
    } catch {
      return body || res.statusText
    }
  }

  const applySuccessfulSave = async (
    normalizedFirstName: string,
    normalizedLastName: string,
  ) => {
    const refreshedUserInfo = (await fetchUserInfoRef.current()) as
      | Record<string, unknown>
      | undefined
    const refreshedPicture =
      (refreshedUserInfo?.picture as string | null) ??
      avatarPreview ??
      profile?.picture ??
      null
    const refreshedGivenName =
      (refreshedUserInfo?.given_name as string | null) ?? normalizedFirstName
    const refreshedFamilyName =
      (refreshedUserInfo?.family_name as string | null) ?? normalizedLastName
    const fullName = `${refreshedGivenName} ${refreshedFamilyName}`.trim()

    if (blobUrlRef.current && refreshedPicture !== blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }

    setProfile((prev) =>
      prev
        ? {
            ...prev,
            name: fullName || prev.name || prev.username,
            given_name: refreshedGivenName,
            family_name: refreshedFamilyName,
            picture: refreshedPicture,
          }
        : prev,
    )
    setFirstName(refreshedGivenName)
    setLastName(refreshedFamilyName)
    setInitialFirstName(refreshedGivenName)
    setInitialLastName(refreshedFamilyName)
    setInitialAvatar(refreshedPicture)
    setAvatarPreview(refreshedPicture)
    setAvatarFile(null)
    setRemoveAvatar(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const normalizedFirstName = firstName.trim()
      const normalizedLastName = lastName.trim()
      const formData = new FormData()
      formData.append('firstName', normalizedFirstName)
      formData.append('lastName', normalizedLastName)
      if (avatarFile) {
        formData.append('profilePictureFile', avatarFile)
      }
      if (removeAvatar) {
        formData.append('removeProfilePicture', 'true')
      }

      const res = await apiFetch('/users/me', {
        method: 'PATCH',
        body: formData,
      })
      if (!res.ok) {
        throw new Error(await getApiErrorMessage(res))
      }

      await applySuccessfulSave(normalizedFirstName, normalizedLastName)
      toast.success('Profile updated successfully.')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update profile.',
      )
    } finally {
      setSaving(false)
    }
  }

  const isDirty =
    initializedRef.current &&
    profile != null &&
    (firstName.trim() !== initialFirstName ||
      lastName.trim() !== initialLastName ||
      avatarFile !== null ||
      avatarPreview !== initialAvatar ||
      removeAvatar)

  const displayName =
    profile == null
      ? 'User'
      : `${profile.given_name ?? ''} ${profile.family_name ?? ''}`.trim() ||
        profile.name ||
        profile.username ||
        'User'

  const initials = displayName
    ? displayName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?'

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal information and account settings"
        icon={User}
      />

      <Card className="glass-surface border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="group relative">
              <Avatar className="h-20 w-20 rounded-lg">
                <AvatarImage src={avatarPreview ?? undefined} />
                <AvatarFallback className="rounded-lg bg-muted text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Change avatar"
              >
                <Camera className="h-5 w-5 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium">{displayName}</p>
              {profile?.email && (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {profile.email}
                  </p>
                  {profile.email_verified && (
                    <Badge
                      variant="secondary"
                      className="gap-1 text-xs font-normal"
                    >
                      <Shield className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
              )}
              {memberSince && (
                <p className="text-xs text-muted-foreground">
                  Member since {memberSince}
                </p>
              )}
              <div className="pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={!avatarPreview}
                  onClick={handleRemoveAvatar}
                >
                  Remove avatar
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first-name">
                First Name{' '}
                <span className="text-destructive-foreground">*</span>
              </Label>
              <Input
                id="first-name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                  if (errors.firstName)
                    setErrors((prev) => ({ ...prev, firstName: undefined }))
                }}
                placeholder="John"
                className={errors.firstName ? 'border-destructive' : ''}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive-foreground">
                  {errors.firstName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">
                Last Name <span className="text-destructive-foreground">*</span>
              </Label>
              <Input
                id="last-name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                  if (errors.lastName)
                    setErrors((prev) => ({ ...prev, lastName: undefined }))
                }}
                placeholder="Doe"
                className={errors.lastName ? 'border-destructive' : ''}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive-foreground">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={profile?.email ?? ''}
              disabled
              className="text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Email is managed through your authentication provider.
            </p>
          </div>

          {isDirty && (
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-surface border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <Shield className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Organizations</p>
                <p className="text-xs text-muted-foreground">
                  You belong to {organizations.length} organization
                  {organizations.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>
            <Badge variant="secondary">{organizations.length}</Badge>
          </div>

          {profile?.organization_data.length ? (
            <div className="space-y-2">
              {profile.organization_data.map((org) => (
                <div
                  key={org.id}
                  className="rounded-md border border-border/50 bg-muted/30 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">{org.name}</p>
                    <Badge
                      variant={
                        organizations.some((o) => o.id === org.id)
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {organizations.some((o) => o.id === org.id)
                        ? 'Available'
                        : 'Token only'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {org.description?.trim() || 'No description'}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <LogOut className="h-4 w-4 text-destructive-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Sign Out</p>
                <p className="text-xs text-muted-foreground">
                  Sign out of your account on this device
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut(import.meta.env.VITE_LOGTO_SIGN_OUT_URI)}
              className="text-destructive-foreground hover:text-destructive-foreground"
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
