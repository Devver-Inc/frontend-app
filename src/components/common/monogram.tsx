import { cn } from "@/lib/utils/cn"

const SIZES = {
  xs: "size-5 rounded-sm text-[.6875rem]",
  sm: "size-6 rounded-md text-xs",
  md: "size-8 rounded-lg text-sm",
  lg: "size-10 rounded-lg text-base",
}

type MonogramProps = {
  name: string
  size?: keyof typeof SIZES
  className?: string
}

// The sign of a project or an organization. Neutral on purpose: colour is kept
// for the map, where it tells lines apart.
export function Monogram({ name, size = "md", className }: MonogramProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center bg-linear-to-b from-card to-secondary font-medium text-foreground uppercase shadow-control ring-1 ring-border ring-inset",
        SIZES[size],
        className
      )}
    >
      {name.trim().charAt(0)}
    </span>
  )
}
