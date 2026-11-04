import { Link } from "@tanstack/react-router"
import { motion, useReducedMotion } from "motion/react"
import { useEffect, useId, useRef } from "react"
import { spring } from "@/lib/motion"
import { cn } from "@/lib/utils/cn"

export const PROJECT_TABS = [
  "deployments",
  "repositories",
  "databases",
  "comments",
  "team",
  "settings",
] as const

export type ProjectTab = (typeof PROJECT_TABS)[number]

const TAB_LABELS: Record<ProjectTab, string> = {
  deployments: "Deployments",
  repositories: "Repositories",
  databases: "Databases",
  comments: "Comments",
  team: "Team",
  settings: "Settings",
}

type ProjectTabsProps = {
  projectId: string
  current: ProjectTab
}

export function ProjectTabs({ projectId, current }: ProjectTabsProps) {
  const indicatorId = useId()
  const listRef = useRef<HTMLUListElement>(null)
  const currentRef = useRef<HTMLLIElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // On a narrow screen the current tab may sit past the edge of the list.
  useEffect(() => {
    const list = listRef.current
    const item = currentRef.current
    if (!list || !item) return
    list.scrollTo({
      left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    })
  }, [current, shouldReduceMotion])

  return (
    <nav
      aria-label="Project sections"
      className="material scroll-edge sticky top-14 z-20 -mx-4 mb-6 px-4 sm:-mx-8 sm:px-8 lg:top-0"
    >
      <ul
        ref={listRef}
        className="relative flex [scrollbar-width:none] gap-5 overflow-x-auto shadow-[inset_0_-1px_0_var(--border)] max-sm:[mask-image:linear-gradient(to_right,black_calc(100%-2rem),transparent)] max-sm:pe-8"
      >
        {PROJECT_TABS.map((tab) => {
          const isCurrent = tab === current
          return (
            <li
              key={tab}
              ref={isCurrent ? currentRef : undefined}
              className="relative shrink-0"
            >
              <Link
                to="/projects/$projectId"
                params={{ projectId }}
                search={{ tab }}
                resetScroll={false}
                aria-current={isCurrent ? "page" : undefined}
                className={cn(
                  "block rounded-sm py-3 font-medium transition-colors duration-100 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                  isCurrent
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {TAB_LABELS[tab]}
              </Link>
              {isCurrent && (
                <motion.span
                  layoutId={indicatorId}
                  transition={spring}
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground"
                />
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
