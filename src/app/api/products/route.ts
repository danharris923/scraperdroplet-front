import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import type { Product } from '@/types'

export const dynamic = 'force-dynamic'

// All deal tables to query
const DEAL_TABLES = [
  { name: 'deals', source: null }, // source comes from data
  { name: 'amazon_ca_deals', source: 'amazon_ca' },
  { name: 'cabelas_ca_deals', source: 'cabelas_ca' },
  { name: 'frank_and_oak_deals', source: 'frank_and_oak' },
  { name: 'leons_deals', source: 'leons' },
  { name: 'mastermind_toys_deals', source: 'mastermind_toys' },
  { name: 'reebok_ca_deals', source: 'reebok_ca' },
  { name: 'the_brick_deals', source: 'the_brick' },
  { name: 'yepsavings_deals', source: 'yepsavings' },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const sources = searchParams.get('sources')?.split(',').filter(Boolean) || []
    const stores = searchParams.get('stores')?.split(',').filter(Boolean) || []
    const regions = searchParams.get('regions')?.split(',').filter(Boolean) || []
    const minDiscount = searchParams.get('minDiscount')
      ? parseInt(searchParams.get('minDiscount')!)
      : null
    const maxPrice = searchParams.get('maxPrice')
      ? parseFloat(searchParams.get('maxPrice')!)
      : null
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'last_seen_at'
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? true : false
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '24')

    const supabase = getServiceSupabase()

    // Determine which tables to query based on source filter
    const sourcesToQuery = sources.length > 0 ? sources : null // null = all sources

    // Build queries for all deal tables
    const dealQueries: Promise<any>[] = []
    const countQueries: Promise<any>[] = []

    for (const table of DEAL_TABLES) {
      // Skip if source filter doesn't match this table
      if (sourcesToQuery && table.source && !sourcesToQuery.includes(table.source)) {
        continue
      }
      // For main deals table, check if any of the sources match
      if (table.name === 'deals' && sourcesToQuery) {
        const dealsSourcesInFilter = sourcesToQuery.filter(s =>
          ['rfd', 'flipp', 'amazon', 'costco'].includes(s.toLowerCase())
        )
        if (dealsSourcesInFilter.length === 0 && !sourcesToQuery.some(s => s.toLowerCase().includes('deal'))) {
          continue
        }
      }

      let query = supabase.from(table.name).select('*')
      let countQuery = supabase.from(table.name).select('*', { count: 'exact', head: true })

      if (search) {
        query = query.ilike('title', `%${search}%`)
        countQuery = countQuery.ilike('title', `%${search}%`)
      }
      if (stores.length > 0) {
        query = query.in('store', stores)
        countQuery = countQuery.in('store', stores)
      }
      if (minDiscount !== null) {
        query = query.gte('discount_percent', minDiscount)
        countQuery = countQuery.gte('discount_percent', minDiscount)
      }
      if (maxPrice !== null) {
        query = query.lte('current_price', maxPrice)
        countQuery = countQuery.lte('current_price', maxPrice)
      }

      dealQueries.push(
        (async () => {
          const r = await query.order('created_at', { ascending: sortOrder, nullsFirst: false }).limit(limit)
          return { table: table.name, source: table.source, data: r.data, error: r.error }
        })()
      )
      countQueries.push(
        (async () => {
          const r = await countQuery
          return { table: table.name, count: r.count || 0 }
        })()
      )
    }

    // Query retailer_products
    let retailerQuery = supabase.from('retailer_products').select('*')
    let retailerCountQuery = supabase.from('retailer_products').select('*', { count: 'exact', head: true })

    if (search) {
      retailerQuery = retailerQuery.ilike('title', `%${search}%`)
      retailerCountQuery = retailerCountQuery.ilike('title', `%${search}%`)
    }
    if (regions.length > 0) {
      retailerQuery = retailerQuery.in('region', regions)
      retailerCountQuery = retailerCountQuery.in('region', regions)
    }
    if (minDiscount !== null) {
      retailerQuery = retailerQuery.gte('sale_percentage', minDiscount)
      retailerCountQuery = retailerCountQuery.gte('sale_percentage', minDiscount)
    }
    if (maxPrice !== null) {
      retailerQuery = retailerQuery.lte('current_price', maxPrice)
      retailerCountQuery = retailerCountQuery.lte('current_price', maxPrice)
    }

    // Query costco_user_photos
    let costcoQuery = supabase.from('costco_user_photos').select('*')
    let costcoCountQuery = supabase.from('costco_user_photos').select('*', { count: 'exact', head: true })

    if (search) {
      costcoQuery = costcoQuery.ilike('name', `%${search}%`)
      costcoCountQuery = costcoCountQuery.ilike('name', `%${search}%`)
    }
    if (regions.length > 0) {
      costcoQuery = costcoQuery.ilike('region', `%${regions[0]}%`)
      costcoCountQuery = costcoCountQuery.ilike('region', `%${regions[0]}%`)
    }
    if (minDiscount !== null) {
      costcoQuery = costcoQuery.gte('discount_percent', minDiscount)
      costcoCountQuery = costcoCountQuery.gte('discount_percent', minDiscount)
    }
    if (maxPrice !== null) {
      costcoQuery = costcoQuery.lte('price', maxPrice)
      costcoCountQuery = costcoCountQuery.lte('price', maxPrice)
    }

    // Skip retailer/costco if source filter excludes them
    const includeRetailer = !sourcesToQuery || sourcesToQuery.some(s =>
      ['flipp', 'amazon', 'leons', 'retailer'].includes(s.toLowerCase())
    )
    const includeCostco = !sourcesToQuery || sourcesToQuery.some(s =>
      ['cocowest', 'costco', 'costcodan', 'warehouse_runner', 'cocopricetracker'].includes(s.toLowerCase())
    )

    // Run all queries in parallel
    const [dealResults, countResults, retailerResult, retailerCountResult, costcoResult, costcoCountResult] = await Promise.all([
      Promise.all(dealQueries),
      Promise.all(countQueries),
      includeRetailer ? retailerQuery.order('first_seen_at', { ascending: sortOrder, nullsFirst: false }).limit(limit) : Promise.resolve({ data: [] }),
      includeRetailer ? retailerCountQuery : Promise.resolve({ count: 0 }),
      includeCostco ? costcoQuery.order('scraped_at', { ascending: sortOrder, nullsFirst: false }).limit(limit) : Promise.resolve({ data: [] }),
      includeCostco ? costcoCountQuery : Promise.resolve({ count: 0 }),
    ])

    // Calculate totals
    let grandTotal = countResults.reduce((sum, r) => sum + (r.count || 0), 0)
    grandTotal += (retailerCountResult as any).count || 0
    grandTotal += (costcoCountResult as any).count || 0

    // Normalize all deal results
    const allProducts: Product[] = []

    for (const result of dealResults) {
      if (result.error || !result.data) continue
      for (const d of result.data) {
        allProducts.push({
          id: `${result.table}_${d.id}`,
          title: d.title || d.name || '',
          brand: d.brand || null,
          store: d.store || result.source || 'Unknown',
          source: d.source || result.source || result.table.replace('_deals', ''),
          image_url: d.image_blob_url || d.image_url || d.thumbnail_url || null,
          current_price: d.current_price || d.price,
          original_price: d.original_price,
          discount_percent: d.discount_percent,
          category: d.category || null,
          region: d.region || null,
          affiliate_url: d.affiliate_url || d.url || d.product_url || '#',
          is_active: d.is_active !== false,
          first_seen_at: d.date_added || d.created_at || d.first_seen_at,
          last_seen_at: d.date_updated || d.updated_at || d.last_seen_at || d.created_at,
        })
      }
    }

    // Normalize retailer_products
    if (retailerResult.data) {
      for (const r of retailerResult.data) {
        const images = r.images || []
        const imageUrl = images.length > 0 ? images[0] : (r.thumbnail_url && !r.thumbnail_url.includes('LogoMobile') ? r.thumbnail_url : null)

        let store = 'Unknown'
        let source = 'Flipp'

        if (r.retailer_sku && r.retailer_sku.includes('_')) {
          store = r.retailer_sku.split('_')[0]
        } else if (r.affiliate_url) {
          try {
            const url = new URL(r.affiliate_url)
            const hostname = url.hostname.replace('www.', '')
            if (hostname.includes('amazon')) {
              store = 'Amazon'
              source = 'Amazon'
            } else if (hostname.includes('leons')) {
              store = 'Leons'
              source = 'Leons'
            } else {
              const domain = hostname.split('.')[0]
              store = domain.charAt(0).toUpperCase() + domain.slice(1)
              source = store
            }
          } catch {}
        }

        allProducts.push({
          id: `retailer_${r.id}`,
          title: r.title || '',
          brand: r.brand || null,
          store,
          source,
          image_url: imageUrl,
          current_price: r.current_price,
          original_price: r.original_price,
          discount_percent: r.sale_percentage || r.discount_percent,
          category: r.retailer_category || null,
          region: r.region || null,
          affiliate_url: r.affiliate_url || r.retailer_url || '#',
          is_active: r.is_active !== false,
          first_seen_at: r.first_seen_at,
          last_seen_at: r.last_seen_at || r.first_seen_at,
        })
      }
    }

    // Normalize costco_user_photos
    if (costcoResult.data) {
      for (const c of costcoResult.data) {
        allProducts.push({
          id: `costco_photo_${c.id}`,
          title: c.name || '',
          brand: null,
          store: 'Costco',
          source: c.source || 'cocowest',
          image_url: c.processed_url || c.original_url,
          current_price: c.price,
          original_price: c.original_price,
          discount_percent: c.discount_percent,
          category: null,
          region: c.region,
          affiliate_url: `https://www.costco.ca/CatalogSearch?keyword=${c.sku}`,
          is_active: true,
          first_seen_at: c.scraped_at || c.created_at,
          last_seen_at: c.updated_at || c.scraped_at,
        })
      }
    }

    // Sort combined results
    if (sortBy === 'discount_percent') {
      allProducts.sort((a, b) => {
        const aVal = a.discount_percent || 0
        const bVal = b.discount_percent || 0
        return sortOrder ? aVal - bVal : bVal - aVal
      })
    } else {
      allProducts.sort((a, b) => {
        const aDate = new Date(a.last_seen_at).getTime()
        const bDate = new Date(b.last_seen_at).getTime()
        return sortOrder ? aDate - bDate : bDate - aDate
      })
    }

    // Paginate
    const paginatedProducts = allProducts.slice(0, limit)

    return NextResponse.json({
      products: paginatedProducts,
      total: grandTotal,
      page,
      limit,
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
