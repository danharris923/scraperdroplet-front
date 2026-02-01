'use client'

import { useEffect, useRef } from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import { useCostcoDanLogs } from '@/hooks/useCostcoDan'

function getLogClass(line: string): string {
  const lower = line.toLowerCase()
  if (lower.includes('error') || lower.includes('failed')) return 'log-error'
  if (lower.includes('warning') || lower.includes('warn')) return 'log-warning'
  if (lower.includes('success') || lower.includes('completed')) return 'log-success'
  if (lower.includes('info') || lower.includes('starting')) return 'log-info'
  return ''
}

export default function PipelineLog() {
  const { data: logs, isLoading } = useCostcoDanLogs()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [logs])

  return (
    <CCard>
      <CCardHeader>
        <strong>Pipeline Logs</strong>
      </CCardHeader>
      <CCardBody className="p-0">
        <div ref={containerRef} className="log-viewer">
          {isLoading ? (
            <div className="text-muted">Loading logs...</div>
          ) : !logs || logs.length === 0 ? (
            <div className="text-muted">No logs available</div>
          ) : (
            logs.map((line, index) => (
              <div key={index} className={`log-line ${getLogClass(line)}`}>
                {line}
              </div>
            ))
          )}
        </div>
      </CCardBody>
    </CCard>
  )
}
