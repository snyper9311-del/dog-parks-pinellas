import clsx from 'clsx'
import type { DogPark } from '../../types'

interface VisitedToggleProps {
  park: DogPark
  onToggle?: (parkId: string) => void
  className?: string
}

export function VisitedToggle({ park, onToggle, className }: VisitedToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle?.(park.id)}
      aria-label={park.visited ? `Mark ${park.name} as not visited` : `Mark ${park.name} as visited`}
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
        park.visited
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
        className
      )}
    >
      <span aria-hidden="true">{park.visited ? '✓' : '○'}</span>
      {park.visited ? 'Visited' : 'Mark Visited'}
    </button>
  )
}
