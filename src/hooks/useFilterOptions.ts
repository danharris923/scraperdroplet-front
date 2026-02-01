import { useQuery } from '@tanstack/react-query'

interface FilterOption {
  value: string
  label: string
}

interface FilterOptions {
  sources: FilterOption[]
  stores: FilterOption[]
  regions: FilterOption[]
  counts: {
    sources: number
    stores: number
    regions: number
  }
}

async function fetchFilterOptions(): Promise<FilterOptions> {
  const response = await fetch('/api/filter-options')
  if (!response.ok) {
    throw new Error('Failed to fetch filter options')
  }
  return response.json()
}

export function useFilterOptions() {
  return useQuery({
    queryKey: ['filter-options'],
    queryFn: fetchFilterOptions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
