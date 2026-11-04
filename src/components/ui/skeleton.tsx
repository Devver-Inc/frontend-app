import { cn } from "@/lib/utils/cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-lg bg-[color-mix(in_srgb,var(--foreground)_8%,transparent)] motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
