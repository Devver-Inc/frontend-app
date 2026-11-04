import { Check, Copy } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

const COPIED_FEEDBACK_MS = 1500

type CopyButtonProps = {
  value: string
  label: string
}

export function CopyButton({ value, label }: CopyButtonProps) {
  const [isCopied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      toast.error("Clipboard access is blocked. Copy the text by hand.")
      return
    }
    setCopied(true)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS)
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={isCopied ? "Copied" : label}
      onClick={() => void copy()}
    >
      {isCopied ? <Check className="text-live" /> : <Copy />}
    </Button>
  )
}
