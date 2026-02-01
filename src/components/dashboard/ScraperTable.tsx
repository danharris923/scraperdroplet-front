'use client'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CButton,
  CSpinner,
} from '@coreui/react'
import { useScrapers, useTriggerScraper } from '@/hooks/useDroplet'
import { formatRelativeTime, getStatusColor } from '@/lib/utils'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorAlert from '@/components/ui/ErrorAlert'

export default function ScraperTable() {
  const { data: scrapers, isLoading, error, refetch } = useScrapers()
  const triggerMutation = useTriggerScraper()

  if (isLoading) {
    return <LoadingSpinner text="Loading scrapers..." />
  }

  if (error) {
    return (
      <ErrorAlert
        message="Failed to load scraper status"
        onRetry={() => refetch()}
      />
    )
  }

  if (!scrapers || scrapers.length === 0) {
    return (
      <CCard>
        <CCardBody className="text-center text-muted">
          No scrapers found. Make sure the droplet API is running.
        </CCardBody>
      </CCard>
    )
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>Scraper Status</strong>
      </CCardHeader>
      <CCardBody>
        <div className="table-responsive">
          <CTable hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Type</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Last Run</CTableHeaderCell>
                <CTableHeaderCell>Next Run</CTableHeaderCell>
                <CTableHeaderCell>Items</CTableHeaderCell>
                <CTableHeaderCell>Timer</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {scrapers.map((scraper) => (
                <CTableRow key={scraper.name}>
                  <CTableDataCell>
                    <strong>{scraper.name}</strong>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color="secondary">{scraper.type}</CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getStatusColor(scraper.last_status)}>
                      {scraper.last_status}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    {formatRelativeTime(scraper.last_run)}
                  </CTableDataCell>
                  <CTableDataCell>
                    {formatRelativeTime(scraper.next_run)}
                  </CTableDataCell>
                  <CTableDataCell>
                    {scraper.items_found !== null && (
                      <span>
                        {scraper.items_found}
                        {scraper.items_new ? (
                          <span className="text-success ms-1">
                            (+{scraper.items_new})
                          </span>
                        ) : null}
                      </span>
                    )}
                    {scraper.errors ? (
                      <span className="text-danger ms-2">
                        {scraper.errors} errors
                      </span>
                    ) : null}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge
                      color={scraper.timer_enabled ? 'success' : 'secondary'}
                    >
                      {scraper.timer_enabled ? 'On' : 'Off'}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="primary"
                      size="sm"
                      disabled={
                        triggerMutation.isPending ||
                        scraper.last_status === 'running'
                      }
                      onClick={() => triggerMutation.mutate(scraper.name)}
                    >
                      {triggerMutation.isPending ? (
                        <CSpinner size="sm" />
                      ) : (
                        'Run'
                      )}
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>
      </CCardBody>
    </CCard>
  )
}
