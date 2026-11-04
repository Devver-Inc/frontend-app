import * as React from "react"

import { cn } from "@/lib/utils/cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-lg bg-card px-3 py-2.5 text-base shadow-[inset_0_0_0_1px_var(--input),var(--shadow-control)] transition-shadow duration-100 outline-none placeholder:text-muted-foreground focus-visible:shadow-[inset_0_0_0_1.5px_var(--ring)] focus-visible:ring-3 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-55 aria-invalid:shadow-[inset_0_0_0_1.5px_var(--destructive)] aria-invalid:ring-destructive/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
