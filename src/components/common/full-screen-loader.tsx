import { LoaderCircle } from "lucide-react"
import { cn } from "@/lib/utils/cn"

type FullScreenLoaderProps = {
  className?: string
  iconClassName?: string
}

export function FullScreenLoader({
  className,
  iconClassName,
}: FullScreenLoaderProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("grid h-dvh place-items-center", className)}
    >
      <LoaderCircle
        className={cn(
          "size-6 animate-spin text-muted-foreground motion-reduce:animate-none",
          iconClassName
        )}
      />
    </div>
  )
}
