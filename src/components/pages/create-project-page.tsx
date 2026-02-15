import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { Cpu, HardDrive, MemoryStick } from 'lucide-react'
import { useRef, useState } from 'react'

import type { MachineConfiguration } from '@/lib/api/types'
import type { CreateProjectInput } from '@/lib/api/projects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { createProject } from '@/lib/api/projects'
import { getOrganizationMembers } from '@/lib/api/organizations'
import { cn } from '@/lib/utils'

const CPU_MIN = 1
const CPU_MAX = 16
const RAM_MIN = 1
const RAM_MAX = 64
const STORAGE_MIN = 10
const STORAGE_MAX = 500

const DEFAULT_MACHINE: MachineConfiguration = {
  cpuCores: 2,
  ram: 4,
  storage: 20,
}

export function CreateProjectPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [machine, setMachine] = useState<MachineConfiguration>(DEFAULT_MACHINE)
  const [accessControl, setAccessControl] = useState({
    requireEmailAuth: false,
    publicAccess: false,
    restrictToTeamMembers: true,
  })
  const [teamMemberIds, setTeamMemberIds] = useState<Array<string>>([])
  const formRef = useRef<HTMLFormElement>(null)

  const { data: membersData } = useQuery({
    queryKey: ['organization-members', { pageSize: 100 }],
    queryFn: () => getOrganizationMembers({ pageSize: 100 }),
  })
  const members = membersData?.data ?? []

  const createMutation = useMutation({
    mutationFn: (input: CreateProjectInput) => createProject(input),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      navigate({
        to: '/projects/$projectId',
        params: { projectId: project.id },
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    createMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      machineConfiguration: machine,
      teamMemberIds,
      accessControl,
    })
  }

  const toggleMember = (userId: string) => {
    setTeamMemberIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Create New Project
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Configure your project settings, technology stack, and infrastructure.
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <section
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
          aria-labelledby="basic-info-heading"
        >
          <h2
            id="basic-info-heading"
            className="flex items-center gap-2 text-lg font-medium text-[var(--card-foreground)]"
          >
            <span className="text-[var(--muted-foreground)]">&lt;/&gt;</span>
            Basic Information
          </h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">
                Project Name{' '}
                <span className="text-[var(--destructive)]">*</span>
              </Label>
              <Input
                id="project-name"
                type="text"
                required
                minLength={1}
                maxLength={128}
                placeholder="my-awesome-project"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={createMutation.isPending}
                className="w-full bg-[var(--background)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                maxLength={256}
                placeholder="Brief description of your project..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={createMutation.isPending}
                className="min-h-24 w-full resize-y bg-[var(--background)]"
              />
            </div>
          </div>
        </section>

        {/* Machine Configuration */}
        <section
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
          aria-labelledby="machine-heading"
        >
          <h2
            id="machine-heading"
            className="flex items-center gap-2 text-lg font-medium text-[var(--card-foreground)]"
          >
            <span className="text-[var(--muted-foreground)]">⚙</span>
            Machine Configuration
          </h2>
          <div className="mt-4 space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Cpu className="h-4 w-4" aria-hidden />
                CPU Cores
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  min={CPU_MIN}
                  max={CPU_MAX}
                  step={1}
                  value={[machine.cpuCores]}
                  onValueChange={([v]) =>
                    setMachine((m: MachineConfiguration) => ({
                      ...m,
                      cpuCores: v ?? CPU_MIN,
                    }))
                  }
                  className="flex-1"
                  disabled={createMutation.isPending}
                />
                <span className="w-20 shrink-0 text-sm font-medium text-[var(--foreground)]">
                  {machine.cpuCores} core{machine.cpuCores > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">
                {CPU_MIN} core – {CPU_MAX} cores
              </p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MemoryStick className="h-4 w-4" aria-hidden />
                RAM
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  min={RAM_MIN}
                  max={RAM_MAX}
                  step={1}
                  value={[machine.ram]}
                  onValueChange={([v]) =>
                    setMachine((m: MachineConfiguration) => ({
                      ...m,
                      ram: v ?? RAM_MIN,
                    }))
                  }
                  className="flex-1"
                  disabled={createMutation.isPending}
                />
                <span className="w-20 shrink-0 text-sm font-medium text-[var(--foreground)]">
                  {machine.ram} GB
                </span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">
                {RAM_MIN} GB – {RAM_MAX} GB
              </p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" aria-hidden />
                Storage
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  min={STORAGE_MIN}
                  max={STORAGE_MAX}
                  step={1}
                  value={[machine.storage]}
                  onValueChange={([v]) =>
                    setMachine((m: MachineConfiguration) => ({
                      ...m,
                      storage: v ?? STORAGE_MIN,
                    }))
                  }
                  className="flex-1"
                  disabled={createMutation.isPending}
                />
                <span className="w-20 shrink-0 text-sm font-medium text-[var(--foreground)]">
                  {machine.storage} GB
                </span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">
                {STORAGE_MIN} GB – {STORAGE_MAX} GB
              </p>
            </div>
          </div>
        </section>

        {/* Team Members */}
        <section
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
          aria-labelledby="team-heading"
        >
          <h2
            id="team-heading"
            className="flex items-center gap-2 text-lg font-medium text-[var(--card-foreground)]"
          >
            <span className="text-[var(--muted-foreground)]">👥</span>
            Team Members
          </h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Select organization members to add to this project.
          </p>
          {members.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
              No other members in your organization yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {members.map((member) => (
                <li key={member.id}>
                  <label
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--border)] px-3 py-2 transition-colors hover:bg-[var(--accent)]/30',
                      teamMemberIds.includes(member.id) &&
                        'border-[var(--ring)] bg-[var(--accent)]/50',
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={teamMemberIds.includes(member.id)}
                      onChange={() => toggleMember(member.id)}
                      disabled={createMutation.isPending}
                      className="h-4 w-4 rounded border-[var(--input)] bg-[var(--background)]"
                    />
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
                  </label>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Access control - optional, backend accepts it */}
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
          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={accessControl.restrictToTeamMembers}
                onChange={(e) =>
                  setAccessControl((a) => ({
                    ...a,
                    restrictToTeamMembers: e.target.checked,
                  }))
                }
                disabled={createMutation.isPending}
                className="h-4 w-4 rounded border-[var(--input)]"
              />
              <span className="text-sm">Restrict to team members</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={accessControl.publicAccess}
                onChange={(e) =>
                  setAccessControl((a) => ({
                    ...a,
                    publicAccess: e.target.checked,
                  }))
                }
                disabled={createMutation.isPending}
                className="h-4 w-4 rounded border-[var(--input)]"
              />
              <span className="text-sm">Public access</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={accessControl.requireEmailAuth}
                onChange={(e) =>
                  setAccessControl((a) => ({
                    ...a,
                    requireEmailAuth: e.target.checked,
                  }))
                }
                disabled={createMutation.isPending}
                className="h-4 w-4 rounded border-[var(--input)]"
              />
              <span className="text-sm">Require email auth</span>
            </label>
          </div>
        </section>

        {createMutation.isError && (
          <p className="text-sm text-[var(--destructive)]" role="alert">
            {createMutation.error instanceof Error
              ? createMutation.error.message
              : 'Failed to create project'}
          </p>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating…' : 'Create project'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to="/">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
