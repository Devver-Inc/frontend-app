import { Link } from "@tanstack/react-router"
import { Building2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NoOrganizationSelected() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="page-shell px-8 py-10 text-center">
        <Building2 className="mx-auto h-12 w-12 text-muted-foreground/40" />
        <h2 className="mt-4 text-lg font-semibold">No organization selected</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Create or select an organization to get started.
        </p>
        <Link to="/organizations/new">
          <Button className="mt-4 gap-1.5">
            <Plus className="h-4 w-4" />
            Create Organization
          </Button>
        </Link>
      </div>
    </div>
  )
}
