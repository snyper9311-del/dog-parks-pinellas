import clsx from 'clsx'
import { AMENITY_LABELS } from '../../lib/constants'
import type { DogPark } from '../../types'

const AMENITY_COLORS: Record<string, string> = {
  is_fenced: 'bg-amber-100 text-amber-800',
  has_small_dog_area: 'bg-purple-100 text-purple-800',
  has_water_station: 'bg-blue-100 text-blue-800',
  has_lighting: 'bg-yellow-100 text-yellow-800',
  has_parking: 'bg-gray-100 text-gray-700',
  has_restrooms: 'bg-teal-100 text-teal-800',
  has_benches_shade: 'bg-green-100 text-green-800',
  is_leash_free: 'bg-orange-100 text-orange-800',
}

interface AmenityBadgeProps {
  amenityKey: string
  className?: string
}

export function AmenityBadge({ amenityKey, className }: AmenityBadgeProps) {
  const label = AMENITY_LABELS[amenityKey] ?? amenityKey
  const color = AMENITY_COLORS[amenityKey] ?? 'bg-gray-100 text-gray-700'
  return (
    <span
      className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', color, className)}
      aria-label={label}
    >
      {label}
    </span>
  )
}

const AMENITY_KEYS = Object.keys(AMENITY_LABELS)

interface AmenityBadgeGroupProps {
  park: DogPark
  className?: string
}

export function AmenityBadgeGroup({ park, className }: AmenityBadgeGroupProps) {
  const active = AMENITY_KEYS.filter(key => park[key as keyof DogPark] === true)
  if (active.length === 0) return <span className="text-gray-400 text-xs">None listed</span>
  return (
    <div className={clsx('flex flex-wrap gap-1', className)}>
      {active.map(key => (
        <AmenityBadge key={key} amenityKey={key} />
      ))}
    </div>
  )
}
