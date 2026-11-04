// Runs the real app against demo/mock-api.mjs, with a fake signed-in user.
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { createServer, loadConfigFromFile } from "vite"
import { startMockApi } from "./mock-api.mjs"

const API_PORT = 3100
const APP_URL = "http://localhost:5173"

// Set here so a fresh clone runs without a .env, and a real .env is never used.
Object.assign(process.env, {
  VITE_API_BASE_URL: `http://localhost:${API_PORT}/api/v1`,
  VITE_LOGTO_ENDPOINT: "http://localhost:5173/demo-logto",
  VITE_LOGTO_APP_ID: "demo",
  VITE_LOGTO_CALLBACK_URI: `${APP_URL}/callback`,
  VITE_LOGTO_SIGN_OUT_URI: APP_URL,
})

const root = dirname(import.meta.dirname)
process.chdir(root)

const authClient = readFileSync(join(root, "demo/auth-client.mjs"), "utf8")
const selectOrganization = `if (typeof localStorage !== "undefined" && !localStorage.getItem("organization")) localStorage.setItem("organization", JSON.stringify({ state: { currentOrganizationId: "org-1" }, version: 0 }))\n`

const DEVTOOLS_STUB = "\0demo-devtools"

const demoPlugin = {
  name: "devver-demo",
  enforce: "pre",
  // The devtools button sits on top of the user menu.
  resolveId(source) {
    if (source === "@tanstack/react-devtools") return DEVTOOLS_STUB
  },
  load(id) {
    if (id === DEVTOOLS_STUB)
      return "export const TanStackDevtools = () => null"

    const isAuthClient = id
      .split("?")[0]
      .endsWith("/src/lib/auth/logto-auth-client.ts")
    if (isAuthClient && this.environment.name === "client") {
      return selectOrganization + authClient
    }
  },
}

// The devtools console pipe sends each warning back and forth between the
// browser and the server until the logs fill the disk.
const withoutDevtools = async (plugins = []) => {
  const resolved = await Promise.all(plugins)
  const flat = await Promise.all(
    resolved.map((plugin) =>
      Array.isArray(plugin) ? withoutDevtools(plugin) : plugin ? [plugin] : []
    )
  )
  return flat.flat().filter(({ name }) => !/devtools/i.test(name))
}

const { config } = await loadConfigFromFile(
  { command: "serve", mode: "development" },
  join(root, "vite.config.ts")
)

await startMockApi(API_PORT)
const server = await createServer({
  ...config,
  configFile: false,
  plugins: [demoPlugin, ...(await withoutDevtools(config.plugins))],
})
await server.listen()
server.printUrls()
