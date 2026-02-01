'use client'

import { CCard, CCardBody, CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBasket, cilPlus, cilMediaPlay, cilWarning } from '@coreui/icons'
import { useDashboardStats } from '@/hooks/useStats'

interface StatCardProps {
  title: string
  value: string | number
  icon: number[]
  color: string
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <CCard className="stats-widget">
      <CCardBody className="d-flex align-items-center">
        <div
          className={`p-3 me-3 rounded bg-${color}`}
          style={{ opacity: 0.15 }}
        >
          <CIcon icon={icon} size="xl" className={`text-${color}`} />
        </div>
        <div>
          <div className="stats-value">{value}</div>
          <div className="stats-label">{title}</div>
        </div>
      </CCardBody>
    </CCard>
  )
}

export default function StatsWidgets() {
  const { data, isLoading, error } = useDashboardStats()

  if (isLoading) {
    return (
      <CRow className="mb-4">
        {[1, 2, 3, 4].map((i) => (
          <CCol key={i} sm={6} lg={3}>
            <CCard className="stats-widget">
              <CCardBody className="text-center text-muted">
                Loading...
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    )
  }

  if (error) {
    return null
  }

  return (
    <CRow className="mb-4">
      <CCol sm={6} lg={3}>
        <StatCard
          title="Total Products"
          value={data?.totalProducts?.toLocaleString() || 0}
          icon={cilBasket}
          color="primary"
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <StatCard
          title="New Today"
          value={data?.newToday?.toLocaleString() || 0}
          icon={cilPlus}
          color="success"
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <StatCard
          title="Active Scrapers"
          value={data?.activeScrapers || 0}
          icon={cilMediaPlay}
          color="info"
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <StatCard
          title="Errors"
          value={data?.errorCount || 0}
          icon={cilWarning}
          color={data?.errorCount ? 'danger' : 'secondary'}
        />
      </CCol>
    </CRow>
  )
}
