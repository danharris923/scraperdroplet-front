'use client'

import { usePathname } from 'next/navigation'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

function getPageTitle(pathname: string): string {
  switch (pathname) {
    case '/dashboard':
      return 'Scraper Dashboard'
    case '/costcodan':
      return 'Costco Dan Engine'
    case '/server':
      return 'Server Status'
    case '/products':
      return 'Product Catalog'
    default:
      return 'Dashboard'
  }
}

export default function AppHeader() {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)

  return (
    <header className="header">
      <CBreadcrumb className="mb-0">
        <CBreadcrumbItem href="/dashboard">Home</CBreadcrumbItem>
        <CBreadcrumbItem active>{pageTitle}</CBreadcrumbItem>
      </CBreadcrumb>
    </header>
  )
}
