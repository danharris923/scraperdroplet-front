'use client'

import { CRow, CCol } from '@coreui/react'
import type { Product } from '@/types'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  onProductClick: (productId: string) => void
}

export default function ProductGrid({ products, onProductClick }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <h5>No products found</h5>
        <p>Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <CRow>
      {products.map((product) => (
        <CCol key={product.id} sm={6} md={4} lg={3} className="mb-4">
          <ProductCard
            product={product}
            onClick={() => onProductClick(product.id)}
          />
        </CCol>
      ))}
    </CRow>
  )
}
