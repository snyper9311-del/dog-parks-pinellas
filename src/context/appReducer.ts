import type { AppState, AppAction, Filters } from '../types'

export const initialFilters: Filters = {
  search: '',
  city: '',
  amenities: {
    is_fenced: false,
    has_small_dog_area: false,
    has_water_station: false,
    has_lighting: false,
    has_parking: false,
    has_restrooms: false,
    has_benches_shade: false,
    is_leash_free: false,
  },
}

export const initialState: AppState = {
  parks: [],
  activeView: 'table',
  filters: initialFilters,
  loading: true,
  error: null,
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PARKS':
      return { ...state, parks: action.payload, loading: false, error: null }

    case 'TOGGLE_VISIT_OPTIMISTIC':
      return {
        ...state,
        parks: state.parks.map(p =>
          p.id === action.payload.parkId ? { ...p, visited: !p.visited } : p
        ),
      }

    case 'TOGGLE_VISIT_ROLLBACK':
      return {
        ...state,
        parks: state.parks.map(p =>
          p.id === action.payload.parkId
            ? { ...p, visited: action.payload.originalValue }
            : p
        ),
      }

    case 'SET_VIEW':
      return { ...state, activeView: action.payload }

    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } }

    case 'CLEAR_FILTERS':
      return { ...state, filters: initialFilters }

    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }

    default:
      return state
  }
}
