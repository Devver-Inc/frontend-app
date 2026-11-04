import { Link } from "@tanstack/react-router"
import { EmptyState } from "@/components/common/empty-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function ProjectDetailsSkeleton() {
  return (
    <div role="status" aria-label="Loading project" className="space-y-8">
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-10 w-full max-w-lg" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  )
}

export function ProjectLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      className="py-12"
      title="This project didn't load"
      description="Devver couldn't reach it. Check your connection, then try again."
      action={<Button onClick={onRetry}>Try again</Button>}
    />
  )
}

export function ProjectNotFound() {
  return (
    <EmptyState
      className="py-12"
      title="Project not found"
      description="It may have been deleted, or it belongs to another organization."
      action={
        <Button asChild>
          <Link to="/projects">See all projects</Link>
        </Button>
      }
    />
  )
}
