import { useState, useEffect, useMemo } from 'react'
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps'
import { useAppContext } from '../../context/AppContext'
import { PINELLAS_CENTER, PINELLAS_DEFAULT_ZOOM } from '../../lib/constants'
import { ParkMarker } from './ParkMarker'
import { ParkInfoWindow } from './ParkInfoWindow'
import { trackEvent } from '../../lib/analytics'

interface MapContentProps {
  onToggleVisit: (parkId: string) => void
}

function MapContent({ onToggleVisit }: MapContentProps) {
  const { state } = useAppContext()
  const map = useMap()
  const [selectedParkId, setSelectedParkId] = useState<string | null>(null)

  const { parks, filters } = state

  const filteredParks = useMemo(() => {
    return parks.filter(park => {
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (
          !park.name.toLowerCase().includes(q) &&
          !park.city.toLowerCase().includes(q) &&
          !park.address.toLowerCase().includes(q)
        ) return false
      }
      if (filters.city && park.city !== filters.city) return false
      for (const [key, required] of Object.entries(filters.amenities)) {
        if (required && !park[key as keyof typeof park]) return false
      }
      return true
    })
  }, [parks, filters])

  // Fit map bounds to all filtered parks on load / when parks change
  useEffect(() => {
    if (!map || filteredParks.length === 0) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const GoogleMaps = (window as any).google.maps as {
      LatLngBounds: new () => {
        extend(latLng: { lat: number; lng: number }): void
      }
    }
    const bounds = new GoogleMaps.LatLngBounds()
    filteredParks.forEach(p => bounds.extend({ lat: p.latitude, lng: p.longitude }))
    map.fitBounds(bounds as Parameters<typeof map.fitBounds>[0], 40)
  }, [map, filteredParks.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const selectedPark = filteredParks.find(p => p.id === selectedParkId) ?? null

  function handleMarkerClick(parkId: string) {
    setSelectedParkId(parkId)
    const park = parks.find(p => p.id === parkId)
    if (park) trackEvent('marker_clicked', { park_id: parkId, park_name: park.name })
  }

  return (
    <>
      {filteredParks.map(park => (
        <ParkMarker key={park.id} park={park} onClick={handleMarkerClick} />
      ))}
      {selectedPark && (
        <ParkInfoWindow
          park={selectedPark}
          onClose={() => setSelectedParkId(null)}
          onToggleVisit={onToggleVisit}
        />
      )}
    </>
  )
}

interface ParkMapProps {
  onToggleVisit: (parkId: string) => void
}

export function ParkMap({ onToggleVisit }: ParkMapProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID as string

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={PINELLAS_CENTER}
        defaultZoom={PINELLAS_DEFAULT_ZOOM}
        mapId={mapId}
        style={{ width: '100%', height: 'min(600px, 80vh)', borderRadius: '0.5rem' }}
        gestureHandling="greedy"
      >
        <MapContent onToggleVisit={onToggleVisit} />
      </Map>
    </APIProvider>
  )
}
