export interface DogPark {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip_code: string | null
  latitude: number
  longitude: number
  acres: number | null
  size_label: string | null
  is_fenced: boolean
  has_small_dog_area: boolean
  has_water_station: boolean
  has_lighting: boolean
  has_parking: boolean
  has_restrooms: boolean
  has_benches_shade: boolean
  is_leash_free: boolean
  hours: string | null
  phone: string | null
  website_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
  visited: boolean
}

export interface Filters {
  search: string
  city: string
  amenities: {
    is_fenced: boolean
    has_small_dog_area: boolean
    has_water_station: boolean
    has_lighting: boolean
    has_parking: boolean
    has_restrooms: boolean
    has_benches_shade: boolean
    is_leash_free: boolean
  }
}

export interface AppState {
  parks: DogPark[]
  activeView: 'table' | 'map'
  filters: Filters
  loading: boolean
  error: string | null
}

export type AppAction =
  | { type: 'SET_PARKS'; payload: DogPark[] }
  | { type: 'TOGGLE_VISIT_OPTIMISTIC'; payload: { parkId: string } }
  | { type: 'TOGGLE_VISIT_ROLLBACK'; payload: { parkId: string; originalValue: boolean } }
  | { type: 'SET_VIEW'; payload: 'table' | 'map' }
  | { type: 'SET_FILTER'; payload: Partial<Filters> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
