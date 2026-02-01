import { useQuery } from '@tanstack/react-query'
import { getSupabase } from '@/lib/supabase'
import type { CostcoDanPost } from '@/types'

export function useCostcoDanPosts(limit = 20) {
  return useQuery<CostcoDanPost[]>({
    queryKey: ['costcodan-posts', limit],
    queryFn: async () => {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('costco')
        .select('*')
        .order('posted_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }

      return (data || []).map((item) => ({
        id: item.id,
        title: item.title || '',
        image_url: item.image_url || '',
        posted_at: item.posted_at,
        facebook_url: item.facebook_url || null,
        viral_score: item.viral_score || 0,
      }))
    },
  })
}

export function useCostcoDanLogs() {
  return useQuery<string[]>({
    queryKey: ['costcodan-logs'],
    queryFn: async () => {
      const response = await fetch('/api/droplet/logs/costcodan')
      if (!response.ok) {
        return []
      }
      const data = await response.json()
      return Array.isArray(data) ? data : []
    },
    refetchInterval: 5000,
  })
}
