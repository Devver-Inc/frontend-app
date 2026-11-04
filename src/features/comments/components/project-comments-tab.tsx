import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { EmptyState } from "@/components/common/empty-state"
import { RowList } from "@/components/common/row-list"
import { SearchInput } from "@/components/common/search-input"
import { Section } from "@/components/common/section"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CommentItem } from "@/features/comments/components/comment-item"
import { useCreateProjectComment } from "@/features/comments/hooks/use-create-project-comment"
import { useProjectComments } from "@/features/comments/hooks/use-project-comments"
import { createCommentSchema } from "@/features/comments/schemas/comment.schema"
import { useProjectRepos } from "@/features/deployments/hooks/use-project-repos"
import { useDebouncedValue } from "@/hooks/use-debounced-value"

const SEARCH_DEBOUNCE_MS = 300
const ALL_REPOSITORIES = "all"

export function ProjectCommentsTab({ projectId }: { projectId: string }) {
  const [search, setSearch] = useState("")
  const [repo, setRepo] = useState(ALL_REPOSITORIES)
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS)
  const isFiltered = search.trim() !== "" || repo !== ALL_REPOSITORIES

  const { data: repos = [] } = useProjectRepos(projectId)
  const { data: comments } = useProjectComments(projectId, {
    pageSize: 50,
    search: debouncedSearch.trim() || undefined,
    repo: repo === ALL_REPOSITORIES ? undefined : repo,
  })
  const createComment = useCreateProjectComment(projectId)
  const form = useForm({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { content: "" },
    mode: "onChange",
  })

  const onPost = form.handleSubmit((input) =>
    createComment.mutate(input, {
      onSuccess: () => {
        form.reset()
        toast.success("Comment posted.")
      },
    })
  )

  return (
    <Section
      title="Comments"
      description="Notes from your team, and feedback left on the previews."
    >
      <form onSubmit={onPost} className="space-y-2">
        <Controller
          name="content"
          control={form.control}
          render={({ field }) => (
            <Textarea
              {...field}
              aria-label="New comment"
              placeholder="Leave a note for your team"
              rows={3}
            />
          )}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={createComment.isPending || !form.formState.isValid}
          >
            {createComment.isPending ? "Posting…" : "Post comment"}
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-3 pt-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search comments"
          className="min-w-48 flex-1"
        />
        {repos.length > 0 && (
          <Select value={repo} onValueChange={setRepo}>
            <SelectTrigger aria-label="Filter by repository" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_REPOSITORIES}>All repositories</SelectItem>
              {repos.map(({ id, name }) => (
                <SelectItem key={id} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {comments?.data.length ? (
        <>
          <RowList>
            {comments.data.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </RowList>
          {comments.meta.totalItemsCount > comments.data.length && (
            <p className="text-sm text-muted-foreground">
              Showing the latest {comments.data.length} of{" "}
              {comments.meta.totalItemsCount} comments.
            </p>
          )}
        </>
      ) : comments && isFiltered ? (
        <p className="py-4 text-sm text-muted-foreground">
          No comment matches these filters.
        </p>
      ) : (
        comments && (
          <EmptyState
            title="No comments yet"
            description="Share a preview and feedback lands here, with the page it was left on."
          />
        )
      )}
    </Section>
  )
}
