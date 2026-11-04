import * as React from "react"

import { cn } from "@/lib/utils/cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-lg bg-card px-3 text-base shadow-[inset_0_0_0_1px_var(--input),var(--shadow-control)] transition-shadow duration-100 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55 md:text-sm pointer-coarse:h-10",
        "focus-visible:shadow-[inset_0_0_0_1px_var(--ring)] focus-visible:ring-3 focus-visible:ring-ring/15",
        "aria-invalid:shadow-[inset_0_0_0_1.5px_var(--destructive)] aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
