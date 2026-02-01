'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import type { PricePoint } from '@/types'
import { formatPrice } from '@/lib/utils'

interface PriceChartProps {
  priceHistory: PricePoint[]
}

export default function PriceChart({ priceHistory }: PriceChartProps) {
  if (!priceHistory || priceHistory.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        No price history available
      </div>
    )
  }

  const data = priceHistory.map((point) => ({
    date: format(parseISO(point.scraped_at), 'MMM d'),
    price: point.price,
    original: point.original_price,
  }))

  const prices = priceHistory.map((p) => p.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const currentPrice = prices[prices.length - 1]

  return (
    <div className="price-chart-container">
      <div className="d-flex justify-content-between mb-3">
        <div>
          <small className="text-muted">Current</small>
          <div className="fw-bold">{formatPrice(currentPrice)}</div>
        </div>
        <div className="text-end">
          <small className="text-muted">Lowest</small>
          <div className="fw-bold text-success">{formatPrice(minPrice)}</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
            domain={[minPrice * 0.9, maxPrice * 1.1]}
          />
          <Tooltip
            formatter={(value: number) => [formatPrice(value), 'Price']}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#321fdb"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {currentPrice === minPrice && (
        <div className="text-center mt-2">
          <span className="badge bg-success">Lowest price!</span>
        </div>
      )}
    </div>
  )
}
