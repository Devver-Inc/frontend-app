import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { FileText, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'

import type { OrganizationDetails } from '@/lib/api/organizations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  deleteOrganization,
  getOrganizationDetails,
  getOrganizationInvitations,
  getOrganizationMembers,
  updateOrganization,
} from '@/lib/api/organizations'
import { cn } from '@/lib/utils'

export function OrganizationPage() {
  const queryClient = useQueryClient()
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const {
    data: details,
    isLoading: detailsLoading,
    isError: detailsError,
  } = useQuery({
    queryKey: ['organization-details'],
    queryFn: getOrganizationDetails,
    retry: (_, error) => {
      const msg = error instanceof Error ? error.message : ''
      // Do not retry on auth or not-found (avoids 401/404 spam in console)
      if (msg.includes('401') || msg.includes('403') || msg.includes('404'))
        return false
      if (
        msg.includes('Unauthorized') ||
        msg.includes('Forbidden') ||
        msg.includes('Not Found')
      )
        return false
      return true
    },
  })

  const isAdmin = Boolean(details)
  const canEdit = isAdmin

  const { data: membersData } = useQuery({
    queryKey: ['organization-members'],
    queryFn: () => getOrganizationMembers({ pageSize: 50 }),
    enabled: isAdmin,
  })

  const { data: invitations } = useQuery({
    queryKey: ['organization-invitations'],
    queryFn: getOrganizationInvitations,
    enabled: isAdmin,
  })

  const updateMutation = useMutation({
    mutationFn: updateOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-details'] })
      queryClient.invalidateQueries({ queryKey: ['organization-members'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-details'] })
    },
  })

  if (detailsLoading && !details) {
    return (
      <p className="text-sm text-[var(--muted-foreground)]" aria-live="polite">
        Loading organization…
      </p>
    )
  }

  if (detailsError && !details) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          Organization
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          You do not have an organization yet or you do not have permission to
          view details.
        </p>
        <Button asChild>
          <Link to="/organizations/new">Create organization</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <section aria-labelledby="org-settings-heading">
        <h1
          id="org-settings-heading"
          className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
            <FileText className="h-5 w-5" aria-hidden />
          </span>
          Organization Settings
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Manage your organization details and preferences.
        </p>
      </section>

      {details && (
        <>
          <OrganizationProfileSection
            details={details}
            canEdit={canEdit}
            logoInputRef={logoInputRef}
            updateMutation={updateMutation}
          />
          {isAdmin && membersData && (
            <MembersSection
              members={membersData.data}
              total={membersData.meta.totalItemsCount}
            />
          )}
          {isAdmin && invitations && invitations.length > 0 && (
            <InvitationsSection invitations={invitations} />
          )}
          {isAdmin && (
            <DangerZoneSection
              deleteConfirm={deleteConfirm}
              setDeleteConfirm={setDeleteConfirm}
              deleteMutation={deleteMutation}
            />
          )}
        </>
      )}
    </div>
  )
}

type OrganizationProfileSectionProps = Readonly<{
  details: OrganizationDetails
  canEdit: boolean
  logoInputRef: React.RefObject<HTMLInputElement | null>
  updateMutation: ReturnType<
    typeof useMutation<
      unknown,
      Error,
      { name?: string; description?: string; logoFile?: File }
    >
  >
}>

function OrganizationProfileSection({
  details,
  canEdit,
  logoInputRef,
  updateMutation,
}: OrganizationProfileSectionProps) {
  const [name, setName] = useState(details.name)
  const [description, setDescription] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(
      {
        name: name.trim(),
        description: description || undefined,
        logoFile: logoFile ?? undefined,
      },
      { onSuccess: () => setLogoFile(null) },
    )
  }

  return (
    <section
      className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
      aria-labelledby="profile-heading"
    >
      <h2
        id="profile-heading"
        className="flex items-center gap-2 text-lg font-medium text-[var(--card-foreground)]"
      >
        <FileText
          className="h-5 w-5 text-[var(--muted-foreground)]"
          aria-hidden
        />
        Organization Profile
      </h2>
      <div className="mt-4 space-y-4">
        <div>
          <p className="text-sm text-[var(--muted-foreground)]">
            Upload a logo or avatar for your organization. Recommended size:
            200×200px.
          </p>
          <div className="mt-2 flex items-center gap-4">
            {details.coverImageUrl ? (
              <img
                src={details.coverImageUrl}
                alt=""
                className="h-20 w-20 rounded-lg object-cover border border-[var(--border)]"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]">
                No logo
              </div>
            )}
            {canEdit && (
              <>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  className="sr-only"
                  onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                  aria-label="Upload logo"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => logoInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" aria-hidden />
                  Upload image
                </Button>
                {logoFile && (
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {logoFile.name}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
        {canEdit ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">
                Organization Name{' '}
                <span className="text-[var(--destructive)]">*</span>
              </Label>
              <Input
                id="org-name"
                type="text"
                required
                minLength={1}
                maxLength={128}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={updateMutation.isPending}
                className="bg-[var(--background)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-description">Description</Label>
              <Textarea
                id="org-description"
                maxLength={256}
                placeholder="A short description of your organization"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={updateMutation.isPending}
                className="min-h-20 w-full resize-y bg-[var(--background)]"
              />
            </div>
            {updateMutation.isError && (
              <p className="text-sm text-[var(--destructive)]" role="alert">
                {updateMutation.error?.message}
              </p>
            )}
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium text-[var(--foreground)]">
              {details.name}
            </p>
            <p className="text-sm text-[var(--muted-foreground)]">
              {details.membersCount} member
              {details.membersCount > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

type MembersSectionProps = Readonly<{
  members: Array<{ id: string; name: string | null; avatarUrl: string | null }>
  total: number
}>

function MembersSection({ members, total }: MembersSectionProps) {
  return (
    <section
      className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
      aria-labelledby="members-heading"
    >
      <h2
        id="members-heading"
        className="text-lg font-medium text-[var(--card-foreground)]"
      >
        Members ({total})
      </h2>
      <ul className="mt-4 space-y-2">
        {members.map((m) => (
          <li
            key={m.id}
            className="flex items-center gap-3 rounded-lg border border-[var(--border)] px-3 py-2"
          >
            {m.avatarUrl ? (
              <img
                src={m.avatarUrl}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)] text-sm text-[var(--muted-foreground)]">
                {(m.name ?? m.id).slice(0, 1).toUpperCase()}
              </span>
            )}
            <span className="text-sm font-medium text-[var(--foreground)]">
              {m.name ?? m.id}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

type InvitationsSectionProps = Readonly<{
  invitations: Array<{
    id: string
    invitee: string
    status: string
    organizationName: string
  }>
}>

function InvitationsSection({ invitations }: InvitationsSectionProps) {
  return (
    <section
      className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
      aria-labelledby="invitations-heading"
    >
      <h2
        id="invitations-heading"
        className="text-lg font-medium text-[var(--card-foreground)]"
      >
        Pending invitations
      </h2>
      <ul className="mt-4 space-y-2">
        {invitations
          .filter((i) => i.status !== 'Accepted')
          .map((i) => (
            <li
              key={i.id}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
            >
              <span className="text-[var(--foreground)]">{i.invitee}</span>
              <span className="text-[var(--muted-foreground)]">{i.status}</span>
            </li>
          ))}
      </ul>
    </section>
  )
}

type DangerZoneSectionProps = Readonly<{
  deleteConfirm: boolean
  setDeleteConfirm: (v: boolean) => void
  deleteMutation: ReturnType<typeof useMutation<void, Error, void>>
}>

function DangerZoneSection({
  deleteConfirm,
  setDeleteConfirm,
  deleteMutation,
}: DangerZoneSectionProps) {
  return (
    <section
      className={cn(
        'rounded-xl border-2 border-[var(--destructive)]/30 bg-[var(--destructive)]/5 p-6',
      )}
      aria-labelledby="danger-heading"
    >
      <h2
        id="danger-heading"
        className="flex items-center gap-2 text-lg font-medium text-[var(--destructive)]"
      >
        <Trash2 className="h-5 w-5" aria-hidden />
        Danger zone
      </h2>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
        Once you delete your organization, there is no going back. This will
        permanently delete all projects, deployments, and team member
        associations.
      </p>
      {deleteConfirm ? (
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            type="button"
            variant="destructive"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Confirm delete'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setDeleteConfirm(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="destructive"
          className="mt-4"
          onClick={() => setDeleteConfirm(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" aria-hidden />
          Delete organization
        </Button>
      )}
    </section>
  )
}
