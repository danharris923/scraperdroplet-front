'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CIcon from '@coreui/icons-react'
import { CBadge } from '@coreui/react'
import { navigation } from '@/nav'

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar">
      <Link href="/dashboard" className="sidebar-brand">
        Scraper Dashboard
      </Link>
      <nav className="sidebar-nav">
        {navigation.map((item) => {
          const isActive = pathname === item.to || pathname.startsWith(item.to + '/')
          return (
            <Link
              key={item.to}
              href={item.to}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <CIcon icon={item.icon as unknown as string[]} className="nav-icon" />
              <span>{item.name}</span>
              {item.badge && (
                <CBadge color={item.badge.color} className="ms-auto">
                  {item.badge.text}
                </CBadge>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
