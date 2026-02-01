import { useQuery } from '@tanstack/react-query'
import type { DashboardStats } from '@/types'

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch('/api/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      return response.json()
    },
    refetchInterval: 60000,
  })
}
