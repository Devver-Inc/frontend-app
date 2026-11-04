import { cn } from "@/lib/utils/cn"

type LogoProps = {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <span
      role="img"
      aria-label="Devver"
      className={cn("flex items-end gap-px", className)}
    >
      <img src="/favicon.png" alt="" className="h-5 w-auto dark:hidden" />
      <img src="/logo.png" alt="" className="hidden h-5 w-auto dark:block" />
      <span
        aria-hidden
        className="text-[1.1875rem] leading-none font-semibold tracking-[-.03em]"
      >
        evver
      </span>
    </span>
  )
}
