import { createClient } from '@supabase/supabase-js'
import { useAppContext } from '../context/AppContext'
import { useAnonymousUserId } from './useAnonymousUserId'
import { trackEvent } from '../lib/analytics'

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string)?.trim()
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string)?.replace(/\s/g, '')

export function useVisitToggle(onError?: (msg: string) => void) {
  const { state, dispatch } = useAppContext()
  const userId = useAnonymousUserId()

  return async function toggleVisit(parkId: string): Promise<void> {
    if (!userId) return

    const park = state.parks.find(p => p.id === parkId)
    if (!park) return

    const wasVisited = park.visited

    // 1. Optimistic update — immediate UI feedback
    dispatch({ type: 'TOGGLE_VISIT_OPTIMISTIC', payload: { parkId } })

    // 2. GA4 event
    trackEvent(wasVisited ? 'visit_removed' : 'visit_added', {
      park_id: parkId,
      park_name: park.name,
    })

    // 3. Supabase write with scoped client
    const authedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { 'x-anonymous-user-id': userId } },
    })

    try {
      if (wasVisited) {
        const { error } = await authedClient
          .from('park_visits')
          .delete()
          .eq('park_id', parkId)
          .eq('anonymous_user_id', userId)
        if (error) throw error
      } else {
        const { error } = await authedClient
          .from('park_visits')
          .insert({ anonymous_user_id: userId, park_id: parkId })
        if (error) throw error
      }
    } catch (err) {
      console.error('Failed to toggle visit:', err)
      // 4. Rollback on error
      dispatch({
        type: 'TOGGLE_VISIT_ROLLBACK',
        payload: { parkId, originalValue: wasVisited },
      })
      onError?.('Could not save your visit. Please try again.')
    }
  }
}
