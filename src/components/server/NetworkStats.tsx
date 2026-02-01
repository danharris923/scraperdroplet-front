'use client'

import { CCard, CCardBody, CCardHeader, CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowTop, cilArrowBottom } from '@coreui/icons'
import type { SystemHealth } from '@/types'
import { formatBytes } from '@/lib/utils'

interface NetworkStatsProps {
  health: SystemHealth
}

export default function NetworkStats({ health }: NetworkStatsProps) {
  return (
    <CCard>
      <CCardHeader>
        <strong>Network</strong>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol xs={6}>
            <div className="d-flex align-items-center">
              <CIcon icon={cilArrowBottom as unknown as string[]} className="text-success me-2" />
              <div>
                <div className="text-muted small">Download</div>
                <div className="fw-semibold">
                  {formatBytes(health.network_rx_bytes || 0)}
                </div>
              </div>
            </div>
          </CCol>
          <CCol xs={6}>
            <div className="d-flex align-items-center">
              <CIcon icon={cilArrowTop as unknown as string[]} className="text-info me-2" />
              <div>
                <div className="text-muted small">Upload</div>
                <div className="fw-semibold">
                  {formatBytes(health.network_tx_bytes || 0)}
                </div>
              </div>
            </div>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  )
}
