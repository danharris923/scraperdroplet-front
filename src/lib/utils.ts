import { formatDistanceToNow, format, parseISO } from 'date-fns'

export function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return 'Never'
  try {
    const date = parseISO(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return 'Invalid date'
  }
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A'
  try {
    const date = parseISO(dateString)
    return format(date, 'MMM d, yyyy')
  } catch {
    return 'Invalid date'
  }
}

export function formatDateTime(dateString: string | null): string {
  if (!dateString) return 'N/A'
  try {
    const date = parseISO(dateString)
    return format(date, 'MMM d, yyyy h:mm a')
  } catch {
    return 'Invalid date'
  }
}

export function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return 'N/A'
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(price)
}

export function formatPercent(value: number | null): string {
  if (value === null || value === undefined) return 'N/A'
  return `${Math.round(value)}%`
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`)

  return parts.join(' ')
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'success':
    case 'healthy':
      return 'success'
    case 'running':
      return 'info'
    case 'failed':
    case 'critical':
      return 'danger'
    case 'degraded':
      return 'warning'
    default:
      return 'secondary'
  }
}

export function getDiscountBadgeColor(percent: number): string {
  if (percent >= 50) return 'danger'
  if (percent >= 25) return 'warning'
  return 'info'
}
