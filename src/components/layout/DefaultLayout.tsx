'use client'

import AppSidebar from './AppSidebar'
import AppHeader from './AppHeader'
import AppFooter from './AppFooter'

interface DefaultLayoutProps {
  children: React.ReactNode
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="wrapper">
      <div className="body">
        <AppSidebar />
        <div className="main-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <AppHeader />
          <main className="main">
            {children}
          </main>
          <AppFooter />
        </div>
      </div>
    </div>
  )
}
