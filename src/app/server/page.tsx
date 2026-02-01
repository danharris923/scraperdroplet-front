'use client'

import { CRow, CCol, CCard, CCardBody, CBadge } from '@coreui/react'
import { useSystemHealth } from '@/hooks/useDroplet'
import SystemHealthComponent from '@/components/server/SystemHealth'
import NetworkStats from '@/components/server/NetworkStats'
import UptimeDisplay from '@/components/server/UptimeDisplay'
import ServiceStatus from '@/components/server/ServiceStatus'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorAlert from '@/components/ui/ErrorAlert'
import { getStatusColor } from '@/lib/utils'

export default function ServerPage() {
  const { data: health, isLoading, error, refetch } = useSystemHealth()

  if (isLoading) {
    return <LoadingSpinner text="Loading server status..." />
  }

  if (error || !health) {
    return (
      <>
        <h4 className="mb-4">Server Status</h4>
        <ErrorAlert
          message="Failed to connect to droplet API. Make sure the server is running."
          onRetry={() => refetch()}
        />
        <ServiceStatus health={null} isLoading={false} error={error as Error} />
      </>
    )
  }

  return (
    <>
      <h4 className="mb-4">
        Server Status
        <CBadge color={getStatusColor(health.status)} className="ms-2">
          {health.status}
        </CBadge>
      </h4>

      <CRow>
        <CCol md={6} lg={4} className="mb-4">
          <SystemHealthComponent health={health} />
        </CCol>
        <CCol md={6} lg={4} className="mb-4">
          <UptimeDisplay health={health} />
        </CCol>
        <CCol md={6} lg={4} className="mb-4">
          <NetworkStats health={health} />
        </CCol>
      </CRow>

      <CRow>
        <CCol md={6}>
          <ServiceStatus health={health} isLoading={isLoading} error={null} />
        </CCol>
      </CRow>
    </>
  )
}
