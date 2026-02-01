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
        image_url: data.image_url || null,
        current_price: data.current_price,
        original_price: data.original_price,
        discount_percent: data.discount_percent,
        category: data.category || null,
        region: data.region || null,
        affiliate_url: data.url || data.affiliate_url || '#',
        is_active: data.is_active !== false,
        first_seen_at: data.created_at,
        last_seen_at: data.updated_at || data.created_at,
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

      product = {
        id: `retailer_${data.id}`,
        title: data.title || '',
        brand: data.brand || null,
        store: data.store || 'Unknown',
        source: data.source || 'retailer',
        image_url: data.image_url || null,
        current_price: data.current_price,
        original_price: data.original_price,
        discount_percent: data.discount_percent,
        category: data.category || null,
        region: data.region || null,
        affiliate_url: data.url || data.affiliate_url || '#',
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
