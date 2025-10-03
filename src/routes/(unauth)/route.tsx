import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(unauth)')({
  beforeLoad: () => {
    // You can add logic here if needed, e.g., redirect if authenticated
    // const isAuthenticated = useAuthStore.getState().isAuthenticated
    // if (isAuthenticated) {
    //   throw redirect({ to: '/' })
    // }
    // For now, it does nothing
  },
  component: Outlet,
})
