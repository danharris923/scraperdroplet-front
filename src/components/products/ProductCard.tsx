'use client'

import { CCard, CCardBody, CBadge } from '@coreui/react'
import type { Product } from '@/types'
import { formatPrice, formatRelativeTime, truncateText, getDiscountBadgeColor } from '@/lib/utils'
import RegionBadge from './RegionBadge'

interface ProductCardProps {
  product: Product
  onClick: () => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const hasDiscount =
    product.discount_percent !== null && product.discount_percent > 0

  return (
    <CCard className="product-card h-100" onClick={onClick}>
      <div className="product-image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.title} />
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            No image
          </div>
        )}

        {hasDiscount && (
          <CBadge
            color={getDiscountBadgeColor(product.discount_percent!)}
            className="discount-badge"
          >
            {Math.round(product.discount_percent!)}% OFF
          </CBadge>
        )}

        <RegionBadge region={product.region} />

        <CBadge color="dark" className="origin-badge">
          {product.source}
        </CBadge>
      </div>

      <CCardBody className="d-flex flex-column">
        <small className="text-muted mb-1">{product.store}</small>
        <h6
          className="card-title mb-2 flex-grow-1"
          title={product.title}
          style={{
            fontSize: '0.875rem',
            lineHeight: '1.3',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.title}
        </h6>

        <div className="mt-auto">
          <div className="d-flex align-items-baseline gap-2">
            <span className="fw-bold text-primary">
              {formatPrice(product.current_price)}
            </span>
            {product.original_price &&
              product.original_price !== product.current_price && (
                <small className="text-muted text-decoration-line-through">
                  {formatPrice(product.original_price)}
                </small>
              )}
          </div>
          <small className="text-muted">
            {formatRelativeTime(product.first_seen_at)}
          </small>
        </div>
      </CCardBody>
    </CCard>
  )
}
