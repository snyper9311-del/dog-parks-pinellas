import clsx from 'clsx'
import { useAppContext } from '../../context/AppContext'
import { LOCAL_STORAGE_VIEW_KEY } from '../../lib/constants'

export function ViewToggle() {
  const { state, dispatch } = useAppContext()

  function setView(view: 'table' | 'map') {
    dispatch({ type: 'SET_VIEW', payload: view })
    try {
      localStorage.setItem(LOCAL_STORAGE_VIEW_KEY, view)
    } catch {
      // ignore localStorage errors
    }
  }

  return (
    <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden" role="group" aria-label="Switch view">
      {(['table', 'map'] as const).map(view => (
        <button
          key={view}
          type="button"
          onClick={() => setView(view)}
          className={clsx(
            'px-4 py-2 text-sm font-medium capitalize transition-colors',
            state.activeView === view
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          )}
          aria-pressed={state.activeView === view}
        >
          {view === 'table' ? '📋 Table' : '🗺️ Map'}
        </button>
      ))}
    </div>
  )
}
