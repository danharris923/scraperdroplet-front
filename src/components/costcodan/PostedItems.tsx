'use client'

import { CRow, CCol, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { useCostcoDanPosts } from '@/hooks/useCostcoDan'
import PostCard from './PostCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function PostedItems() {
  const { data: posts, isLoading, error } = useCostcoDanPosts()

  if (isLoading) {
    return <LoadingSpinner text="Loading posts..." />
  }

  if (error) {
    return (
      <CCard>
        <CCardBody className="text-muted text-center">
          Failed to load posts
        </CCardBody>
      </CCard>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <CCard>
        <CCardHeader>
          <strong>Posted Items</strong>
        </CCardHeader>
        <CCardBody className="text-muted text-center">
          No posts yet
        </CCardBody>
      </CCard>
    )
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>Posted Items</strong>
        <small className="text-muted ms-2">({posts.length} posts)</small>
      </CCardHeader>
      <CCardBody>
        <CRow>
          {posts.map((post) => (
            <CCol key={post.id} sm={6} lg={4} xl={3} className="mb-3">
              <PostCard post={post} />
            </CCol>
          ))}
        </CRow>
      </CCardBody>
    </CCard>
  )
}
