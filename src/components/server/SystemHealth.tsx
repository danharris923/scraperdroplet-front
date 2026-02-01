'use client'

import { CCard, CCardBody, CCardHeader, CProgress } from '@coreui/react'
import type { SystemHealth } from '@/types'
import { formatPercent } from '@/lib/utils'

interface SystemHealthProps {
  health: SystemHealth
}

function getProgressColor(percent: number): string {
  if (percent >= 90) return 'danger'
  if (percent >= 70) return 'warning'
  return 'success'
}

export default function SystemHealthComponent({ health }: SystemHealthProps) {
  const gauges = [
    { label: 'CPU', value: health.cpu_percent },
    { label: 'Memory', value: health.memory_percent },
    { label: 'Disk', value: health.disk_percent },
  ]

  return (
    <CCard>
      <CCardHeader>
        <strong>System Health</strong>
      </CCardHeader>
      <CCardBody>
        {gauges.map((gauge) => (
          <div key={gauge.label} className="gauge-container mb-3">
            <div className="gauge-label">
              <span>{gauge.label}</span>
              <span>{formatPercent(gauge.value)}</span>
            </div>
            <CProgress
              value={gauge.value}
              color={getProgressColor(gauge.value)}
            />
          </div>
        ))}
        <div className="mt-3 small text-muted">
          Disk: {health.disk_used_gb?.toFixed(1)} GB / {health.disk_total_gb?.toFixed(1)} GB
        </div>
      </CCardBody>
    </CCard>
  )
}
