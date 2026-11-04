import { Link } from "@tanstack/react-router"
import { EmptyState } from "@/components/common/empty-state"
import { Button } from "@/components/ui/button"

export function NotFoundState() {
  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <EmptyState
        title="End of the line"
        description="This page doesn't exist. Check the address, or head back home."
        action={
          <Button asChild>
            <Link to="/">Go home</Link>
          </Button>
        }
      />
    </div>
  )
}
