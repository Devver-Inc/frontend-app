import { zodResolver } from "@hookform/resolvers/zod"
import { MessageSquare } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CommentItem } from "@/features/comments/components/comment-item"
import { useCreateProjectComment } from "@/features/comments/hooks/use-create-project-comment"
import { useProjectComments } from "@/features/comments/hooks/use-project-comments"
import { createCommentSchema } from "@/features/comments/schemas/comment.schema"

export function ProjectCommentsCard({ projectId }: { projectId: string }) {
  const { data: comments } = useProjectComments(projectId, { pageSize: 50 })
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="h-4 w-4" />
          Comments
        </CardTitle>
        <Badge variant="secondary">{comments?.meta.totalItemsCount ?? 0}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <Controller
          name="content"
          control={form.control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="project-comment">New Comment</Label>
              <Textarea
                {...field}
                id="project-comment"
                placeholder="Leave a note for your team..."
                rows={3}
              />
              <div className="flex justify-end">
                <Button
                  onClick={() => void onPost()}
                  disabled={createComment.isPending || !form.formState.isValid}
                >
                  {createComment.isPending ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          )}
        />

        <div className="space-y-2">
          {comments?.data.length ? (
            comments.data.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No comments for this project yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
