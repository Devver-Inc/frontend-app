import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  // Fixed port: it is part of the redirect URIs registered in Logto.
  server: {
    port: 5173,
    strictPort: true,
    allowedHosts: ["front.dev.vlxx.fr"],
  },
  plugins: [
    devtools(),
    tailwindcss(),
    // SPA mode: the build only prerenders the document shell
    // (dist/client/_shell.html), every route renders in the browser, where the
    // Logto session lives. nginx serves it as static files (nginx.conf).
    tanstackStart({ spa: { enabled: true } }),
    viteReact(),
  ],
})

export default config
