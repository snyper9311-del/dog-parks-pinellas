import { AdvancedMarker } from '@vis.gl/react-google-maps'
import type { DogPark } from '../../types'

interface ParkMarkerProps {
  park: DogPark
  onClick: (parkId: string) => void
}

export function ParkMarker({ park, onClick }: ParkMarkerProps) {
  return (
    <AdvancedMarker
      position={{ lat: park.latitude, lng: park.longitude }}
      onClick={() => onClick(park.id)}
      title={park.name}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: `3px solid ${park.visited ? '#16a34a' : '#1d4ed8'}`,
          backgroundColor: park.visited ? '#22c55e' : '#3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        }}
        aria-label={`${park.name}${park.visited ? ' (visited)' : ''}`}
      >
        {park.visited ? '✓' : '🐾'}
      </div>
    </AdvancedMarker>
  )
}
