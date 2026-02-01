'use client'

import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilClock } from '@coreui/icons'
import type { SystemHealth } from '@/types'
import { formatUptime } from '@/lib/utils'

interface UptimeDisplayProps {
  health: SystemHealth
}

export default function UptimeDisplay({ health }: UptimeDisplayProps) {
  const uptime = formatUptime(health.uptime_seconds || 0)
  const days = Math.floor((health.uptime_seconds || 0) / 86400)

  return (
    <CCard>
      <CCardHeader>
        <strong>Uptime</strong>
      </CCardHeader>
      <CCardBody className="text-center">
        <CIcon icon={cilClock as unknown as string[]} size="3xl" className="text-primary mb-3" />
        <h3 className="mb-0">{uptime}</h3>
        {days > 0 && (
          <div className="text-muted small mt-1">
            {days} day{days !== 1 ? 's' : ''} running
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}
