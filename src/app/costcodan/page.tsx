'use client'

import { CRow, CCol } from '@coreui/react'
import PipelineLog from '@/components/costcodan/PipelineLog'
import PostedItems from '@/components/costcodan/PostedItems'

export default function CostcoDanPage() {
  return (
    <>
      <h4 className="mb-4">Costco Dan Engine</h4>
      <CRow>
        <CCol lg={6} className="mb-4">
          <PipelineLog />
        </CCol>
        <CCol lg={6} className="mb-4">
          <div className="mb-4">
            <strong>Recent Activity</strong>
            <p className="text-muted small mb-0">
              Costco Dan automatically posts viral deals to Facebook.
            </p>
          </div>
        </CCol>
      </CRow>
      <PostedItems />
    </>
  )
}
