import { lazy, Suspense, useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { Header } from './Header'
import { FilterBar } from '../controls/FilterBar'
import { ParkTable } from '../table/ParkTable'
import { LOCAL_STORAGE_VIEW_KEY } from '../../lib/constants'

const ParkMap = lazy(() => import('../map/ParkMap').then(m => ({ default: m.ParkMap })))

function MapLoadingPlaceholder() {
  return (
    <div className="flex items-center justify-center h-[60vh] bg-gray-100 rounded-lg text-gray-500">
      Loading map…
    </div>
  )
}

interface AppShellProps {
  onToggleVisit: (parkId: string) => void
}

export function AppShell({ onToggleVisit }: AppShellProps) {
  const { state, dispatch } = useAppContext()
  const [showPrivateBanner, setShowPrivateBanner] = useState(false)

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

    // Check if localStorage is available
    try {
      localStorage.setItem('dpp_test', '1')
      localStorage.removeItem('dpp_test')
    } catch {
      setShowPrivateBanner(true)
    }
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {showPrivateBanner && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-800 flex items-center justify-between">
          <span>Visit tracking is limited in private browsing mode.</span>
          <button
            type="button"
            onClick={() => setShowPrivateBanner(false)}
            className="ml-4 text-amber-600 hover:text-amber-800 font-medium"
          >
            Dismiss
          </button>
        </div>
      )}
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
