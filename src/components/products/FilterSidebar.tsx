'use client'

import { CCard, CCardBody, CFormCheck, CFormInput, CButton } from '@coreui/react'
import { useFilterOptions } from '@/hooks/useFilterOptions'
import type { ProductFilters } from '@/types'

interface FilterSidebarProps {
  filters: Partial<ProductFilters>
  onFilterChange: (filters: Partial<ProductFilters>) => void
}

const DISCOUNTS = [
  { value: 10, label: '10%+' },
  { value: 25, label: '25%+' },
  { value: 50, label: '50%+' },
  { value: 75, label: '75%+' },
]

export default function FilterSidebar({
  filters,
  onFilterChange,
}: FilterSidebarProps) {
  const { data: filterOptions, isLoading: loadingOptions } = useFilterOptions()

  const toggleArrayFilter = (
    key: 'sources' | 'stores' | 'regions',
    value: string
  ) => {
    const current = filters[key] || []
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onFilterChange({ ...filters, [key]: updated, page: 1 })
  }

  const selectAll = (key: 'sources' | 'stores' | 'regions') => {
    const options = filterOptions?.[key] || []
    const allValues = options.map(o => o.value)
    onFilterChange({ ...filters, [key]: allValues, page: 1 })
  }

  const selectNone = (key: 'sources' | 'stores' | 'regions') => {
    onFilterChange({ ...filters, [key]: [], page: 1 })
  }

  const setMinDiscount = (value: number | null) => {
    onFilterChange({
      ...filters,
      minDiscount: filters.minDiscount === value ? null : value,
      page: 1,
    })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value, page: 1 })
  }

  const clearFilters = () => {
    onFilterChange({
      sources: [],
      stores: [],
      regions: [],
      categories: [],
      minDiscount: null,
      maxPrice: null,
      search: '',
      page: 1,
    })
  }

  const hasFilters =
    (filters.sources?.length || 0) > 0 ||
    (filters.stores?.length || 0) > 0 ||
    (filters.regions?.length || 0) > 0 ||
    filters.minDiscount !== null ||
    filters.search

  const sources = filterOptions?.sources || []
  const stores = filterOptions?.stores || []
  const regions = filterOptions?.regions || []

  return (
    <CCard className="filter-sidebar">
      <CCardBody className="p-0">
        <div className="filter-section">
          <CFormInput
            type="text"
            placeholder="Search products..."
            value={filters.search || ''}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-section">
          <div className="filter-title d-flex justify-content-between align-items-center">
            <span>Scraper Source ({sources.length})</span>
            <div>
              <CButton
                color="link"
                size="sm"
                className="p-0 me-2"
                onClick={() => selectAll('sources')}
              >
                All
              </CButton>
              <CButton
                color="link"
                size="sm"
                className="p-0"
                onClick={() => selectNone('sources')}
              >
                None
              </CButton>
            </div>
          </div>
          {loadingOptions ? (
            <div className="text-muted small">Loading...</div>
          ) : sources.length === 0 ? (
            <div className="text-muted small">No sources found</div>
          ) : (
            sources.map((source) => (
              <CFormCheck
                key={source.value}
                id={`source-${source.value}`}
                label={source.label}
                checked={(filters.sources || []).includes(source.value)}
                onChange={() => toggleArrayFilter('sources', source.value)}
              />
            ))
          )}
        </div>

        <div className="filter-section">
          <div className="filter-title d-flex justify-content-between align-items-center">
            <span>Store ({stores.length})</span>
            <div>
              <CButton
                color="link"
                size="sm"
                className="p-0 me-2"
                onClick={() => selectAll('stores')}
              >
                All
              </CButton>
              <CButton
                color="link"
                size="sm"
                className="p-0"
                onClick={() => selectNone('stores')}
              >
                None
              </CButton>
            </div>
          </div>
          {loadingOptions ? (
            <div className="text-muted small">Loading...</div>
          ) : stores.length === 0 ? (
            <div className="text-muted small">No stores found</div>
          ) : (
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {stores.map((store) => (
                <CFormCheck
                  key={store.value}
                  id={`store-${store.value}`}
                  label={store.label}
                  checked={(filters.stores || []).includes(store.value)}
                  onChange={() => toggleArrayFilter('stores', store.value)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="filter-section">
          <div className="filter-title d-flex justify-content-between align-items-center">
            <span>Region ({regions.length})</span>
            <div>
              <CButton
                color="link"
                size="sm"
                className="p-0 me-2"
                onClick={() => selectAll('regions')}
              >
                All
              </CButton>
              <CButton
                color="link"
                size="sm"
                className="p-0"
                onClick={() => selectNone('regions')}
              >
                None
              </CButton>
            </div>
          </div>
          {loadingOptions ? (
            <div className="text-muted small">Loading...</div>
          ) : regions.length === 0 ? (
            <div className="text-muted small">No regions found</div>
          ) : (
            regions.map((region) => (
              <CFormCheck
                key={region.value}
                id={`region-${region.value}`}
                label={region.label}
                checked={(filters.regions || []).includes(region.value)}
                onChange={() => toggleArrayFilter('regions', region.value)}
              />
            ))
          )}
        </div>

        <div className="filter-section">
          <div className="filter-title">Discount</div>
          {DISCOUNTS.map((discount) => (
            <CFormCheck
              key={discount.value}
              id={`discount-${discount.value}`}
              type="radio"
              name="discount"
              label={discount.label}
              checked={filters.minDiscount === discount.value}
              onChange={() => setMinDiscount(discount.value)}
            />
          ))}
        </div>

        {hasFilters && (
          <div className="filter-section">
            <CButton
              color="secondary"
              size="sm"
              className="w-100"
              onClick={clearFilters}
            >
              Clear Filters
            </CButton>
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}
