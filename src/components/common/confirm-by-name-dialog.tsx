import { useState } from "react"
import type { ReactNode } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"

type ConfirmByNameDialogProps = {
  trigger: ReactNode
  title: string
  name: string | undefined
  placeholder: string
  actionLabel: string
  isPending: boolean
  onConfirm: () => void
}

export function ConfirmByNameDialog({
  trigger,
  title,
  name,
  placeholder,
  actionLabel,
  isPending,
  onConfirm,
}: ConfirmByNameDialogProps) {
  const [typedName, setTypedName] = useState("")

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Type{" "}
            <span className="font-mono font-semibold text-foreground">
              {name}
            </span>{" "}
            to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          value={typedName}
          onChange={(event) => setTypedName(event.target.value)}
          placeholder={placeholder}
        />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setTypedName("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={typedName !== name || isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
