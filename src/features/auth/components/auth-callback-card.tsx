import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

type AuthCallbackCardProps = {
  title: string
  description: string
  actionLabel: string
}

export function AuthCallbackCard({
  title,
  description,
  actionLabel,
}: AuthCallbackCardProps) {
  return (
    <div className="grid h-screen place-items-center px-4">
      <div className="page-shell max-w-md space-y-4 px-8 py-10 text-center">
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
        <Link to="/">
          <Button>{actionLabel}</Button>
        </Link>
      </div>
    </div>
  )
}
