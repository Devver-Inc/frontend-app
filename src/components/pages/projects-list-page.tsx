import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { FolderKanban, Plus, Search } from 'lucide-react'
import { useState } from 'react'

import type { ProjectLight } from '@/lib/api/projects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getProjects } from '@/lib/api/projects'

const PROJECTS_PAGE_SIZE = 12

export function ProjectsListPage() {
  const [search, setSearch] = useState('')
  const [searchSubmitted, setSearchSubmitted] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      'projects',
      { page, pageSize: PROJECTS_PAGE_SIZE, search: searchSubmitted },
    ],
    queryFn: () =>
      getProjects({
        page,
        pageSize: PROJECTS_PAGE_SIZE,
        search: searchSubmitted || undefined,
      }),
  })

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchSubmitted(search)
    setPage(1)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
              <FolderKanban className="h-5 w-5" aria-hidden />
            </span>
            Projects
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Manage your deployments and environments
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/projects/new" className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" aria-hidden />
            Create project
          </Link>
        </Button>
      </section>

      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col gap-2 sm:flex-row sm:items-center"
        role="search"
      >
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Search projects"
          />
        </div>
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      {isLoading && (
        <p
          className="text-sm text-[var(--muted-foreground)]"
          aria-live="polite"
        >
          Loading projects…
        </p>
      )}

      {isError && (
        <p className="text-sm text-[var(--destructive)]" role="alert">
          {error instanceof Error ? error.message : 'Failed to load projects'}
        </p>
      )}

      {data && (
        <>
          <p className="text-sm text-[var(--muted-foreground)]">
            {data.meta.totalItemsCount} project
            {data.meta.totalItemsCount !== 1 ? 's' : ''}
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {data.data.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </ul>
          {data.data.length === 0 && (
            <p className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-8 text-center text-[var(--muted-foreground)]">
              No projects yet. Create your first project to get started.
            </p>
          )}
          {data.meta.totalPagesCount > 1 && (
            <nav
              className="flex items-center justify-center gap-2"
              aria-label="Pagination"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                aria-label="Previous page"
              >
                Previous
              </Button>
              <span className="text-sm text-[var(--muted-foreground)]">
                Page {data.meta.currentPage} of {data.meta.totalPagesCount}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= data.meta.totalPagesCount}
                onClick={() => setPage((p) => p + 1)}
                aria-label="Next page"
              >
                Next
              </Button>
            </nav>
          )}
        </>
      )}
    </div>
  )
}

function ProjectCard({ project }: { project: ProjectLight }) {
  return (
    <li>
      <Link
        to="/projects/$projectId"
        params={{ projectId: project.id }}
        className="block rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition-colors hover:border-[var(--ring)] hover:bg-[var(--accent)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        <h2 className="font-semibold text-[var(--card-foreground)] line-clamp-1">
          {project.name}
        </h2>
        {project.description && (
          <p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">
            {project.description}
          </p>
        )}
        <p className="mt-2 text-xs text-[var(--muted-foreground)]">
          Created {formatDate(project.createdAt)}
        </p>
      </Link>
    </li>
  )
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'today'
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return d.toLocaleDateString()
  } catch {
    return iso
  }
}
