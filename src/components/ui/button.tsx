import * as React from "react"
import { cva } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import type { VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils/cn"

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-[background-color,color,box-shadow,scale] duration-100 ease-out outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[.98] disabled:pointer-events-none disabled:opacity-45 aria-invalid:ring-2 aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[var(--sheen),var(--shadow-control)] hover:bg-[color-mix(in_srgb,var(--primary)_84%,var(--background))]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-control hover:bg-[color-mix(in_srgb,var(--destructive)_88%,var(--foreground))] focus-visible:ring-destructive",
        "destructive-outline":
          "bg-card text-destructive shadow-[inset_0_0_0_1px_var(--input),var(--shadow-control)] hover:bg-[color-mix(in_srgb,var(--destructive)_8%,var(--card))] focus-visible:ring-destructive",
        outline:
          "bg-card text-foreground shadow-[inset_0_0_0_1px_var(--input),var(--shadow-control)] hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
        ghost: "text-foreground hover:bg-accent",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-3.5 has-[>svg]:px-3 pointer-coarse:h-10",
        xs: "h-7 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2 pointer-coarse:h-9",
        lg: "h-10 px-5 has-[>svg]:px-4",
        icon: "size-9 pointer-coarse:size-10",
        "icon-xs": "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8 rounded-md",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
