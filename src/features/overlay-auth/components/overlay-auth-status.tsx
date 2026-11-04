import { LoaderCircle } from "lucide-react"

export function OverlayAuthStatus({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="grid h-dvh place-items-center bg-background text-foreground"
    >
      <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
        <LoaderCircle className="size-6 animate-spin motion-reduce:animate-none" />
        <span>{message}</span>
      </div>
    </div>
  )
}
