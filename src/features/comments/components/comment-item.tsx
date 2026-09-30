import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Comment } from "@/features/comments/types/comment.types"
import { formatDateTime } from "@/lib/utils/format-date"

export function CommentItem({ comment }: { comment: Comment }) {
  const { author } = comment
  const authorLabel = author?.name ?? author?.email ?? "Guest"

  return (
    <div className="rounded-lg border border-border/60 px-3 py-2.5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={author?.avatarUrl ?? undefined} />
            <AvatarFallback>
              {authorLabel.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium">{authorLabel}</p>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              {comment.repo && (
                <Badge variant="secondary">{comment.repo}</Badge>
              )}
              {comment.branch && (
                <Badge variant="outline">{comment.branch}</Badge>
              )}
              {author?.email && (
                <span className="text-xs text-muted-foreground">
                  {author.email}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-1">
          {comment.position?.pageUrl && (
            <a
              href={comment.position.pageUrl}
              target="_blank"
              rel="noreferrer"
              className="max-w-[240px] truncate text-xs text-primary hover:underline"
              title="Open comment position"
            >
              View location
            </a>
          )}
          <p className="text-xs text-muted-foreground">
            {formatDateTime(comment.createdAt)}
          </p>
        </div>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">{comment.content}</p>
    </div>
  )
}
