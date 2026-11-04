import { Terminal } from "lucide-react"
import { useState } from "react"
import { CopyButton } from "@/components/common/copy-button"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCreateGitToken } from "@/features/deployments/hooks/use-create-git-token"

type GitPushDialogProps = {
  projectId: string
  repo: string
  isPodReady: boolean
}

export function GitPushDialog({
  projectId,
  repo,
  isPodReady,
}: GitPushDialogProps) {
  const [open, setOpen] = useState(false)
  const createToken = useCreateGitToken(projectId)
  const command = createToken.data
    ? `git push ${createToken.data.pushUrl} HEAD`
    : null

  // A token lasts an hour: each opening asks for a fresh one.
  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (nextOpen) createToken.mutate(repo)
    else createToken.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" disabled={!isPodReady}>
          <Terminal />
          <span className="max-sm:sr-only">Push code</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Push code to {repo}</DialogTitle>
          <DialogDescription>
            Run this from your repository. The link contains a token that
            expires in one hour, so keep it private.
          </DialogDescription>
        </DialogHeader>
        {command ? (
          <div className="flex items-start gap-2 rounded-lg bg-terminal p-3 text-terminal-foreground">
            <code className="min-w-0 flex-1 font-mono text-xs leading-relaxed break-all">
              {command}
            </code>
            <CopyButton value={command} label="Copy push command" />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {createToken.isError
              ? "The token could not be created. Close this dialog and try again."
              : "Creating a token…"}
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
