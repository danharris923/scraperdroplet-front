import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = getServiceSupabase()

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayISO = today.toISOString()

    const [dealsCount, retailerCount, newDealsCount, newRetailerCount] = await Promise.all([
      supabase.from('deals').select('*', { count: 'exact', head: true }),
      supabase.from('retailer_products').select('*', { count: 'exact', head: true }),
      supabase
        .from('deals')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayISO),
      supabase
        .from('retailer_products')
        .select('*', { count: 'exact', head: true })
        .gte('first_seen_at', todayISO),
    ])

    const totalProducts = (dealsCount.count || 0) + (retailerCount.count || 0)
    const newToday = (newDealsCount.count || 0) + (newRetailerCount.count || 0)

    let activeScrapers = 0
    let errorCount = 0

    try {
      const dropletResponse = await fetch(
        `${process.env.DROPLET_API_URL || 'http://146.190.240.167:8080'}/scrapers`,
        { cache: 'no-store' }
      )
      if (dropletResponse.ok) {
        const scrapers = await dropletResponse.json()
        if (Array.isArray(scrapers)) {
          activeScrapers = scrapers.filter((s: { timer_enabled?: boolean }) => s.timer_enabled).length
          errorCount = scrapers.reduce((acc: number, s: { errors?: number }) => acc + (s.errors || 0), 0)
        }
      }
    } catch {
      // Droplet API not available
    }

    return NextResponse.json({
      totalProducts,
      newToday,
      activeScrapers,
      errorCount,
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
