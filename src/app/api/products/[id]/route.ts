import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import type { ProductDetail, PricePoint } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const supabase = getServiceSupabase()

    // Determine source from ID prefix
    const [source, rawId] = id.includes('_')
      ? [id.split('_')[0], id.split('_').slice(1).join('_')]
      : ['deal', id]

    let product: ProductDetail | null = null
    let priceHistory: PricePoint[] = []

    if (source === 'deal') {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('id', rawId)
        .single()

      if (error || !data) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }

      product = {
        id: `deal_${data.id}`,
        title: data.title || '',
        brand: data.brand || null,
        store: data.store || 'Unknown',
        source: data.source || 'deals',
        image_url: data.image_blob_url || data.image_url || null,
        current_price: data.current_price || data.price,
        original_price: data.original_price,
        discount_percent: data.discount_percent,
        category: data.category || null,
        region: data.region || null,
        affiliate_url: data.affiliate_url || data.url || '#',
        is_active: data.is_active !== false,
        first_seen_at: data.date_added || data.created_at,
        last_seen_at: data.date_updated || data.updated_at || data.created_at,
        description: data.description || undefined,
        price_history: [],
      }

      // Try to get price history if table exists
      const { data: historyData } = await supabase
        .from('price_history')
        .select('*')
        .eq('deal_id', rawId)
        .order('scraped_at', { ascending: true })
        .limit(90)

      if (historyData) {
        priceHistory = historyData.map((h) => ({
          price: h.price,
          original_price: h.original_price,
          scraped_at: h.scraped_at,
          is_on_sale: h.is_on_sale || false,
        }))
      }
    } else if (source === 'retailer') {
      const { data, error } = await supabase
        .from('retailer_products')
        .select('*')
        .eq('id', rawId)
        .single()

      if (error || !data) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }

      // Get image from images array or thumbnail_url
      const images = data.images || []
      const imageUrl = images.length > 0 ? images[0] : (data.thumbnail_url && !data.thumbnail_url.includes('LogoMobile') ? data.thumbnail_url : null)

      // Determine store name from multiple sources
      let store = 'Unknown'
      let sourceLabel = 'retailer'

      if (data.retailer_sku && data.retailer_sku.includes('_')) {
        store = data.retailer_sku.split('_')[0]
        sourceLabel = 'Flipp'
      } else if (data.affiliate_url?.includes('flipp.com')) {
        sourceLabel = 'Flipp'
      } else if (data.extra_data?.source) {
        store = data.extra_data.source
        sourceLabel = data.extra_data.source
      } else if (data.retailer_url) {
        try {
          const domain = new URL(data.retailer_url).hostname.replace('www.', '').split('.')[0]
          store = domain.charAt(0).toUpperCase() + domain.slice(1)
        } catch {
          // Invalid URL
        }
      }

      product = {
        id: `retailer_${data.id}`,
        title: data.title || '',
        brand: data.brand || null,
        store,
        source: sourceLabel,
        image_url: imageUrl,
        current_price: data.current_price,
        original_price: data.original_price,
        discount_percent: data.sale_percentage || data.discount_percent,
        category: data.retailer_category || null,
        region: data.extra_data?.region || null,
        affiliate_url: data.affiliate_url || data.retailer_url || '#',
        is_active: data.is_active !== false,
        first_seen_at: data.first_seen_at,
        last_seen_at: data.last_seen_at || data.first_seen_at,
        description: data.description || undefined,
        price_history: [],
      }

      // Try to get price history
      const { data: historyData } = await supabase
        .from('retailer_price_history')
        .select('*')
        .eq('product_id', rawId)
        .order('scraped_at', { ascending: true })
        .limit(90)

      if (historyData) {
        priceHistory = historyData.map((h) => ({
          price: h.price,
          original_price: h.original_price,
          scraped_at: h.scraped_at,
          is_on_sale: h.is_on_sale || false,
        }))
      }
    } else if (source === 'costco') {
      const { data, error } = await supabase
        .from('costco_products')
        .select('*')
        .eq('id', rawId)
        .single()

      if (error || !data) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }

      product = {
        id: `costco_${data.id}`,
        title: data.name || '',
        brand: null,
        store: 'Costco',
        source: data.source || 'cocopricetracker',
        image_url: data.image_url || null,
        current_price: data.current_price,
        original_price: null,
        discount_percent: null,
        category: data.category || null,
        region: data.region || null,
        affiliate_url: data.item_id ? `https://www.costco.ca/CatalogSearch?keyword=${data.item_id}` : '#',
        is_active: data.is_active !== false,
        first_seen_at: data.first_seen_at,
        last_seen_at: data.last_updated_at || data.first_seen_at,
        description: undefined,
        price_history: [],
      }

      // Get price history from costco_price_history
      const { data: historyData } = await supabase
        .from('costco_price_history')
        .select('*')
        .eq('product_id', rawId)
        .order('recorded_at', { ascending: true })
        .limit(90)

      if (historyData) {
        priceHistory = historyData.map((h) => ({
          price: h.price,
          original_price: null,
          scraped_at: h.recorded_at,
          is_on_sale: false,
        }))
      }
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    product.price_history = priceHistory

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product detail API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
