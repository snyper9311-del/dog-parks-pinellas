import { describe, it, expect } from 'vitest'
import { appReducer, initialState, initialFilters } from './appReducer'
import type { DogPark } from '../types'

const mockPark: DogPark = {
  id: 'park-1',
  name: 'Test Park',
  address: '123 Main St',
  city: 'Clearwater',
  state: 'FL',
  zip_code: '33755',
  latitude: 27.96,
  longitude: -82.80,
  acres: 2.0,
  size_label: 'Medium',
  is_fenced: true,
  has_small_dog_area: false,
  has_water_station: true,
  has_lighting: false,
  has_parking: true,
  has_restrooms: false,
  has_benches_shade: true,
  is_leash_free: true,
  hours: 'Sunrise to Sunset',
  phone: null,
  website_url: null,
  notes: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  visited: false,
}

const stateWithPark = { ...initialState, parks: [mockPark] }

describe('appReducer', () => {
  it('SET_PARKS replaces parks array and clears loading', () => {
    const parks = [mockPark]
    const next = appReducer(initialState, { type: 'SET_PARKS', payload: parks })
    expect(next.parks).toEqual(parks)
    expect(next.loading).toBe(false)
    expect(next.error).toBeNull()
  })

  it('TOGGLE_VISIT_OPTIMISTIC flips visited flag from false to true', () => {
    const next = appReducer(stateWithPark, {
      type: 'TOGGLE_VISIT_OPTIMISTIC',
      payload: { parkId: 'park-1' },
    })
    expect(next.parks[0].visited).toBe(true)
  })

  it('TOGGLE_VISIT_OPTIMISTIC flips visited flag from true to false', () => {
    const visitedState = { ...stateWithPark, parks: [{ ...mockPark, visited: true }] }
    const next = appReducer(visitedState, {
      type: 'TOGGLE_VISIT_OPTIMISTIC',
      payload: { parkId: 'park-1' },
    })
    expect(next.parks[0].visited).toBe(false)
  })

  it('TOGGLE_VISIT_ROLLBACK restores original value', () => {
    const optimisticState = { ...stateWithPark, parks: [{ ...mockPark, visited: true }] }
    const next = appReducer(optimisticState, {
      type: 'TOGGLE_VISIT_ROLLBACK',
      payload: { parkId: 'park-1', originalValue: false },
    })
    expect(next.parks[0].visited).toBe(false)
  })

  it('TOGGLE_VISIT_OPTIMISTIC does not affect other parks', () => {
    const otherPark = { ...mockPark, id: 'park-2', visited: false }
    const state = { ...stateWithPark, parks: [mockPark, otherPark] }
    const next = appReducer(state, {
      type: 'TOGGLE_VISIT_OPTIMISTIC',
      payload: { parkId: 'park-1' },
    })
    expect(next.parks[0].visited).toBe(true)
    expect(next.parks[1].visited).toBe(false)
  })

  it('SET_VIEW updates activeView', () => {
    const next = appReducer(initialState, { type: 'SET_VIEW', payload: 'map' })
    expect(next.activeView).toBe('map')
  })

  it('SET_FILTER merges partial filter into state', () => {
    const next = appReducer(initialState, {
      type: 'SET_FILTER',
      payload: { search: 'clearwater', city: 'Clearwater' },
    })
    expect(next.filters.search).toBe('clearwater')
    expect(next.filters.city).toBe('Clearwater')
    expect(next.filters.amenities).toEqual(initialFilters.amenities)
  })

  it('CLEAR_FILTERS resets all filters to initial', () => {
    const filteredState = {
      ...initialState,
      filters: { search: 'foo', city: 'Bar', amenities: { ...initialFilters.amenities, is_fenced: true } },
    }
    const next = appReducer(filteredState, { type: 'CLEAR_FILTERS' })
    expect(next.filters).toEqual(initialFilters)
  })

  it('SET_LOADING updates loading flag', () => {
    const next = appReducer(initialState, { type: 'SET_LOADING', payload: false })
    expect(next.loading).toBe(false)
  })

  it('SET_ERROR sets error and clears loading', () => {
    const next = appReducer(initialState, { type: 'SET_ERROR', payload: 'Something went wrong' })
    expect(next.error).toBe('Something went wrong')
    expect(next.loading).toBe(false)
  })

  it('unknown action returns state unchanged', () => {
    // @ts-expect-error intentional bad action
    const next = appReducer(initialState, { type: 'UNKNOWN_ACTION' })
    expect(next).toBe(initialState)
  })
})
