// Sample data in the shape of the backend DTOs.
import { createServer } from "node:http"
const now = Date.now()
const ago = (d) => new Date(now - d * 864e5).toISOString()
const soon = (d) => new Date(now + d * 864e5).toISOString()
const u = (id, name, email) => ({ id, name, email, avatarUrl: null })
const me = u("u-1", "Camille Moreau", "camille@northwind.dev")
const sam = u("u-2", "Sam Okafor", "sam@northwind.dev")
const noor = u("u-3", "Noor Haddad", "noor@northwind.dev")
const leo = u("u-4", "Léo Martin", "leo@northwind.dev")
const ines = u("u-5", null, "ines@northwind.dev")
const people = [me, sam, noor, leo, ines]
const page = (data) => ({
  data,
  meta: {
    currentPage: 1,
    totalItemsCount: data.length,
    totalPagesCount: 1,
    itemsPerPage: 50,
  },
})
const org = { id: "org-1", name: "Northwind", coverImageUrl: null }
const project = (id, name, description, days) => ({
  id,
  name,
  description,
  createdAt: ago(days + 30),
  updatedAt: ago(days),
  organizationId: org.id,
  createdBy: me,
  machineConfiguration: { cpuCores: 1, ram: 1.5 },
  teamMembers: [me, sam, noor],
  overlayAccessControl: { commentPermission: "team_only" },
  databaseConfigurations: [
    {
      name: "main",
      type: "mongo",
      enabled: true,
      username: "app",
      hasPassword: true,
      replicaCount: 1,
      ram: 1,
      cpuCores: 0.5,
      storage: 10,
    },
    {
      name: "cache",
      type: "redis",
      enabled: true,
      replicaCount: 1,
      ram: 0.5,
      cpuCores: 0.25,
      storage: 1,
    },
  ],
})
const projects = [
  project("p-storefront", "Storefront", "The public shop and its checkout", 0),
  project(
    "p-billing",
    "Billing API",
    "Invoices, plans, and payment webhooks",
    2
  ),
  project("p-admin", "Back office", "Internal tools for the support team", 6),
  project("p-mobile", "Mobile gateway", "", 14),
]
const repos = [
  {
    id: "r1",
    name: "web-app",
    pushUrl: "https://git.northwind.devver.app/web-app.git",
    projectId: "p-storefront",
    createdAt: ago(20),
  },
  {
    id: "r2",
    name: "checkout-api",
    pushUrl: "https://git.northwind.devver.app/checkout-api.git",
    projectId: "p-storefront",
    createdAt: ago(18),
  },
]
const dep = (
  id,
  repo,
  branch,
  kind,
  port,
  status,
  cpu = 3,
  memory = 182e6
) => ({
  deploymentId: id,
  repo,
  branch,
  commit: id.padEnd(7, "a") + "4e1f9c2b",
  service: {
    [kind]: {
      port,
      url: `https://${branch.replaceAll("/", "-")}.${repo}.northwind.devver.app`,
    },
  },
  process: status
    ? {
        name: `${repo}-${branch.replaceAll("/", "-")}`,
        pm_id: port % 10,
        status,
        cpu,
        memory,
      }
    : null,
})
const deployments = [
  dep("d1", "web-app", "main", "web", 3001, "online"),
  dep("d2", "web-app", "feat/new-checkout", "web", 3002, "online", 12, 240e6),
  dep("d3", "web-app", "fix/cart-totals", "web", 3003, "errored", 0, 0),
  dep("d4", "web-app", "design/footer", "web", 3004, "stopped", 0, 0),
  dep("d5", "checkout-api", "main", "api", 4001, "online", 6, 310e6),
  dep("d6", "checkout-api", "feat/refunds", "api", 4002, "launching", 1, 60e6),
]
const status = {
  appName: "storefront",
  healthStatus: "Healthy",
  syncStatus: "Synced",
  timestamp: new Date().toISOString(),
  podReady: true,
  applications: [
    {
      appName: "storefront-app",
      type: "application",
      healthStatus: "Healthy",
      syncStatus: "Synced",
      operationMessage: "successfully synced",
    },
    {
      appName: "storefront-mongo",
      type: "mongo",
      healthStatus: "Progressing",
      syncStatus: "Synced",
      operationMessage: "Waiting for the replica set to elect a primary.",
    },
  ],
}
const inv = (id, invitee, role, days, extra = {}) => ({
  id,
  invitee,
  inviterId: "u-1",
  organizationId: org.id,
  organizationName: org.name,
  status: "Pending",
  createdAt: ago(1),
  expiresAt: soon(days),
  organizationRoles: [role],
  ...extra,
})
const comments = [
  {
    id: "c1",
    author: sam,
    repo: "web-app",
    branch: "feat/new-checkout",
    content:
      "The total jumps when the shipping method changes. Can we keep it steady?",
    position: {
      pageUrl:
        "https://feat-new-checkout.web-app.northwind.devver.app/checkout",
      anchor: "#total",
      normX: 0.5,
      normY: 0.4,
      anchorOffsetX: 0,
      anchorOffsetY: 0,
    },
    createdAt: ago(0.1),
  },
  {
    id: "c2",
    author: noor,
    repo: "web-app",
    branch: "main",
    content: "Nice work on the new footer.",
    position: null,
    createdAt: ago(1),
  },
  {
    id: "c3",
    author: null,
    repo: null,
    branch: null,
    content: "Could the invoice link open in a new tab?",
    position: null,
    createdAt: ago(3),
  },
]
const databases = {
  mongo: [
    { name: "shop", sizeOnDisk: 48_000_000, empty: false },
    { name: "analytics", sizeOnDisk: 1_200_000, empty: false },
    { name: "staging", sizeOnDisk: 8192, empty: true },
  ],
  redis: [
    { name: "db0", keyCount: 1284, expiringKeyCount: 312 },
    { name: "db1", keyCount: 42 },
    { name: "db2", keyCount: 0 },
  ],
}
const json = (res, body, code = 200) => {
  res.writeHead(code, { "content-type": "application/json" })
  res.end(JSON.stringify(body))
}
const sse = (res) =>
  res.writeHead(200, {
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
    connection: "keep-alive",
  })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const server = createServer(async (req, res) => {
  res.setHeader("access-control-allow-origin", "*")
  res.setHeader("access-control-allow-headers", "*")
  res.setHeader("access-control-allow-methods", "*")
  if (req.method === "OPTIONS") {
    res.writeHead(204)
    return res.end()
  }
  const url = new URL(req.url, "http://x")
  const path = url.pathname.replace("/api/v1", "")
  const m = req.method
  if (m === "GET" && path === "/projects") {
    const q = (url.searchParams.get("search") ?? "").toLowerCase()
    return json(
      res,
      page(projects.filter((p) => p.name.toLowerCase().includes(q)))
    )
  }
  if (m === "GET" && path === "/organizations") return json(res, org)
  if (m === "GET" && path === "/organizations/details")
    return json(res, {
      ...org,
      owner: me,
      admins: [me, sam],
      membersCount: people.length,
    })
  if (m === "GET" && path === "/organizations/members") {
    const q = (url.searchParams.get("search") ?? "").toLowerCase()
    return json(
      res,
      page(people.filter((p) => (p.name ?? p.email).toLowerCase().includes(q)))
    )
  }
  if (m === "GET" && path === "/organizations/roles")
    return json(res, [
      { id: "ro1", name: "admin" },
      { id: "ro2", name: "developer" },
      { id: "ro3", name: "viewer" },
    ])
  if (m === "GET" && path === "/organizations/invitations")
    return json(res, [
      inv("i1", "jules@northwind.dev", "developer", 5),
      inv("i2", "mona@partner.io", "viewer", 2),
    ])
  if (m === "GET" && path === "/organizations/invitations/me")
    return json(res, [
      {
        ...inv("i9", "camille@northwind.dev", "developer", 6),
        organizationId: "org-2",
        organizationName: "Harbor Labs",
      },
    ])
  if (m === "GET" && path === "/organizations/invitations/i8")
    return json(res, {
      ...inv("i8", "camille@northwind.dev", "developer", -2, {
        status: "Accepted",
        acceptedAt: ago(1),
        message: "Welcome aboard.",
      }),
      organizationId: "org-2",
      organizationName: "Harbor Labs",
    })
  if (m === "GET" && path.startsWith("/organizations/invitations/"))
    return json(res, {
      message: "Join us on the storefront redesign, we start on Monday.",
      ...inv("i9", "camille@northwind.dev", "developer", 6),
      organizationId: "org-2",
      organizationName: "Harbor Labs",
    })
  const pm = path.match(/^\/projects\/([^/]+)(\/.*)?$/)
  if (pm) {
    const p = projects.find((x) => x.id === pm[1])
    const rest = pm[2] ?? ""
    if (!p) return json(res, { message: "PROJECT_NOT_FOUND" }, 404)
    if (m === "GET" && rest === "") return json(res, p)
    if (m === "GET" && rest === "/argocd/status") return json(res, status)
    if (m === "GET" && rest === "/argocd/status/stream") {
      sse(res)
      res.write(`data: ${JSON.stringify(status)}\n\n`)
      return
    }
    if (m === "GET" && rest === "/repos")
      return json(res, p.id === "p-storefront" ? repos : [])
    if (m === "GET" && rest === "/deployments")
      return json(res, p.id === "p-storefront" ? deployments : [])
    if (m === "GET" && rest === "/comments")
      return json(res, page(p.id === "p-storefront" ? comments : []))
    if (m === "GET" && rest.startsWith("/databases/"))
      return json(res, databases[rest.split("/")[2]] ?? [])
    if (m === "GET" && rest.endsWith("/logs"))
      return json(res, {
        logs: [
          {
            service: "web",
            level: "info",
            message: "Server ready on port 3001",
            timestamp: ago(0.01),
          },
          {
            service: "web",
            level: "info",
            message: "GET /checkout 200 in 41ms",
            timestamp: ago(0.009),
          },
          {
            service: "web",
            level: "error",
            message:
              "TypeError: Cannot read properties of undefined (reading 'total')",
            timestamp: ago(0.008),
          },
        ],
      })
    if (m === "POST" && rest === "/deployments/stream") {
      sse(res)
      for (const [phase, durationMs] of [
        ["validation", 120],
        ["snapshot", 800],
        ["worktree", 1900],
        ["install", 14200],
        ["build", 3400],
        ["process", 900],
        ["nginx", 300],
      ]) {
        await wait(350)
        res.write(
          `event: phase\ndata: ${JSON.stringify({ phase, durationMs })}\n\n`
        )
      }
      await wait(350)
      res.write(
        `event: complete\ndata: ${JSON.stringify({ deploymentId: "d1", repo: "web-app", branch: "main", commit: "9f3c2ab", duration: 21000 })}\n\n`
      )
      return res.end()
    }
  }
  json(res, { ok: true })
})

export const startMockApi = (port) =>
  new Promise((resolve, reject) => {
    server.once("error", reject)
    server.listen(port, resolve)
  })
