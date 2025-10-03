import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/(unauth)/register/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Button>S'inscrire</Button>
      <Link to="/login">Se connecter</Link>
    </div>
  )
}
