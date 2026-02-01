'use client'

import { CRow, CCol } from '@coreui/react'
import StatsWidgets from '@/components/dashboard/StatsWidgets'
import ScraperTable from '@/components/dashboard/ScraperTable'
import ScheduleView from '@/components/dashboard/ScheduleView'

export default function DashboardPage() {
  return (
    <>
      <h4 className="mb-4">Scraper Dashboard</h4>
      <StatsWidgets />
      <CRow>
        <CCol lg={8}>
          <ScraperTable />
        </CCol>
        <CCol lg={4}>
          <ScheduleView />
        </CCol>
      </CRow>
    </>
  )
}
