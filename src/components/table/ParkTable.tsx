import { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import { useAppContext } from '../../context/AppContext'
import { getColumnDefs } from './columnDefs'
import { AmenityBadgeGroup } from '../shared/AmenityBadge'
import { VisitedToggle } from '../shared/VisitedToggle'

interface ParkTableProps {
  onToggleVisit: (parkId: string) => void
}

export function ParkTable({ onToggleVisit }: ParkTableProps) {
  const { state } = useAppContext()
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

  const columns = useMemo(() => getColumnDefs({ onToggleVisit }), [onToggleVisit])

  const table = useReactTable({
    data: filteredParks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (state.loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500">
        <span>Loading parks…</span>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-red-600">{state.error}</p>
      </div>
    )
  }

  if (filteredParks.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500">
        <p>No parks match your filters.</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table — hidden on mobile */}
      <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider select-none"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                  >
                    <span className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="text-gray-400">
                          {{ asc: '↑', desc: '↓' }[header.column.getIsSorted() as string] ?? '↕'}
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3 text-sm text-gray-700 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout — shown only on mobile */}
      <div className="sm:hidden space-y-3">
        {filteredParks.map(park => (
          <div key={park.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-base">{park.name}</h3>
                <p className="text-sm text-gray-500">{park.city}</p>
              </div>
              <VisitedToggle park={park} onToggle={onToggleVisit} />
            </div>
            <p className="text-sm text-gray-600">{park.address}</p>
            {park.hours && <p className="text-sm text-gray-500">⏰ {park.hours}</p>}
            {park.acres != null && <p className="text-sm text-gray-500">📐 {park.acres.toFixed(1)} acres</p>}
            <AmenityBadgeGroup park={park} />
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-gray-400 text-right">
        {filteredParks.length} of {parks.length} parks
      </p>
    </>
  )
}
