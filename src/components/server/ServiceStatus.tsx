'use client'

import { CCard, CCardBody, CCardHeader, CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle } from '@coreui/icons'
import type { SystemHealth } from '@/types'

interface ServiceStatusProps {
  health: SystemHealth | null
  isLoading: boolean
  error: Error | null
}

interface ServiceItemProps {
  name: string
  port: number
  isOnline: boolean
}

function ServiceItem({ name, port, isOnline }: ServiceItemProps) {
  return (
    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
      <div>
        <span className="fw-semibold">{name}</span>
        <small className="text-muted ms-2">:{port}</small>
      </div>
      <div className="d-flex align-items-center">
        <CIcon
          icon={isOnline ? cilCheckCircle : cilXCircle}
          className={isOnline ? 'text-success' : 'text-danger'}
        />
        <CBadge color={isOnline ? 'success' : 'danger'} className="ms-2">
          {isOnline ? 'Online' : 'Offline'}
        </CBadge>
      </div>
    </div>
  )
}

export default function ServiceStatus({
  health,
  isLoading,
  error,
}: ServiceStatusProps) {
  const apiOnline = !error && !isLoading && health !== null

  return (
    <CCard>
      <CCardHeader>
        <strong>Services</strong>
      </CCardHeader>
      <CCardBody>
        <ServiceItem name="Scraper API" port={8080} isOnline={apiOnline} />
        <ServiceItem
          name="Umami Analytics"
          port={3000}
          isOnline={health?.status === 'healthy'}
        />
      </CCardBody>
    </CCard>
  )
}
