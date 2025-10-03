import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)')({
  head: () => ({
    meta: [{ title: 'Dashboard - Devver' }],
  }),
  beforeLoad: () => {
    // You can add logic here if needed, e.g., redirect if not authenticated
    // const isAuthenticated = useAuthStore.getState().isAuthenticated
    // if (!isAuthenticated) {
    //   throw redirect({ to: '/login' })
    // }
    // For now, it does nothing
  },
  component: Outlet,
})
