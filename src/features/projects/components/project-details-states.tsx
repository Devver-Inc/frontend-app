export function ProjectDetailsSkeleton() {
  return <div className="page-shell h-64 animate-pulse" />
}

export function ProjectNotFound() {
  return (
    <div className="page-shell py-12 text-center">
      <p className="text-sm text-muted-foreground">Project not found.</p>
    </div>
  )
}
