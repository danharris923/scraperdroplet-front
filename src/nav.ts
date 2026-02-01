import { cilSpeedometer, cilCart, cilStorage, cilBasket } from '@coreui/icons'

export interface NavItem {
  name: string
  to: string
  icon: string[]
  badge?: {
    color: string
    text: string
  }
}

export const navigation: NavItem[] = [
  {
    name: 'Scraper Dashboard',
    to: '/dashboard',
    icon: cilSpeedometer,
  },
  {
    name: 'Costco Dan',
    to: '/costcodan',
    icon: cilCart,
  },
  {
    name: 'Server Status',
    to: '/server',
    icon: cilStorage,
  },
  {
    name: 'Products',
    to: '/products',
    icon: cilBasket,
    badge: { color: 'info', text: 'CATALOG' },
  },
]
