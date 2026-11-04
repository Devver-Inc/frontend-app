import { describe, expect, it } from "vitest"
import { getApplicationHealth } from "@/features/deployments/utils/deployment-status"

const application = (healthStatus: string, syncStatus: string) => ({
  appName: "storefront",
  type: "application",
  healthStatus,
  syncStatus,
})

describe("getApplicationHealth", () => {
  it.each([
    ["Healthy", "Synced", "Running", "live"],
    ["Healthy", "OutOfSync", "Out of sync", "busy"],
    ["Progressing", "Synced", "Starting", "busy"],
    ["Degraded", "Synced", "Failing", "danger"],
    ["Missing", "OutOfSync", "Missing", "danger"],
    ["Unknown", "Unknown", "Unknown state", "idle"],
  ])("reads %s and %s as %s", (healthStatus, syncStatus, label, tone) => {
    expect(getApplicationHealth(application(healthStatus, syncStatus))).toEqual(
      { label, tone }
    )
  })
})
