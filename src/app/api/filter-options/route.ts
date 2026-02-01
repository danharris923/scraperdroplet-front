import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// All sources/scrapers in the system
const ALL_SOURCES = [
  // Main deal sources
  { value: 'rfd', label: 'RedFlagDeals' },
  { value: 'flipp', label: 'Flipp' },
  { value: 'amazon', label: 'Amazon' },
  // Separate scraper tables
  { value: 'amazon_ca', label: 'Amazon CA' },
  { value: 'cabelas_ca', label: "Cabela's CA" },
  { value: 'frank_and_oak', label: 'Frank And Oak' },
  { value: 'leons', label: "Leon's" },
  { value: 'mastermind_toys', label: 'Mastermind Toys' },
  { value: 'reebok_ca', label: 'Reebok CA' },
  { value: 'the_brick', label: 'The Brick' },
  { value: 'yepsavings', label: 'YepSavings' },
  // Costco scrapers
  { value: 'cocowest', label: 'CocoWest' },
  { value: 'costcodan', label: 'Costco Dan' },
  { value: 'warehouse_runner', label: 'Warehouse Runner' },
  { value: 'cocopricetracker', label: 'Coco Price Tracker' },
]

export async function GET() {
  try {
    const supabase = getServiceSupabase()

    // Get counts for each table to determine which sources have data
    const [
      dealsCount,
      retailerCount,
      costcoPhotosCount,
      amazonCaCount,
      cabelasCount,
      frankOakCount,
      leonsCount,
      mastermindCount,
      reebokCount,
      brickCount,
      yepsavingsCount,
    ] = await Promise.all([
      supabase.from('deals').select('*', { count: 'exact', head: true }),
      supabase.from('retailer_products').select('*', { count: 'exact', head: true }),
      supabase.from('costco_user_photos').select('*', { count: 'exact', head: true }),
      supabase.from('amazon_ca_deals').select('*', { count: 'exact', head: true }),
      supabase.from('cabelas_ca_deals').select('*', { count: 'exact', head: true }),
      supabase.from('frank_and_oak_deals').select('*', { count: 'exact', head: true }),
      supabase.from('leons_deals').select('*', { count: 'exact', head: true }),
      supabase.from('mastermind_toys_deals').select('*', { count: 'exact', head: true }),
      supabase.from('reebok_ca_deals').select('*', { count: 'exact', head: true }),
      supabase.from('the_brick_deals').select('*', { count: 'exact', head: true }),
      supabase.from('yepsavings_deals').select('*', { count: 'exact', head: true }),
    ])

    // Get unique stores from deals table
    const { data: dealsStores } = await supabase
      .from('deals')
      .select('store')
      .limit(1000)

    // Get unique costco sources
    const { data: costcoSources } = await supabase
      .from('costco_user_photos')
      .select('source')
      .limit(1000)

    // Build sources list with counts
    const sourcesWithData: { value: string; label: string; count: number }[] = []

    // Add sources that have data
    if ((dealsCount.count || 0) > 0) {
      sourcesWithData.push({ value: 'rfd', label: 'RedFlagDeals', count: dealsCount.count || 0 })
      sourcesWithData.push({ value: 'flipp', label: 'Flipp', count: 0 }) // Part of deals
    }
    if ((retailerCount.count || 0) > 0) {
      sourcesWithData.push({ value: 'amazon', label: 'Amazon (Retailer)', count: retailerCount.count || 0 })
    }
    if ((amazonCaCount.count || 0) > 0) {
      sourcesWithData.push({ value: 'amazon_ca', label: 'Amazon CA', count: amazonCaCount.count || 0 })
    }
    if ((cabelasCount.count || 0) > 0) {
      sourcesWithData.push({ value: 'cabelas_ca', label: "Cabela's CA", count: cabelasCount.count || 0 })
    }
    if ((frankOakCount.count || 0) > 0) {
      sourcesWithData.push({ value: 'frank_and_oak', label: 'Frank And Oak', count: frankOakCount.count || 0 })
    }
    if ((leonsCount.count || 0) > 0) {
      sourcesWithData.push({ value: 'leons', label: "Leon's", count: leonsCount.count || 0 })
    }
    if ((mastermindCount.count || 0) > 0) {
      sourcesWithData.push({ value: 'mastermind_toys', label: 'Mastermind Toys', count: mastermindCount.count || 0 })
    }
    if ((reebokCount.count || 0) > 0) {
      sourcesWithData.push({ value: 'reebok_ca', label: 'Reebok CA', count: reebokCount.count || 0 })
    }
    if ((brickCount.count || 0) > 0) {
      sourcesWithData.push({ value: 'the_brick', label: 'The Brick', count: brickCount.count || 0 })
    }
    if ((yepsavingsCount.count || 0) > 0) {
      sourcesWithData.push({ value: 'yepsavings', label: 'YepSavings', count: yepsavingsCount.count || 0 })
    }
    if ((costcoPhotosCount.count || 0) > 0) {
      sourcesWithData.push({ value: 'cocowest', label: 'CocoWest (Costco Photos)', count: costcoPhotosCount.count || 0 })
    }

    // Collect unique stores
    const storesSet = new Set<string>()
    if (dealsStores) {
      dealsStores.forEach((row: any) => {
        if (row.store) storesSet.add(row.store)
      })
    }
    // Add Costco for costco_user_photos
    if ((costcoPhotosCount.count || 0) > 0) {
      storesSet.add('Costco')
    }

    // Get regions from costco_user_photos
    const regionsSet = new Set<string>()
    if (costcoSources) {
      // Costco photos have region like "BC/AB/SK/MB"
      const { data: costcoRegions } = await supabase
        .from('costco_user_photos')
        .select('region')
        .limit(100)
      if (costcoRegions) {
        costcoRegions.forEach((row: any) => {
          if (row.region) {
            // Split compound regions
            row.region.split('/').forEach((r: string) => regionsSet.add(r.trim()))
          }
        })
      }
    }

    const sources = sourcesWithData.map(s => ({
      value: s.value,
      label: `${s.label} (${s.count.toLocaleString()})`,
    }))

    const stores = Array.from(storesSet).sort().map(s => ({
      value: s,
      label: s,
    }))

    const regions = Array.from(regionsSet).sort().map(r => ({
      value: r,
      label: r,
    }))

    // Calculate grand total
    const grandTotal = (dealsCount.count || 0) +
      (retailerCount.count || 0) +
      (costcoPhotosCount.count || 0) +
      (amazonCaCount.count || 0) +
      (cabelasCount.count || 0) +
      (frankOakCount.count || 0) +
      (leonsCount.count || 0) +
      (mastermindCount.count || 0) +
      (reebokCount.count || 0) +
      (brickCount.count || 0) +
      (yepsavingsCount.count || 0)

    return NextResponse.json({
      sources,
      stores,
      regions,
      counts: {
        sources: sources.length,
        stores: stores.length,
        regions: regions.length,
        totalProducts: grandTotal,
      },
    })
  } catch (error: any) {
    console.error('Filter options error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
