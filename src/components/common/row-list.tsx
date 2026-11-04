import type { ComponentProps } from "react"
import { cn } from "@/lib/utils/cn"

export function RowList({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "overflow-hidden rounded-xl bg-card shadow-control ring-1 ring-border",
        className
      )}
      {...props}
    />
  )
}

// The hairline stops short of the edges, so it groups instead of fencing.
export function Row({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "relative not-first:before:absolute not-first:before:inset-x-4 not-first:before:top-0 not-first:before:h-px not-first:before:bg-border",
        className
      )}
      {...props}
    />
  )
}

export const ROW_CONTENT = "flex min-h-14 items-center gap-3 px-4 py-2.5"

export const ROW_LINK = cn(
  ROW_CONTENT,
  "transition-colors duration-100 outline-none hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset active:bg-accent"
)
