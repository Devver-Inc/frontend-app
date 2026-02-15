import { useLogto } from '@logto/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateAccount } from '@/lib/api/users'

export function ProfileSettingsPage() {
  const { getIdTokenClaims } = useLogto()
  const queryClient = useQueryClient()
  const [claims, setClaims] = useState<{
    email?: string
    name?: string
  } | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null,
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getIdTokenClaims().then((c) => {
      if (c) {
        setClaims(c as { email?: string; name?: string })
        const name = (c as { name?: string }).name ?? ''
        const parts = name.trim().split(/\s+/)
        if (parts.length >= 2) {
          setLastName(parts.pop() ?? '')
          setFirstName(parts.join(' '))
        } else if (parts.length === 1) {
          setFirstName(parts[0] ?? '')
        }
      }
    })
  }, [getIdTokenClaims])

  const updateMutation = useMutation({
    mutationFn: updateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      profilePictureFile: profilePictureFile ?? undefined,
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <section aria-labelledby="profile-heading">
        <h1
          id="profile-heading"
          className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
            <User className="h-5 w-5" aria-hidden />
          </span>
          Profile Settings
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Manage your personal account and preferences.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
          aria-labelledby="user-profile-heading"
        >
          <h2
            id="user-profile-heading"
            className="flex items-center gap-2 text-lg font-medium text-[var(--card-foreground)]"
          >
            <User
              className="h-5 w-5 text-[var(--muted-foreground)]"
              aria-hidden
            />
            User Profile
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">
                Upload a profile picture. Recommended size: 200×200px.
              </p>
              <div className="mt-2 flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  className="sr-only"
                  onChange={(e) =>
                    setProfilePictureFile(e.target.files?.[0] ?? null)
                  }
                  aria-label="Upload profile picture"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={updateMutation.isPending}
                >
                  Upload image
                </Button>
                {profilePictureFile && (
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {profilePictureFile.name}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="first-name">
                Full Name (First){' '}
                <span className="text-[var(--destructive)]">*</span>
              </Label>
              <Input
                id="first-name"
                type="text"
                required
                minLength={1}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={updateMutation.isPending}
                className="bg-[var(--background)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">
                Full Name (Last){' '}
                <span className="text-[var(--destructive)]">*</span>
              </Label>
              <Input
                id="last-name"
                type="text"
                required
                minLength={1}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={updateMutation.isPending}
                className="bg-[var(--background)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={claims?.email ?? ''}
                readOnly
                disabled
                className="bg-[var(--muted)] text-[var(--muted-foreground)]"
              />
              <p className="text-xs italic text-[var(--muted-foreground)]">
                Email address cannot be changed.
              </p>
            </div>
          </div>
        </section>

        {updateMutation.isError && (
          <p className="text-sm text-[var(--destructive)]" role="alert">
            {updateMutation.error?.message}
          </p>
        )}

        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Saving…' : 'Save changes'}
        </Button>
      </form>
    </div>
  )
}
