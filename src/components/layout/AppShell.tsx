import { lazy, Suspense, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { Header } from './Header'
import { FilterBar } from '../controls/FilterBar'
import { ParkTable } from '../table/ParkTable'
import { LOCAL_STORAGE_VIEW_KEY } from '../../lib/constants'

const ParkMap = lazy(() => import('../map/ParkMap').then(m => ({ default: m.ParkMap })))

function MapLoadingPlaceholder() {
  return (
    <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg text-gray-500">
      Loading map…
    </div>
  )
}

interface AppShellProps {
  onToggleVisit: (parkId: string) => void
}

export function AppShell({ onToggleVisit }: AppShellProps) {
  const { state, dispatch } = useAppContext()

  // Restore activeView from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_VIEW_KEY)
      if (saved === 'table' || saved === 'map') {
        dispatch({ type: 'SET_VIEW', payload: saved })
      }
    } catch {
      // ignore
    }
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <FilterBar />
        {state.activeView === 'table' ? (
          <ParkTable onToggleVisit={onToggleVisit} />
        ) : (
          <Suspense fallback={<MapLoadingPlaceholder />}>
            <ParkMap onToggleVisit={onToggleVisit} />
          </Suspense>
        )}
      </main>
    </div>
  )
}
