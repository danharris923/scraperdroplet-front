'use client'

import { useState } from 'react'
import { CRow, CCol, CCard, CCardBody } from '@coreui/react'
import { useProducts } from '@/hooks/useProducts'
import FilterSidebar from '@/components/products/FilterSidebar'
import ProductGrid from '@/components/products/ProductGrid'
import ProductModal from '@/components/products/ProductModal'
import SortDropdown from '@/components/products/SortDropdown'
import Pagination from '@/components/ui/Pagination'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorAlert from '@/components/ui/ErrorAlert'
import type { ProductFilters } from '@/types'

const DEFAULT_FILTERS: Partial<ProductFilters> = {
  sources: [],
  stores: [],
  regions: [],
  categories: [],
  minDiscount: null,
  maxPrice: null,
  search: '',
  sortBy: 'last_seen_at',
  sortOrder: 'desc',
  page: 1,
  limit: 24,
}

export default function ProductsPage() {
  const [filters, setFilters] = useState<Partial<ProductFilters>>(DEFAULT_FILTERS)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const { data, isLoading, error, refetch } = useProducts(filters)

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters(newFilters)
  }

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setFilters((prev) => ({ ...prev, sortBy, sortOrder, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const totalPages = data ? Math.ceil(data.total / (filters.limit || 24)) : 0

  return (
    <>
      <h4 className="mb-4">Product Catalog</h4>

      <CRow>
        <CCol lg={3} className="mb-4">
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        </CCol>

        <CCol lg={9}>
          <CCard className="mb-4">
            <CCardBody className="d-flex justify-content-between align-items-center">
              <div className="text-muted">
                {isLoading ? (
                  'Loading...'
                ) : (
                  <>
                    Showing{' '}
                    <strong>
                      {data?.products.length || 0}
                    </strong>{' '}
                    of <strong>{data?.total || 0}</strong> products
                  </>
                )}
              </div>
              <SortDropdown
                sortBy={filters.sortBy || 'last_seen_at'}
                sortOrder={filters.sortOrder || 'desc'}
                onChange={handleSortChange}
              />
            </CCardBody>
          </CCard>

          {isLoading ? (
            <LoadingSpinner text="Loading products..." />
          ) : error ? (
            <ErrorAlert
              message="Failed to load products"
              onRetry={() => refetch()}
            />
          ) : (
            <>
              <ProductGrid
                products={data?.products || []}
                onProductClick={setSelectedProductId}
              />

              <Pagination
                currentPage={filters.page || 1}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </CCol>
      </CRow>

      <ProductModal
        productId={selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </>
  )
}
