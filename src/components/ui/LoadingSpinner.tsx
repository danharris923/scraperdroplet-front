import { CSpinner } from '@coreui/react'

interface LoadingSpinnerProps {
  size?: 'sm' | undefined
  text?: string
}

export default function LoadingSpinner({ size, text = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="loading-container">
      <div className="text-center">
        <CSpinner color="primary" size={size} />
        <div className="mt-2 text-muted">{text}</div>
      </div>
    </div>
  )
}
