import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  AlertTriangle,
  CircleAlert,
  GitBranch,
  LoaderCircle,
  MessageSquare,
  Save,
  Settings2,
  ShieldCheck,
  TerminalSquare,
  Trash2,
  UserPlus,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react'

import type { OverlayCommentPermission } from '@/lib/api/projects'
import { CommentPermissionRadios } from '@/components/projects/comment-permission-radios'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useMembers } from '@/lib/hooks/use-members'
import {
  useCreateProjectComment,
  useProjectComments,
} from '@/lib/hooks/use-comments'
import {
  useArgoStatusStream,
  useCreateProjectRepo,
  useDeleteProjectRepo,
  useProjectDeploymentLogs,
  useProjectDeployments,
  useProjectRepos,
} from '@/lib/hooks/use-deploy-agent'
import {
  useAddProjectMembers,
  useDeleteProject,
  useProject,
  useRemoveProjectMember,
  useUpdateProject,
} from '@/lib/hooks/use-projects'
import { isValidRepoName } from '@/lib/validation-patterns'
import type { ArgoDeploymentStatusEvent } from '@/lib/api/deploy-agent'

export const Route = createFileRoute('/projects/$projectId')({
  component: ProjectDetailsPage,
})

type ArgoStateTone = 'critical' | 'progress' | 'healthy' | 'neutral'

type ArgoState = Readonly<{
  label: string
  description: string
  tone: ArgoStateTone
}>

function getArgoState(
  argoStatus: ArgoDeploymentStatusEvent | null,
): ArgoState {
  if (!argoStatus) {
    return {
      label: 'No status yet',
      description: 'Waiting for ArgoCD status stream...',
      tone: 'neutral',
    }
  }

  if (
    argoStatus.healthStatus === 'Missing' &&
    argoStatus.syncStatus === 'OutOfSync'
  ) {
    return {
      label: 'Deployment issue',
      description: 'Missing + OutOfSync',
      tone: 'critical',
    }
  }

  if (
    argoStatus.healthStatus === 'Progressing' &&
    argoStatus.syncStatus === 'Synced'
  ) {
    return {
      label: 'Stabilizing',
      description: 'Progressing + Synced',
      tone: 'progress',
    }
  }

  if (
    argoStatus.healthStatus === 'Healthy' &&
    argoStatus.syncStatus === 'Synced'
  ) {
    return {
      label: 'Operational',
      description: 'Healthy + Synced',
      tone: 'healthy',
    }
  }

  return {
    label: 'Unknown state',
    description: `${argoStatus.healthStatus} + ${argoStatus.syncStatus}`,
    tone: 'neutral',
  }
}

function renderArgoToneIcon(tone: ArgoStateTone) {
  if (tone === 'critical') {
    return <CircleAlert className="h-4 w-4 text-red-500" />
  }
  if (tone === 'progress') {
    return <LoaderCircle className="h-4 w-4 animate-spin text-amber-500" />
  }
  if (tone === 'healthy') {
    return <ShieldCheck className="h-4 w-4 text-emerald-500" />
  }
  return <TerminalSquare className="h-4 w-4 text-muted-foreground" />
}

function getArgoStreamBadgeVariant(
  isArgoConnected: boolean,
): 'default' | 'secondary' {
  return isArgoConnected ? 'default' : 'secondary'
}

function renderArgoStreamIndicator(isArgoConnected: boolean) {
  if (isArgoConnected) {
    return (
      <span className="inline-flex items-center gap-1">
        <Wifi className="h-3.5 w-3.5" />
        Live stream
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1">
      <WifiOff className="h-3.5 w-3.5" />
      Stream disconnected
    </span>
  )
}

function getPendingButtonLabel(
  isPending: boolean,
  pendingLabel: string,
  normalLabel: string,
) {
  return isPending ? pendingLabel : normalLabel
}

function getSelectableMemberClass(selected: boolean) {
  return selected
    ? 'border-primary/50 bg-primary/10'
    : 'border-border/60 hover:bg-accent/40'
}

function getDeploymentBadgeVariant(status: string) {
  return status === 'deployed' ? 'default' : 'secondary'
}

function normalizeMachineResource(value: number | undefined): number {
  if (value == null) return 1
  return Math.max(0.5, Math.min(2, value))
}

function formatUpdatedAtLabel(updatedAt: string | null | undefined) {
  if (!updatedAt) return 'N/A'
  return new Date(updatedAt).toLocaleString()
}

function getIsRepoNameValid(repoName: string) {
  const trimmed = repoName.trim()
  if (!trimmed) return true
  return isValidRepoName(trimmed)
}

function getDeploymentsToShow<T>(shouldLoadDeployments: boolean, items: T[]) {
  return shouldLoadDeployments ? items : []
}

function ProjectDetailsPage() {
  const { projectId } = Route.useParams()
  const navigate = useNavigate()

  const { data: project, isLoading } = useProject(projectId)
  const { data: membersData } = useMembers({ pageSize: 50 })
  const updateMutation = useUpdateProject(projectId)
  const deleteMutation = useDeleteProject()
  const addMembersMutation = useAddProjectMembers(projectId)
  const removeMemberMutation = useRemoveProjectMember(projectId)
  const { data: commentsData } = useProjectComments(projectId, { pageSize: 50 })
  const createCommentMutation = useCreateProjectComment(projectId)
  const { data: repos = [] } = useProjectRepos(projectId)
  const createRepoMutation = useCreateProjectRepo(projectId)
  const deleteRepoMutation = useDeleteProjectRepo(projectId)
  const logsMutation = useProjectDeploymentLogs(projectId)
  const {
    status: argoStatus,
    isConnected: isArgoConnected,
    lastEventAt: argoLastEventAt,
  } = useArgoStatusStream(projectId)

  const shouldLoadDeployments =
    argoStatus?.healthStatus === 'Healthy' &&
    argoStatus?.syncStatus === 'Synced'

  const { data: deployments = [] } = useProjectDeployments(
    projectId,
    shouldLoadDeployments,
  )

  const deploymentsToShow = getDeploymentsToShow(
    shouldLoadDeployments,
    deployments,
  )

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [cpuCores, setCpuCores] = useState(1)
  const [ram, setRam] = useState(1)
  const [commentPermission, setCommentPermission] =
    useState<OverlayCommentPermission>('email_required')
  const [membersDialogOpen, setMembersDialogOpen] = useState(false)
  const [selectedMemberIds, setSelectedMemberIds] = useState<Array<string>>([])
  const [comment, setComment] = useState('')
  const [repoName, setRepoName] = useState('')
  const [confirmProjectName, setConfirmProjectName] = useState('')
  const [selectedDeploymentIdForLogs, setSelectedDeploymentIdForLogs] =
    useState<string | null>(null)

  useEffect(() => {
    if (!project) return
    setName(project.name)
    setDescription(project.description ?? '')
    setCpuCores(
      Math.max(0.5, Math.min(2, project.machineConfiguration.cpuCores)),
    )
    setRam(Math.max(0.5, Math.min(2, project.machineConfiguration.ram)))
    setCommentPermission(project.overlayAccessControl.commentPermission)
  }, [project])

  const availableMembers = useMemo(() => {
    const all = membersData?.data ?? []
    const existingIds = new Set((project?.teamMembers ?? []).map((m) => m.id))
    return all.filter((m) => !existingIds.has(m.id))
  }, [membersData?.data, project?.teamMembers])

  const normalizedProjectCpu = normalizeMachineResource(
    project?.machineConfiguration.cpuCores,
  )
  const normalizedProjectRam = normalizeMachineResource(
    project?.machineConfiguration.ram,
  )

  const argoState = getArgoState(argoStatus)
  const argoUpdatedLabel = formatUpdatedAtLabel(
    argoLastEventAt ?? argoStatus?.timestamp ?? null,
  )
  const argoToneClasses: Record<typeof argoState.tone, string> = {
    critical: 'border-red-500/40 bg-red-500/10',
    progress: 'border-amber-500/40 bg-amber-500/10',
    healthy: 'border-emerald-500/40 bg-emerald-500/10',
    neutral: 'border-border/60 bg-background/40',
  }

  const isDirty =
    project != null &&
    (name.trim() !== project.name ||
      description.trim() !== (project.description ?? '') ||
      cpuCores !== normalizedProjectCpu ||
      ram !== normalizedProjectRam ||
      commentPermission !== project.overlayAccessControl.commentPermission)
  const isRepoNameValid = getIsRepoNameValid(repoName)

  const toggleMember = (userId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    )
  }

  const handleSave = () => {
    updateMutation.mutate(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        machineConfiguration: { cpuCores, ram },
        overlayAccessControl: {
          commentPermission,
        },
      },
      {
        onSuccess: () => toast.success('Project updated successfully.'),
        onError: (err) =>
          toast.error(err.message || 'Failed to update project.'),
      },
    )
  }

  const handleDelete = () => {
    deleteMutation.mutate(projectId, {
      onSuccess: () => {
        toast.success('Project deleted.')
        navigate({ to: '/projects' })
      },
      onError: (err) => toast.error(err.message || 'Failed to delete project.'),
    })
  }

  const handleAddMembers = () => {
    addMembersMutation.mutate(
      { userIds: selectedMemberIds },
      {
        onSuccess: () => {
          toast.success('Members added to project.')
          setMembersDialogOpen(false)
          setSelectedMemberIds([])
        },
        onError: (err) =>
          toast.error(err.message || 'Failed to add project members.'),
      },
    )
  }

  const handleRemoveMember = (userId: string) => {
    removeMemberMutation.mutate(userId, {
      onSuccess: () => toast.success('Member removed from project.'),
      onError: (err) =>
        toast.error(err.message || 'Failed to remove project member.'),
    })
  }

  const handleCreateComment = () => {
    const content = comment.trim()
    createCommentMutation.mutate(
      { content },
      {
        onSuccess: () => {
          setComment('')
          toast.success('Comment posted.')
        },
        onError: (err) => toast.error(err.message || 'Failed to post comment.'),
      },
    )
  }

  const handleCreateRepo = () => {
    const nextRepoName = repoName.trim()
    createRepoMutation.mutate(
      { name: nextRepoName },
      {
        onSuccess: () => {
          setRepoName('')
          toast.success('Repository created.')
        },
        onError: (err) =>
          toast.error(err.message || 'Failed to create repository.'),
      },
    )
  }

  const handleGetLogs = (deploymentId: string) => {
    setSelectedDeploymentIdForLogs(deploymentId)
    logsMutation.mutate(deploymentId, {
      onError: (err) => toast.error(err.message || 'Failed to load logs.'),
    })
  }

  if (isLoading) {
    return <div className="page-shell h-64 animate-pulse" />
  }

  if (!project) {
    return (
      <div className="page-shell py-12 text-center">
        <p className="text-sm text-muted-foreground">Project not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.name}
        description="Configure resources, access and team members."
        icon={Settings2}
      />

      <div
        className={`rounded-xl border px-4 py-3 ${argoToneClasses[argoState.tone]}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {renderArgoToneIcon(argoState.tone)}
            <p className="text-sm font-semibold">{argoState.label}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getArgoStreamBadgeVariant(isArgoConnected)}>
              {renderArgoStreamIndicator(isArgoConnected)}
            </Badge>
            <Badge variant="outline">{argoState.description}</Badge>
          </div>
        </div>
        {argoStatus && (
          <div className="mt-3 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
            <p className="truncate">
              App: <span className="font-medium">{argoStatus.appName}</span>
            </p>
            <p>
              Operation: {argoStatus.operationPhase ?? 'N/A'}
              {argoStatus.operationMessage && ` - ${argoStatus.operationMessage}`}
            </p>
            <p>Updated: {argoUpdatedLabel}</p>
            <p>
              Health / Sync:{' '}
              <span className="font-medium">
                {argoStatus.healthStatus} / {argoStatus.syncStatus}
              </span>
            </p>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={128}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={256}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="cpu-cores">CPU Cores</Label>
              <div className="text-xs text-muted-foreground">
                {cpuCores.toFixed(1)}
              </div>
              <Slider
                id="cpu-cores"
                min={0.5}
                max={2}
                step={0.1}
                value={[cpuCores]}
                onValueChange={(values) => setCpuCores(values[0] ?? 1)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ram">RAM (GB)</Label>
              <div className="text-xs text-muted-foreground">
                {ram.toFixed(1)}
              </div>
              <Slider
                id="ram"
                min={0.5}
                max={2}
                step={0.1}
                value={[ram]}
                onValueChange={(values) => setRam(values[0] ?? 1)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storage-future">Storage (GB)</Label>
              <Input
                id="storage-future"
                value="Coming soon"
                disabled
                readOnly
              />
              <p className="text-xs text-muted-foreground">
                Storage configuration will be available in a future release.
              </p>
            </div>
          </div>

          <CommentPermissionRadios
            value={commentPermission}
            onChange={setCommentPermission}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Team Members</CardTitle>
          <Dialog open={membersDialogOpen} onOpenChange={setMembersDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1.5">
                <UserPlus className="h-4 w-4" />
                Add Members
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add team members</DialogTitle>
                <DialogDescription>
                  Select organization members to grant project access.
                </DialogDescription>
              </DialogHeader>

              {availableMembers.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No available members to add.
                </p>
              )}

              {availableMembers.length > 0 && (
                <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                  {availableMembers.map((member) => {
                    const selected = selectedMemberIds.includes(member.id)
                    return (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => toggleMember(member.id)}
                        className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition ${getSelectableMemberClass(
                          selected,
                        )}`}
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
                        {selected && <Badge>Selected</Badge>}
                      </button>
                    )
                  })}
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setMembersDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddMembers}
                  disabled={
                    selectedMemberIds.length === 0 ||
                    addMembersMutation.isPending
                  }
                >
                  {getPendingButtonLabel(
                    addMembersMutation.isPending,
                    'Adding...',
                    'Add Members',
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {project.teamMembers.length === 0 && (
            <p className="py-4 text-sm text-muted-foreground">
              No project members yet.
            </p>
          )}
          {project.teamMembers.length > 0 && (
            <div className="space-y-2">
              {project.teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatarUrl ?? undefined} />
                      <AvatarFallback>
                        {member.name?.charAt(0).toUpperCase() ?? '?'}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">
                      {member.name ?? 'Unnamed User'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={removeMemberMutation.isPending}
                    className="text-muted-foreground hover:text-destructive-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4" />
            Comments
          </CardTitle>
          <Badge variant="secondary">
            {commentsData?.meta.totalItemsCount ?? 0}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-comment">New Comment</Label>
            <Textarea
              id="project-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave a note for your team..."
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleCreateComment}
                disabled={createCommentMutation.isPending || !comment.trim()}
              >
                {createCommentMutation.isPending && 'Posting...'}
                {!createCommentMutation.isPending && 'Post Comment'}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {(commentsData?.data ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">
                No comments for this project yet.
              </p>
            )}

            {(commentsData?.data ?? []).length > 0 &&
              commentsData?.data.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-border/60 px-3 py-2.5"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={item.author?.avatarUrl ?? undefined}
                        />
                        <AvatarFallback>
                          {(item.author?.name ?? item.author?.email ?? 'Guest')
                            .charAt(0)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">
                          {item.author?.name ?? item.author?.email ?? 'Guest'}
                        </p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                          {item.repo && (
                            <Badge variant="secondary">{item.repo}</Badge>
                          )}
                          {item.branch && (
                            <Badge variant="outline">{item.branch}</Badge>
                          )}
                          {item.author?.email && (
                            <span className="text-xs text-muted-foreground">
                              {item.author.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-1">
                      {item.position?.pageUrl && (
                        <a
                          href={item.position.pageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="max-w-[240px] truncate text-xs text-primary hover:underline"
                          title="Open comment position"
                        >
                          View location
                        </a>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.content}
                  </p>
                </div>
              ))
            }
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <GitBranch className="h-4 w-4" />
            Repositories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="Repository name"
              />
              {isRepoNameValid ? null : (
                <p className="mt-1 text-xs text-destructive">
                  Use lowercase letters, numbers, and hyphens only.
                </p>
              )}
            </div>
            <Button
              onClick={handleCreateRepo}
              disabled={
                createRepoMutation.isPending ||
                !repoName.trim() ||
                !isRepoNameValid ||
                !shouldLoadDeployments
              }
            >
              {getPendingButtonLabel(
                createRepoMutation.isPending,
                'Creating...',
                'Create Repo',
              )}
            </Button>
          </div>

          {shouldLoadDeployments ? null : (
            <p className="text-sm text-muted-foreground">
              Creating repositories is available once the project is{' '}
              <span className="font-medium">Healthy + Synced</span>.
            </p>
          )}

          {repos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No repositories configured.
            </p>
          ) : (
            <div className="space-y-2">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium">{repo.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {repo.pushUrl}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      deleteRepoMutation.mutate(repo.name, {
                        onSuccess: () => toast.success('Repository deleted.'),
                        onError: (err) =>
                          toast.error(
                            err.message || 'Failed to delete repository.',
                          ),
                      })
                    }
                    disabled={deleteRepoMutation.isPending}
                    className="text-muted-foreground hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TerminalSquare className="h-4 w-4" />
            Deployments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            {shouldLoadDeployments ? null : (
              <p className="text-sm text-muted-foreground">
                Waiting for ArgoCD status to become{' '}
                <span className="font-medium">Healthy + Synced</span>.
              </p>
            )}

            {shouldLoadDeployments && deploymentsToShow.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No deployments for this project yet.
              </p>
            ) : null}

            {shouldLoadDeployments && deploymentsToShow.length > 0
              ? deploymentsToShow.map((deployment) => (
                <div
                  key={deployment.id}
                  className="rounded-lg border border-border/60 px-3 py-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {deployment.repo} / {deployment.branch}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Updated{' '}
                        {new Date(
                          deployment.updatedAt,
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={getDeploymentBadgeVariant(deployment.status)}
                      >
                        {deployment.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGetLogs(deployment.id)}
                        disabled={logsMutation.isPending}
                      >
                        Logs
                      </Button>
                    </div>
                  </div>
                  {selectedDeploymentIdForLogs === deployment.id &&
                    logsMutation.data ? (
                    <div className="mt-3 space-y-1 rounded-md border border-border/50 bg-background/40 p-2">
                      {logsMutation.data.logs.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                          No logs available.
                        </p>
                      ) : (
                        logsMutation.data.logs
                          .slice(0, 100)
                          .map((entry, idx) => (
                            <p
                              key={`${deployment.id}-${idx}`}
                              className="text-xs"
                            >
                              <span className="text-muted-foreground">
                                [{entry.timestamp}] [{entry.service}] [
                                {entry.level}]
                              </span>{' '}
                              {entry.message}
                            </p>
                          ))
                      )}
                    </div>
                  ) : null}
                </div>
              ))
              : null}
          </div>
        </CardContent>
      </Card>

      {isDirty ? (
        <div className="glass-surface-strong flex items-center justify-between rounded-lg border border-border/50 px-4 py-3">
          <div>
            <p className="text-sm font-medium">Unsaved project changes</p>
            <p className="text-xs text-muted-foreground">
              Save to apply project configuration updates.
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending || !name.trim()}
            className="gap-1.5"
          >
            <Save className="h-4 w-4" />
            {getPendingButtonLabel(
              updateMutation.isPending,
              'Saving...',
              'Save Changes',
            )}
          </Button>
        </div>
      ) : null}

      <Card className="border-destructive/35">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-destructive-foreground">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Deleting this project will permanently remove its deployments,
            members assignment and all related data.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-1.5">
                <Trash2 className="h-4 w-4" />
                Delete Project
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Type{' '}
                  <span className="font-mono font-semibold text-foreground">
                    {project.name}
                  </span>{' '}
                  to confirm.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Input
                value={confirmProjectName}
                onChange={(e) => setConfirmProjectName(e.target.value)}
                placeholder={project.name}
              />
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmProjectName('')}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={
                    confirmProjectName !== project.name ||
                    deleteMutation.isPending
                  }
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {getPendingButtonLabel(
                    deleteMutation.isPending,
                    'Deleting...',
                    'Delete Project',
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
