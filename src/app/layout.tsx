import type { Metadata } from 'next'
import QueryProvider from '@/components/QueryProvider'
import DefaultLayout from '@/components/layout/DefaultLayout'
import '@/styles/globals.scss'

export const metadata: Metadata = {
  title: 'Scraper Dashboard',
  description: 'Monitor scrapers and browse product catalog',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <DefaultLayout>{children}</DefaultLayout>
        </QueryProvider>
      </body>
    </html>
  )
}
