'use client'

import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CBadge,
  CRow,
  CCol,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilExternalLink } from '@coreui/icons'
import { useProductDetail } from '@/hooks/useProducts'
import PriceChart from './PriceChart'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { formatPrice, formatDate, getDiscountBadgeColor } from '@/lib/utils'

interface ProductModalProps {
  productId: string | null
  onClose: () => void
}

export default function ProductModal({ productId, onClose }: ProductModalProps) {
  const { data: product, isLoading } = useProductDetail(productId)

  const isVisible = productId !== null

  if (!isVisible) return null

  return (
    <CModal visible={isVisible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle>Product Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {isLoading ? (
          <LoadingSpinner text="Loading product..." />
        ) : !product ? (
          <div className="text-center text-muted">Product not found</div>
        ) : (
          <CRow>
            <CCol md={5}>
              <div
                className="mb-3 bg-light d-flex align-items-center justify-content-center"
                style={{ height: '300px', borderRadius: '8px' }}
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <span className="text-muted">No image</span>
                )}
              </div>
            </CCol>
            <CCol md={7}>
              <div className="d-flex gap-2 mb-2">
                <CBadge color="secondary">{product.store}</CBadge>
                <CBadge color="dark">{product.source}</CBadge>
                {product.region && (
                  <CBadge color="info">{product.region}</CBadge>
                )}
              </div>

              <h5 className="mb-3">{product.title}</h5>

              <div className="d-flex align-items-baseline gap-3 mb-3">
                <span className="fs-3 fw-bold text-primary">
                  {formatPrice(product.current_price)}
                </span>
                {product.original_price &&
                  product.original_price !== product.current_price && (
                    <>
                      <span className="text-muted text-decoration-line-through">
                        {formatPrice(product.original_price)}
                      </span>
                      {product.discount_percent && (
                        <CBadge
                          color={getDiscountBadgeColor(product.discount_percent)}
                        >
                          {Math.round(product.discount_percent)}% OFF
                        </CBadge>
                      )}
                    </>
                  )}
              </div>

              {product.description && (
                <p className="text-muted small mb-3">{product.description}</p>
              )}

              <div className="small text-muted mb-3">
                <div>First seen: {formatDate(product.first_seen_at)}</div>
                <div>Last seen: {formatDate(product.last_seen_at)}</div>
                {product.brand && <div>Brand: {product.brand}</div>}
                {product.category && <div>Category: {product.category}</div>}
              </div>

              <CButton
                color="primary"
                href={product.affiliate_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CIcon icon={cilExternalLink} className="me-2" />
                View Deal
              </CButton>
            </CCol>

            <CCol xs={12} className="mt-4">
              <h6>Price History (30 days)</h6>
              <PriceChart priceHistory={product.price_history || []} />
            </CCol>
          </CRow>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
