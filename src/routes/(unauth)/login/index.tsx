import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/(unauth)/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Button>Se connecter</Button>
      <Link to="/register">Se connecter</Link>
    </div>
  )
}
