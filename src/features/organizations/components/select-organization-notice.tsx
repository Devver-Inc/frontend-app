import { Link } from "@tanstack/react-router"
import { EmptyState } from "@/components/common/empty-state"
import { Button } from "@/components/ui/button"

export function SelectOrganizationNotice({ message }: { message: string }) {
  return (
    <EmptyState
      className="pt-10"
      title="No organization selected"
      description={message}
      action={
        <Button variant="outline" asChild>
          <Link to="/organizations/new">Create organization</Link>
        </Button>
      }
    />
  )
}
