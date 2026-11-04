import { useId, useState } from "react"
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
  const inputId = useId()
  const [typedName, setTypedName] = useState("")

  return (
    <AlertDialog onOpenChange={() => setTypedName("")}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            This can't be undone. Type{" "}
            <span className="font-medium text-foreground">{name}</span> to
            confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          id={inputId}
          aria-label={placeholder}
          value={typedName}
          onChange={(event) => setTypedName(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={typedName !== name || isPending}
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
