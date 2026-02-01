'use client'

import { CCard, CCardBody, CBadge, CButton, CSpinner } from '@coreui/react'
import type { ScraperStatus } from '@/types'
import { formatRelativeTime, getStatusColor } from '@/lib/utils'

interface ScraperCardProps {
  scraper: ScraperStatus
  onTrigger: (name: string) => void
  isTriggering: boolean
}

export default function ScraperCard({
  scraper,
  onTrigger,
  isTriggering,
}: ScraperCardProps) {
  return (
    <CCard className="mb-3">
      <CCardBody>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="mb-1">{scraper.name}</h6>
            <small className="text-muted">{scraper.type}</small>
          </div>
          <CBadge color={getStatusColor(scraper.last_status)}>
            {scraper.last_status}
          </CBadge>
        </div>

        <div className="small text-muted mb-2">
          <div>Last run: {formatRelativeTime(scraper.last_run)}</div>
          {scraper.next_run && (
            <div>Next run: {formatRelativeTime(scraper.next_run)}</div>
          )}
        </div>

        {scraper.items_found !== null && (
          <div className="d-flex gap-3 mb-2 small">
            <span>Found: {scraper.items_found}</span>
            <span className="text-success">New: {scraper.items_new || 0}</span>
            {scraper.errors ? (
              <span className="text-danger">Errors: {scraper.errors}</span>
            ) : null}
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center">
          <CBadge color={scraper.timer_enabled ? 'success' : 'secondary'}>
            {scraper.timer_enabled ? 'Enabled' : 'Disabled'}
          </CBadge>
          <CButton
            color="primary"
            size="sm"
            disabled={isTriggering || scraper.last_status === 'running'}
            onClick={() => onTrigger(scraper.name)}
          >
            {isTriggering ? (
              <CSpinner size="sm" />
            ) : (
              'Run Now'
            )}
          </CButton>
        </div>
      </CCardBody>
    </CCard>
  )
}
