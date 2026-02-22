import type { ColumnDef } from '@tanstack/react-table'
import type { DogPark } from '../../types'
import { AmenityBadgeGroup } from '../shared/AmenityBadge'
import { VisitedToggle } from '../shared/VisitedToggle'

interface ColumnDefsOptions {
  onToggleVisit: (parkId: string) => void
}

export function getColumnDefs({ onToggleVisit }: ColumnDefsOptions): ColumnDef<DogPark>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Park Name',
      enableSorting: true,
      cell: ({ getValue }) => (
        <span className="font-medium text-gray-900">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: 'city',
      header: 'City',
      enableSorting: true,
    },
    {
      accessorKey: 'address',
      header: 'Address',
      enableSorting: false,
      cell: ({ getValue }) => (
        <span className="text-gray-600 text-sm">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: 'acres',
      header: 'Acres',
      enableSorting: true,
      cell: ({ getValue }) => {
        const val = getValue<number | null>()
        return <span className="text-gray-600">{val != null ? val.toFixed(1) : '—'}</span>
      },
    },
    {
      id: 'amenities',
      header: 'Amenities',
      enableSorting: false,
      cell: ({ row }) => <AmenityBadgeGroup park={row.original} />,
    },
    {
      accessorKey: 'hours',
      header: 'Hours',
      enableSorting: false,
      cell: ({ getValue }) => (
        <span className="text-gray-600 text-sm">{getValue<string | null>() ?? '—'}</span>
      ),
    },
    {
      id: 'visited',
      header: 'Visited',
      enableSorting: false,
      cell: ({ row }) => (
        <VisitedToggle park={row.original} onToggle={onToggleVisit} />
      ),
    },
  ]
}
