import type { ReactNode } from "react"
import { AnimatePresence, motion } from "motion/react"
import { spring } from "@/lib/motion"

type UnsavedChangesBarProps = {
  isVisible: boolean
  title: string
  description: string
  children: ReactNode
}

export function UnsavedChangesBar({
  isVisible,
  title,
  description,
  children,
}: UnsavedChangesBarProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="region"
          aria-label={title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={spring}
          className="material-raised sticky bottom-4 z-20 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl py-3 pr-3 pl-5 shadow-float"
        >
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-center gap-2">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
