// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { ProjectDeployment } from '@/lib/api/deploy-agent'
import { DeploymentCard } from '@/components/projects/deployment-card'

const deployment: ProjectDeployment = {
  deploymentId: 'kaktus-feat-dark-mode',
  repo: 'kaktus',
  branch: 'feat/dark-mode',
  commit: 'e13d1387788cf8e0fe88ebd1cbc6bf7c4e99e704',
  service: {
    web: {
      port: 3001,
      url: 'https://devver-inc.kaktus.devver.app/kaktus/feat-dark-mode',
    },
  },
  process: {
    name: 'web-kaktus-feat-dark-mode-3001',
    pm_id: 4,
    status: 'online',
    cpu: 0,
    memory: 63275008,
  },
}

afterEach(cleanup)

describe('DeploymentCard', () => {
  it('renders the deployment URL and backend-provided runtime details', () => {
    render(
      <DeploymentCard
        deployment={deployment}
        isSelectedForLogs={false}
        isLogsPending={false}
        onGetLogs={() => undefined}
      />,
    )

    const openLink = screen.getByRole('link', {
      name: 'Open kaktus feat/dark-mode deployment',
    })

    expect(openLink.getAttribute('href')).toBe(
      'https://devver-inc.kaktus.devver.app/kaktus/feat-dark-mode',
    )
    expect(openLink.getAttribute('target')).toBe('_blank')
    expect(screen.getByText('online')).toBeTruthy()
    expect(screen.getByText('e13d138')).toBeTruthy()
    expect(screen.getByText('· port 3001')).toBeTruthy()
    expect(screen.queryByText(/Invalid Date/)).toBeNull()
  })

  it('requests logs with deploymentId', () => {
    const onGetLogs = vi.fn()

    render(
      <DeploymentCard
        deployment={deployment}
        isSelectedForLogs={false}
        isLogsPending={false}
        onGetLogs={onGetLogs}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Logs' }))

    expect(onGetLogs).toHaveBeenCalledWith('kaktus-feat-dark-mode')
  })
})
