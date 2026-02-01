'use client'

import { CFormSelect } from '@coreui/react'

interface SortDropdownProps {
  sortBy: string
  sortOrder: 'asc' | 'desc'
  onChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void
}

const SORT_OPTIONS = [
  { value: 'last_seen_at:desc', label: 'Newest First' },
  { value: 'last_seen_at:asc', label: 'Oldest First' },
  { value: 'discount_percent:desc', label: 'Highest Discount' },
  { value: 'current_price:asc', label: 'Lowest Price' },
  { value: 'current_price:desc', label: 'Highest Price' },
]

export default function SortDropdown({
  sortBy,
  sortOrder,
  onChange,
}: SortDropdownProps) {
  const currentValue = `${sortBy}:${sortOrder}`

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [newSortBy, newSortOrder] = e.target.value.split(':')
    onChange(newSortBy, newSortOrder as 'asc' | 'desc')
  }

  return (
    <CFormSelect
      value={currentValue}
      onChange={handleChange}
      style={{ width: 'auto' }}
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </CFormSelect>
  )
}
