// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import type { ComponentProps } from "react"

import { DeploymentInspector } from "@/features/deployments/components/deployment-inspector"
import type { Deployment } from "@/features/deployments/types/deployment.types"

const deployment: Deployment = {
  deploymentId: "kaktus-feat-dark-mode",
  repo: "kaktus",
  branch: "feat/dark-mode",
  commit: "e13d1387788cf8e0fe88ebd1cbc6bf7c4e99e704",
  service: {
    web: {
      port: 3001,
      url: "https://devver-inc.kaktus.devver.app/kaktus/feat-dark-mode",
    },
  },
  process: {
    name: "web-kaktus-feat-dark-mode-3001",
    pm_id: 4,
    status: "online",
    cpu: 0,
    memory: 63275008,
  },
}

const renderInspector = (
  props: Partial<ComponentProps<typeof DeploymentInspector>> = {}
) =>
  render(
    <DeploymentInspector
      deployment={deployment}
      isLogsPending={false}
      isProcessPending={false}
      isDeletePending={false}
      isPodReady
      onGetLogs={() => undefined}
      onProcessAction={() => undefined}
      onRedeploy={() => undefined}
      onDelete={() => undefined}
      {...props}
    />
  )

afterEach(cleanup)

describe("DeploymentInspector", () => {
  it("renders the deployment URL and backend-provided runtime details", () => {
    renderInspector()

    const openLink = screen.getByRole("link", {
      name: "Open kaktus feat/dark-mode deployment",
    })

    expect(openLink.getAttribute("href")).toBe(
      "https://devver-inc.kaktus.devver.app/kaktus/feat-dark-mode"
    )
    expect(openLink.getAttribute("target")).toBe("_blank")
    expect(screen.getByText("Online")).toBeTruthy()
    expect(screen.getByText("e13d138")).toBeTruthy()
    expect(screen.getByText(/port 3001/)).toBeTruthy()
    expect(screen.queryByText(/Invalid Date/)).toBeNull()
  })

  it("labels the compound PM2 launch status", () => {
    renderInspector({
      deployment: {
        ...deployment,
        process: { ...deployment.process!, status: "one-launch-status" },
      },
    })

    expect(screen.getByText("Launching")).toBeTruthy()
  })

  it("requests logs with deploymentId", () => {
    const onGetLogs = vi.fn()
    renderInspector({ onGetLogs })

    fireEvent.click(screen.getByRole("button", { name: "Logs" }))

    expect(onGetLogs).toHaveBeenCalledWith("kaktus-feat-dark-mode")
  })

  it("controls the PM2 process by its name", () => {
    const onProcessAction = vi.fn()
    renderInspector({ onProcessAction })

    fireEvent.click(screen.getByRole("button", { name: "Restart" }))

    expect(onProcessAction).toHaveBeenCalledWith(
      "restart",
      "web-kaktus-feat-dark-mode-3001"
    )
  })

  it("offers to start a stopped process", () => {
    renderInspector({
      deployment: {
        ...deployment,
        process: { ...deployment.process!, status: "stopped" },
      },
    })

    expect(screen.getByRole("button", { name: "Start" })).toBeTruthy()
    expect(screen.queryByRole("button", { name: "Stop" })).toBeNull()
  })
})
