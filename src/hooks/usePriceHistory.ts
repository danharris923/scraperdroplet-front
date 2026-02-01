import { useQuery } from '@tanstack/react-query'
import type { PricePoint } from '@/types'

export function usePriceHistory(productId: string | null) {
  return useQuery<PricePoint[]>({
    queryKey: ['price-history', productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch price history')
      }
      const data = await response.json()
      return data.price_history || []
    },
    enabled: !!productId,
  })
}
