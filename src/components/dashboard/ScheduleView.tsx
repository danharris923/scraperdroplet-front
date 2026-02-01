'use client'

import { CCard, CCardBody, CCardHeader, CProgress, CBadge } from '@coreui/react'
import { useScrapers } from '@/hooks/useDroplet'
import { parseISO, differenceInMinutes, addMinutes } from 'date-fns'

export default function ScheduleView() {
  const { data: scrapers } = useScrapers()

  if (!scrapers) return null

  const enabledScrapers = scrapers.filter((s) => s.timer_enabled && s.next_run)

  if (enabledScrapers.length === 0) {
    return (
      <CCard>
        <CCardHeader>
          <strong>Schedule</strong>
        </CCardHeader>
        <CCardBody className="text-muted text-center">
          No scheduled scrapers
        </CCardBody>
      </CCard>
    )
  }

  const now = new Date()

  const sortedScrapers = [...enabledScrapers].sort((a, b) => {
    const aNext = parseISO(a.next_run!)
    const bNext = parseISO(b.next_run!)
    return aNext.getTime() - bNext.getTime()
  })

  return (
    <CCard>
      <CCardHeader>
        <strong>Upcoming Runs</strong>
      </CCardHeader>
      <CCardBody>
        {sortedScrapers.slice(0, 5).map((scraper) => {
          const nextRun = parseISO(scraper.next_run!)
          const minutesUntil = differenceInMinutes(nextRun, now)
          const isOverdue = minutesUntil < 0

          let progressValue = 0
          if (scraper.last_run) {
            const lastRun = parseISO(scraper.last_run)
            const totalDuration = differenceInMinutes(nextRun, lastRun)
            const elapsed = differenceInMinutes(now, lastRun)
            progressValue = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
          }

          return (
            <div key={scraper.name} className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span>{scraper.name}</span>
                <span className="text-muted">
                  {isOverdue ? (
                    <CBadge color="warning">Overdue</CBadge>
                  ) : minutesUntil < 60 ? (
                    `${minutesUntil}m`
                  ) : (
                    `${Math.floor(minutesUntil / 60)}h ${minutesUntil % 60}m`
                  )}
                </span>
              </div>
              <CProgress
                value={progressValue}
                color={isOverdue ? 'warning' : 'primary'}
                style={{ height: '4px' }}
              />
            </div>
          )
        })}
      </CCardBody>
    </CCard>
  )
}
