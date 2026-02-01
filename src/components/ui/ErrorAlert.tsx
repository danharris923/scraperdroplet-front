import { CAlert } from '@coreui/react'

interface ErrorAlertProps {
  message: string
  onRetry?: () => void
}

export default function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <CAlert color="danger">
      <strong>Error:</strong> {message}
      {onRetry && (
        <button
          className="btn btn-link text-danger p-0 ms-2"
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </CAlert>
  )
}
