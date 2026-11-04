import { Link } from "@tanstack/react-router"
import { Logo } from "@/components/common/logo"
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
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <Logo className="mb-12" />
        <div>
          <h1 className="text-title">{title}</h1>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
        <Button asChild>
          <Link to="/">{actionLabel}</Link>
        </Button>
      </div>
    </main>
  )
}
