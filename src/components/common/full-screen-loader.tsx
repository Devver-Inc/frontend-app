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
    <div className={cn("grid h-screen place-items-center", className)}>
      <LoaderCircle size={36} className={cn("animate-spin", iconClassName)} />
    </div>
  )
}
