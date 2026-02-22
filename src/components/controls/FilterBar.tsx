import { useAppContext } from '../../context/AppContext'
import { AMENITY_LABELS } from '../../lib/constants'
import { useMemo } from 'react'

export function FilterBar() {
  const { state, dispatch } = useAppContext()
  const { filters, parks } = state

  const cities = useMemo(() => {
    const unique = Array.from(new Set(parks.map(p => p.city))).sort()
    return unique
  }, [parks])

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4 space-y-4">
      {/* Row 1: Search + City */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Search parks by name, city, or address…"
          value={filters.search}
          onChange={e => dispatch({ type: 'SET_FILTER', payload: { search: e.target.value } })}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Search parks"
        />
        <select
          value={filters.city}
          onChange={e => dispatch({ type: 'SET_FILTER', payload: { city: e.target.value } })}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          aria-label="Filter by city"
        >
          <option value="">All Cities</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Row 2: Amenity checkboxes */}
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {Object.entries(AMENITY_LABELS).map(([key, label]) => (
          <label key={key} className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.amenities[key as keyof typeof filters.amenities]}
              onChange={e =>
                dispatch({
                  type: 'SET_FILTER',
                  payload: {
                    amenities: { ...filters.amenities, [key]: e.target.checked },
                  },
                })
              }
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              aria-label={`Filter by ${label}`}
            />
            {label}
          </label>
        ))}
      </div>

      {/* Row 3: Clear button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}
