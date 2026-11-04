import { Link } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { EmptyState } from "@/components/common/empty-state"
import { Button } from "@/components/ui/button"

export function NoOrganizationSelected() {
  return (
    <EmptyState
      className="pt-10"
      title="Start with an organization"
      description="Your projects, deployments, and members all live inside one."
      action={
        <Button asChild>
          <Link to="/organizations/new">
            <Plus />
            Create organization
          </Link>
        </Button>
      }
    />
  )
}
