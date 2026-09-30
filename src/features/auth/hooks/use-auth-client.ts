import { useRouteContext } from "@tanstack/react-router"

export const useAuthClient = () =>
  useRouteContext({ from: "__root__", select: (context) => context.auth })
