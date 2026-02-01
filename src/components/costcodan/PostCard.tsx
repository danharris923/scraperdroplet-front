'use client'

import { CCard, CCardBody, CCardImage, CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilExternalLink } from '@coreui/icons'
import type { CostcoDanPost } from '@/types'
import { formatRelativeTime } from '@/lib/utils'

interface PostCardProps {
  post: CostcoDanPost
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <CCard className="h-100">
      {post.image_url && (
        <CCardImage
          orientation="top"
          src={post.image_url}
          style={{ height: '180px', objectFit: 'cover' }}
          alt={post.title}
        />
      )}
      <CCardBody>
        <h6 className="card-title text-truncate" title={post.title}>
          {post.title}
        </h6>
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            {formatRelativeTime(post.posted_at)}
          </small>
          {post.viral_score > 0 && (
            <CBadge color="warning">Score: {post.viral_score}</CBadge>
          )}
        </div>
        {post.facebook_url && (
          <a
            href={post.facebook_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline-primary mt-2 w-100"
          >
            <CIcon icon={cilExternalLink} className="me-1" />
            View on Facebook
          </a>
        )}
      </CCardBody>
    </CCard>
  )
}
