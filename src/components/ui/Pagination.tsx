import { CPagination, CPaginationItem } from '@coreui/react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: (number | string)[] = []
  const maxVisible = 5

  if (totalPages <= maxVisible + 2) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (currentPage > 3) {
      pages.push('...')
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push('...')
    }

    pages.push(totalPages)
  }

  return (
    <CPagination className="justify-content-center">
      <CPaginationItem
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </CPaginationItem>

      {pages.map((page, index) => (
        typeof page === 'number' ? (
          <CPaginationItem
            key={index}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </CPaginationItem>
        ) : (
          <CPaginationItem key={index} disabled>
            {page}
          </CPaginationItem>
        )
      ))}

      <CPaginationItem
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </CPaginationItem>
    </CPagination>
  )
}
