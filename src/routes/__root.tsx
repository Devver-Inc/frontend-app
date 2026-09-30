import { TanStackDevtools } from "@tanstack/react-devtools"
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools"
import {
  ClientOnly,
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import type { ReactNode } from "react"
import { Toaster } from "sonner"
import { ThemeScript } from "@/components/layout/theme-script"
import { ThemeSync } from "@/components/layout/theme-sync"
import appCss from "@/styles/app.css?url"
import type { RouterContext } from "@/types/router-context.types"

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "UTF-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { name: "theme-color", content: "#000000" },
      {
        name: "description",
        content: "Web site created using create-tsrouter-app",
      },
      { title: "Devver" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/logo192.png" },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      <ThemeSync />
      {/* SPA mode serves one prerendered shell for every URL: pages only
          render once hydrated, so the shell matches whatever route loads. */}
      <ClientOnly>
        <Outlet />
      </ClientOnly>
      <Toaster richColors position="bottom-right" />
    </>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    // ThemeScript sets the `dark` class of <html> before hydration.
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{ position: "bottom-left" }}
          plugins={[
            {
              name: "TanStack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            { name: "TanStack Query", render: <ReactQueryDevtoolsPanel /> },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
