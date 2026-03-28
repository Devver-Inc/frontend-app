import { useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import type {
  GetProjectDto,
  OverlayCommentPermission,
} from '@/lib/api/projects'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CommentPermissionRadios } from '@/components/projects/comment-permission-radios'
import { useCreateProject } from '@/lib/hooks/use-projects'
import { useMembers } from '@/lib/hooks/use-members'

type CreateProjectDialogProps = Readonly<{
  onCreated?: (project: GetProjectDto) => void
}>

export function CreateProjectDialog({ onCreated }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [cpuCores, setCpuCores] = useState(1)
  const [ram, setRam] = useState(1)
  const [selectedMemberIds, setSelectedMemberIds] = useState<Array<string>>([])
  const [commentPermission, setCommentPermission] =
    useState<OverlayCommentPermission>('email_required')

  const { mutate, isPending } = useCreateProject()
  const { data: membersData } = useMembers({ pageSize: 50 })

  const availableMembers = membersData?.data ?? []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (cpuCores < 0.5 || cpuCores > 2 || ram < 0.5 || ram > 2) {
      toast.error('CPU and RAM values must be between 0.5 and 2.')
      return
    }

    mutate(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        machineConfiguration: {
          cpuCores,
          ram,
        },
        teamMemberIds: selectedMemberIds,
        overlayAccessControl: {
          commentPermission,
        },
      },
      {
        onSuccess: (project) => {
          setOpen(false)
          setName('')
          setDescription('')
          setCpuCores(1)
          setRam(1)
          setSelectedMemberIds([])
          setCommentPermission('email_required')
          toast.success('Project created successfully.')
          onCreated?.(project)
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to create project.')
        },
      },
    )
  }

  const toggleMember = (memberId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Create a new project in your organization.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name *</Label>
              <Input
                id="project-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome Project"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-desc">Description</Label>
              <Textarea
                id="project-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this project about?"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Machine configuration</Label>
              <div className="space-y-4 rounded-md border border-border/60 p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="project-cpu">CPU Cores</Label>
                    <span className="text-xs text-muted-foreground">
                      {cpuCores.toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    id="project-cpu"
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={[cpuCores]}
                    onValueChange={(values) => setCpuCores(values[0] ?? 1)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="project-ram">RAM (GB)</Label>
                    <span className="text-xs text-muted-foreground">
                      {ram.toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    id="project-ram"
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={[ram]}
                    onValueChange={(values) => setRam(values[0] ?? 1)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-storage-future">Storage (GB)</Label>
                  <Input
                    id="project-storage-future"
                    value="Coming soon"
                    disabled
                    readOnly
                  />
                  <p className="text-xs text-muted-foreground">
                    Storage configuration will be available in a future release.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Assign team members</Label>
              {availableMembers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No organization members available.
                </p>
              ) : (
                <div className="max-h-56 space-y-2 overflow-y-auto rounded-md border border-border/60 p-2">
                  {availableMembers.map((member) => {
                    const selected = selectedMemberIds.includes(member.id)
                    return (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => toggleMember(member.id)}
                        className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition ${
                          selected
                            ? 'border-primary/50 bg-primary/10'
                            : 'border-border/60 hover:bg-accent/40'
                        }`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatarUrl ?? undefined} />
                          <AvatarFallback>
                            {member.name?.charAt(0).toUpperCase() ?? '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {member.name ?? 'Unnamed User'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.id}
                          </p>
                        </div>
                        {selected ? <Badge>Selected</Badge> : null}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <CommentPermissionRadios
              value={commentPermission}
              onChange={setCommentPermission}
              groupClassName="rounded-md border border-border/60 p-3"
            />
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !name.trim()}>
              {isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
