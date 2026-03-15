import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  AlertTriangle,
  GitBranch,
  MessageSquare,
  Save,
  Settings2,
  TerminalSquare,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react'

import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  useCreateProjectDeployment,
  useCreateProjectRepo,
  useDeleteProjectDeployment,
  useDeleteProjectRepo,
  useProjectDeploymentLogs,
  useProjectDeployments,
  useProjectRepos,
  useRestoreProjectDeployAgentState,
} from '@/lib/hooks/use-deploy-agent'
import {
  useAddProjectMembers,
  useDeleteProject,
  useProject,
  useRemoveProjectMember,
  useUpdateProject,
} from '@/lib/hooks/use-projects'

export const Route = createFileRoute('/projects/$projectId')({
  component: ProjectDetailsPage,
})

// eslint-disable-next-line sonarqube/cognitive-complexity
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
  const { data: deployments = [] } = useProjectDeployments(projectId)
  const createDeploymentMutation = useCreateProjectDeployment(projectId)
  const deleteDeploymentMutation = useDeleteProjectDeployment(projectId)
  const logsMutation = useProjectDeploymentLogs(projectId)
  const restoreStateMutation = useRestoreProjectDeployAgentState(projectId)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [cpuCores, setCpuCores] = useState(2)
  const [ram, setRam] = useState(4)
  const [storage, setStorage] = useState(20)
  const [requireEmailAuth, setRequireEmailAuth] = useState(true)
  const [publicAccess, setPublicAccess] = useState(false)
  const [restrictToTeamMembers, setRestrictToTeamMembers] = useState(false)
  const [membersDialogOpen, setMembersDialogOpen] = useState(false)
  const [selectedMemberIds, setSelectedMemberIds] = useState<Array<string>>([])
  const [comment, setComment] = useState('')
  const [repoName, setRepoName] = useState('')
  const [deployRepo, setDeployRepo] = useState('')
  const [deployBranch, setDeployBranch] = useState('main')
  const [deployCommit, setDeployCommit] = useState('')
  const [serviceName, setServiceName] = useState('app')
  const [serviceRoot, setServiceRoot] = useState('')
  const [serviceInstall, setServiceInstall] = useState('')
  const [serviceBuild, setServiceBuild] = useState('npm run build')
  const [serviceStart, setServiceStart] = useState('npm run start')
  const [serviceDepends, setServiceDepends] = useState('')
  const [confirmProjectName, setConfirmProjectName] = useState('')
  const [selectedDeploymentIdForLogs, setSelectedDeploymentIdForLogs] =
    useState<string | null>(null)

  useEffect(() => {
    if (!project) return
    setName(project.name)
    setDescription(project.description ?? '')
    setCpuCores(project.machineConfiguration.cpuCores)
    setRam(project.machineConfiguration.ram)
    setStorage(project.machineConfiguration.storage)
    setRequireEmailAuth(project.accessControl.requireEmailAuth)
    setPublicAccess(project.accessControl.publicAccess)
    setRestrictToTeamMembers(project.accessControl.restrictToTeamMembers)
  }, [project])

  const availableMembers = useMemo(() => {
    const all = membersData?.data ?? []
    const existingIds = new Set((project?.teamMembers ?? []).map((m) => m.id))
    return all.filter((m) => !existingIds.has(m.id))
  }, [membersData?.data, project?.teamMembers])

  const isDirty =
    project != null &&
    (name.trim() !== project.name ||
      description.trim() !== (project.description ?? '') ||
      cpuCores !== project.machineConfiguration.cpuCores ||
      ram !== project.machineConfiguration.ram ||
      storage !== project.machineConfiguration.storage ||
      requireEmailAuth !== project.accessControl.requireEmailAuth ||
      publicAccess !== project.accessControl.publicAccess ||
      restrictToTeamMembers !== project.accessControl.restrictToTeamMembers)

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
        machineConfiguration: { cpuCores, ram, storage },
        accessControl: {
          requireEmailAuth,
          publicAccess,
          restrictToTeamMembers,
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
    if (selectedMemberIds.length === 0) return
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
    if (!content) return
    createCommentMutation.mutate(
      {
        content,
        position: {
          pageUrl: globalThis.location.href,
          anchor: 'project-page',
          normX: 0,
          normY: 0,
          anchorOffsetX: 0,
          anchorOffsetY: 0,
        },
      },
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
    const name = repoName.trim()
    if (!name) return
    createRepoMutation.mutate(
      { name },
      {
        onSuccess: (repo) => {
          setRepoName('')
          if (!deployRepo) setDeployRepo(repo.name)
          toast.success('Repository created.')
        },
        onError: (err) =>
          toast.error(err.message || 'Failed to create repository.'),
      },
    )
  }

  const handleCreateDeployment = () => {
    const repo = deployRepo.trim()
    const branch = deployBranch.trim()
    const svc = serviceName.trim()
    const build = serviceBuild.trim()
    const start = serviceStart.trim()
    if (!repo || !branch || !svc || !build || !start) return

    createDeploymentMutation.mutate(
      {
        repo,
        branch,
        commit: deployCommit.trim() || undefined,
        services: {
          [svc]: {
            root: serviceRoot.trim() || undefined,
            install: serviceInstall.trim() || undefined,
            build,
            start,
            depends: serviceDepends
              .split(',')
              .map((d) => d.trim())
              .filter(Boolean),
          },
        },
      },
      {
        onSuccess: () => toast.success('Deployment created.'),
        onError: (err) =>
          toast.error(err.message || 'Failed to create deployment.'),
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
              <Input
                id="cpu-cores"
                type="number"
                min={1}
                max={16}
                value={cpuCores}
                onChange={(e) =>
                  setCpuCores(Math.max(1, Math.min(16, Number(e.target.value))))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ram">RAM (GB)</Label>
              <Input
                id="ram"
                type="number"
                min={1}
                max={64}
                value={ram}
                onChange={(e) =>
                  setRam(Math.max(1, Math.min(64, Number(e.target.value))))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storage">Storage (GB)</Label>
              <Input
                id="storage"
                type="number"
                min={10}
                max={500}
                value={storage}
                onChange={(e) =>
                  setStorage(
                    Math.max(10, Math.min(500, Number(e.target.value))),
                  )
                }
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5">
              <div>
                <p className="text-sm font-medium">Require Email Auth</p>
                <p className="text-xs text-muted-foreground">
                  Ask email verification before access.
                </p>
              </div>
              <Switch
                checked={requireEmailAuth}
                onCheckedChange={setRequireEmailAuth}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5">
              <div>
                <p className="text-sm font-medium">Public Access</p>
                <p className="text-xs text-muted-foreground">
                  Make project publicly accessible.
                </p>
              </div>
              <Switch
                checked={publicAccess}
                onCheckedChange={setPublicAccess}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5">
              <div>
                <p className="text-sm font-medium">Restrict to Team Members</p>
                <p className="text-xs text-muted-foreground">
                  Only assigned members can access this project.
                </p>
              </div>
              <Switch
                checked={restrictToTeamMembers}
                onCheckedChange={setRestrictToTeamMembers}
              />
            </div>
          </div>
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

              {availableMembers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No available members to add.
                </p>
              ) : (
                <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
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
                  {addMembersMutation.isPending ? 'Adding...' : 'Add Members'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {project.teamMembers.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">
              No project members yet.
            </p>
          ) : (
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
                {createCommentMutation.isPending
                  ? 'Posting...'
                  : 'Post Comment'}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {(commentsData?.data ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No comments for this project yet.
              </p>
            ) : (
              commentsData?.data.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-border/60 px-3 py-2.5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{item.userId}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.position.pageUrl}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <GitBranch className="h-4 w-4" />
            Repositories
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              restoreStateMutation.mutate(undefined, {
                onSuccess: (res) =>
                  toast.success(
                    `Restored ${res.restoredRepos} repos and ${res.restoredDeployments} deployments.`,
                  ),
                onError: (err) =>
                  toast.error(err.message || 'Failed to restore agent state.'),
              })
            }
            disabled={restoreStateMutation.isPending}
          >
            {restoreStateMutation.isPending
              ? 'Restoring...'
              : 'Restore Agent State'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="Repository name"
            />
            <Button
              onClick={handleCreateRepo}
              disabled={createRepoMutation.isPending || !repoName.trim()}
            >
              {createRepoMutation.isPending ? 'Creating...' : 'Create Repo'}
            </Button>
          </div>

          {(repos ?? []).length === 0 ? (
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Repository</Label>
              <Select value={deployRepo} onValueChange={setDeployRepo}>
                <SelectTrigger>
                  <SelectValue placeholder="Select repository" />
                </SelectTrigger>
                <SelectContent>
                  {repos.map((repo) => (
                    <SelectItem key={repo.id} value={repo.name}>
                      {repo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Branch</Label>
              <Input
                value={deployBranch}
                onChange={(e) => setDeployBranch(e.target.value)}
                placeholder="main"
              />
            </div>
            <div className="space-y-2">
              <Label>Commit (optional)</Label>
              <Input
                value={deployCommit}
                onChange={(e) => setDeployCommit(e.target.value)}
                placeholder="a1b2c3d"
              />
            </div>
            <div className="space-y-2">
              <Label>Service name</Label>
              <Input
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="app"
              />
            </div>
            <div className="space-y-2">
              <Label>Root (optional)</Label>
              <Input
                value={serviceRoot}
                onChange={(e) => setServiceRoot(e.target.value)}
                placeholder="./apps/api"
              />
            </div>
            <div className="space-y-2">
              <Label>Install (optional)</Label>
              <Input
                value={serviceInstall}
                onChange={(e) => setServiceInstall(e.target.value)}
                placeholder="npm install"
              />
            </div>
            <div className="space-y-2">
              <Label>Build command</Label>
              <Input
                value={serviceBuild}
                onChange={(e) => setServiceBuild(e.target.value)}
                placeholder="npm run build"
              />
            </div>
            <div className="space-y-2">
              <Label>Start command</Label>
              <Input
                value={serviceStart}
                onChange={(e) => setServiceStart(e.target.value)}
                placeholder="npm run start"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Depends (comma-separated, optional)</Label>
              <Input
                value={serviceDepends}
                onChange={(e) => setServiceDepends(e.target.value)}
                placeholder="database, redis"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleCreateDeployment}
              disabled={
                createDeploymentMutation.isPending ||
                !deployRepo ||
                !deployBranch.trim() ||
                !serviceName.trim() ||
                !serviceBuild.trim() ||
                !serviceStart.trim()
              }
            >
              {createDeploymentMutation.isPending
                ? 'Deploying...'
                : 'Create Deployment'}
            </Button>
          </div>

          <div className="space-y-2">
            {deployments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No deployments for this project yet.
              </p>
            ) : (
              deployments.map((deployment) => (
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
                        {new Date(deployment.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          deployment.status === 'deployed'
                            ? 'default'
                            : 'secondary'
                        }
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
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() =>
                          deleteDeploymentMutation.mutate(
                            {
                              repo: deployment.repo,
                              branch: deployment.branch,
                            },
                            {
                              onSuccess: () =>
                                toast.success('Deployment removed.'),
                              onError: (err) =>
                                toast.error(
                                  err.message || 'Failed to remove deployment.',
                                ),
                            },
                          )
                        }
                        disabled={deleteDeploymentMutation.isPending}
                        className="text-muted-foreground hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
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
            )}
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
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
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
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete Project'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
