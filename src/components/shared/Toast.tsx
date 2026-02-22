import { useEffect } from 'react'

interface ToastProps {
  message: string
  onDismiss: () => void
}

export function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm"
    >
      <span className="flex-1 text-sm">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="text-white hover:text-red-200 font-bold"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  )
}
