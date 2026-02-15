import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { Cpu, HardDrive, MemoryStick, Trash2, UserMinus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  deleteProject,
  getProject,
  removeProjectMember,
} from '@/lib/api/projects'
import { cn } from '@/lib/utils'

export function ProjectDetailPage({ projectId }: { projectId: string }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProject(projectId),
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      navigate({ to: '/' })
    },
  })

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => removeProjectMember(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
    },
  })

  if (isLoading) {
    return (
      <p className="text-sm text-[var(--muted-foreground)]" aria-live="polite">
        Loading project…
      </p>
    )
  }

  if (isError || !project) {
    return (
      <div className="space-y-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          ← Back to Projects
        </Link>
        <p className="text-sm text-[var(--destructive)]" role="alert">
          {error instanceof Error ? error.message : 'Project not found'}
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            ← Back to Projects
          </Link>
          <h1 className="mt-2 flex items-center gap-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            {project.name}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Last updated {formatDate(project.updatedAt)}
          </p>
        </div>
      </div>

      {project.description && (
        <p className="text-[var(--muted-foreground)]">{project.description}</p>
      )}

      <section
        className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
        aria-labelledby="machine-heading"
      >
        <h2
          id="machine-heading"
          className="text-lg font-medium text-[var(--card-foreground)]"
        >
          Machine configuration
        </h2>
        <ul className="mt-4 flex flex-wrap gap-6" role="list">
          <li className="flex items-center gap-2 text-sm">
            <Cpu
              className="h-4 w-4 text-[var(--muted-foreground)]"
              aria-hidden
            />
            {project.machineConfiguration.cpuCores} CPU cores
          </li>
          <li className="flex items-center gap-2 text-sm">
            <MemoryStick
              className="h-4 w-4 text-[var(--muted-foreground)]"
              aria-hidden
            />
            {project.machineConfiguration.ram} GB RAM
          </li>
          <li className="flex items-center gap-2 text-sm">
            <HardDrive
              className="h-4 w-4 text-[var(--muted-foreground)]"
              aria-hidden
            />
            {project.machineConfiguration.storage} GB storage
          </li>
        </ul>
      </section>

      <section
        className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
        aria-labelledby="access-heading"
      >
        <h2
          id="access-heading"
          className="text-lg font-medium text-[var(--card-foreground)]"
        >
          Access control
        </h2>
        <ul
          className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--muted-foreground)]"
          role="list"
        >
          <li>
            Restrict to team members:{' '}
            {project.accessControl.restrictToTeamMembers ? 'Yes' : 'No'}
          </li>
          <li>
            Public access: {project.accessControl.publicAccess ? 'Yes' : 'No'}
          </li>
          <li>
            Require email auth:{' '}
            {project.accessControl.requireEmailAuth ? 'Yes' : 'No'}
          </li>
        </ul>
      </section>

      <section
        className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
        aria-labelledby="team-heading"
      >
        <h2
          id="team-heading"
          className="text-lg font-medium text-[var(--card-foreground)]"
        >
          Team members ({project.teamMembers.length})
        </h2>
        {project.teamMembers.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">
            No team members yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-2" role="list">
            {project.teamMembers.map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)] text-sm font-medium text-[var(--muted-foreground)]">
                      {(member.name ?? member.id).slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {member.name ?? member.id}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-[var(--destructive)] hover:bg-[var(--destructive)]/10"
                  onClick={() => removeMemberMutation.mutate(member.id)}
                  disabled={removeMemberMutation.isPending}
                  aria-label={`Remove ${member.name ?? member.id} from project`}
                >
                  <UserMinus className="h-4 w-4" aria-hidden />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Danger zone */}
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
          Once you delete this project, there is no going back. This will
          permanently remove the project and all associated data.
        </p>
        {!deleteConfirm ? (
          <Button
            type="button"
            variant="destructive"
            className="mt-4"
            onClick={() => setDeleteConfirm(true)}
            aria-describedby="danger-heading"
          >
            Delete project
          </Button>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-3">
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
        )}
      </section>
    </div>
  )
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours < 1) return 'just now'
    if (diffHours < 24)
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return d.toLocaleDateString()
  } catch {
    return iso
  }
}
