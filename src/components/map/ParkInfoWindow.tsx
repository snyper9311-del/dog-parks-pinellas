import { InfoWindow } from '@vis.gl/react-google-maps'
import type { DogPark } from '../../types'
import { AmenityBadgeGroup } from '../shared/AmenityBadge'
import { VisitedToggle } from '../shared/VisitedToggle'
import { trackEvent } from '../../lib/analytics'

interface ParkInfoWindowProps {
  park: DogPark
  onClose: () => void
  onToggleVisit: (parkId: string) => void
}

export function ParkInfoWindow({ park, onClose, onToggleVisit }: ParkInfoWindowProps) {
  return (
    <InfoWindow
      position={{ lat: park.latitude, lng: park.longitude }}
      onCloseClick={onClose}
    >
      <div className="min-w-[200px] max-w-[280px] p-1 space-y-2">
        <div>
          <h3 className="font-semibold text-gray-900 text-base">{park.name}</h3>
          <p className="text-sm text-gray-500">{park.address}, {park.city}</p>
        </div>
        {park.hours && (
          <p className="text-sm text-gray-600">⏰ {park.hours}</p>
        )}
        {park.acres != null && (
          <p className="text-sm text-gray-500">📐 {park.acres.toFixed(1)} acres</p>
        )}
        <AmenityBadgeGroup park={park} />
        {park.website_url && (
          <a
            href={park.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm hover:underline block"
            onClick={() => trackEvent('website_link_clicked', { park_id: park.id, park_name: park.name })}
          >
            Visit Website →
          </a>
        )}
        <div className="pt-1">
          <VisitedToggle park={park} onToggle={onToggleVisit} />
        </div>
      </div>
    </InfoWindow>
  )
}
