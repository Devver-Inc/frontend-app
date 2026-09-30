import { LoaderCircle } from "lucide-react"

export function OverlayAuthStatus({ message }: { message: string }) {
  return (
    <div className="grid h-screen place-items-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
        <LoaderCircle size={32} className="animate-spin" />
        <span>{message}</span>
      </div>
    </div>
  )
}
