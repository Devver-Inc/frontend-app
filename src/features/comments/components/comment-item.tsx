import { ExternalLink } from "lucide-react"
import { ROW_CONTENT, Row } from "@/components/common/row-list"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Comment } from "@/features/comments/types/comment.types"
import { cn } from "@/lib/utils/cn"
import { formatDateTime } from "@/lib/utils/format-date"
import { getInitials } from "@/lib/utils/get-initials"

export function CommentItem({ comment }: { comment: Comment }) {
  const { author, repo, branch, position } = comment
  const authorLabel = author?.name ?? author?.email ?? "Guest"
  const origin = [repo, branch].filter(Boolean).join(" / ")

  return (
    <Row>
      <div className={cn(ROW_CONTENT, "items-start")}>
        <Avatar className="size-8">
          <AvatarImage
            src={author?.avatarUrl ?? undefined}
            className="object-cover"
          />
          <AvatarFallback className="text-xs font-medium">
            {getInitials(authorLabel)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <p className="font-medium">{authorLabel}</p>
            <time
              dateTime={comment.createdAt}
              className="text-sm text-muted-foreground"
            >
              {formatDateTime(comment.createdAt)}
            </time>
          </div>
          <p className="mt-0.5 break-words whitespace-pre-wrap">
            {comment.content}
          </p>
          {(origin || position?.pageUrl) && (
            <p className="mt-1.5 flex flex-wrap items-center gap-x-4 text-sm text-muted-foreground">
              {origin && <span className="min-w-0 truncate">{origin}</span>}
              {position?.pageUrl && (
                <a
                  href={position.pageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                >
                  View on preview
                  <ExternalLink className="size-3.5" />
                </a>
              )}
            </p>
          )}
        </div>
      </div>
    </Row>
  )
}
