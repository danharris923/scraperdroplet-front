'use client'

import { CCard, CCardBody, CFormCheck, CFormInput, CButton } from '@coreui/react'
import type { ProductFilters } from '@/types'

interface FilterSidebarProps {
  filters: Partial<ProductFilters>
  onFilterChange: (filters: Partial<ProductFilters>) => void
}

const SOURCES = [
  { value: 'amazon_ca', label: 'Amazon CA' },
  { value: 'cabelas', label: "Cabela's" },
  { value: 'flipp', label: 'Flipp' },
  { value: 'rfd', label: 'RFD' },
  { value: 'shopify', label: 'Shopify Stores' },
]

const REGIONS = [
  { value: 'BC', label: 'BC' },
  { value: 'AB', label: 'AB' },
  { value: 'ON', label: 'ON' },
  { value: 'QC', label: 'QC' },
  { value: 'SK', label: 'SK' },
  { value: 'MB', label: 'MB' },
  { value: 'NS', label: 'NS' },
  { value: 'NB', label: 'NB' },
  { value: 'USA', label: 'USA' },
]

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
  const toggleArrayFilter = (
    key: 'sources' | 'regions',
    value: string
  ) => {
    const current = filters[key] || []
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onFilterChange({ ...filters, [key]: updated, page: 1 })
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
    (filters.regions?.length || 0) > 0 ||
    filters.minDiscount !== null ||
    filters.search

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
          <div className="filter-title">Scraper Source</div>
          {SOURCES.map((source) => (
            <CFormCheck
              key={source.value}
              id={`source-${source.value}`}
              label={source.label}
              checked={(filters.sources || []).includes(source.value)}
              onChange={() => toggleArrayFilter('sources', source.value)}
            />
          ))}
        </div>

        <div className="filter-section">
          <div className="filter-title">Region</div>
          {REGIONS.map((region) => (
            <CFormCheck
              key={region.value}
              id={`region-${region.value}`}
              label={region.label}
              checked={(filters.regions || []).includes(region.value)}
              onChange={() => toggleArrayFilter('regions', region.value)}
            />
          ))}
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
