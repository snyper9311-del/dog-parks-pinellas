import { useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import { useAppContext } from '../context/AppContext'
import { useAnonymousUserId } from './useAnonymousUserId'
import type { DogPark } from '../types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export function useParkData() {
  const { dispatch } = useAppContext()
  const userId = useAnonymousUserId()

  useEffect(() => {
    if (!userId) return

    async function load() {
      dispatch({ type: 'SET_LOADING', payload: true })

      const authedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { 'x-anonymous-user-id': userId! } },
      })

      const [parksResult, visitsResult] = await Promise.all([
        supabase.from('dog_parks').select('*').order('name'),
        authedClient.from('park_visits').select('park_id'),
      ])

      if (parksResult.error) {
        dispatch({ type: 'SET_ERROR', payload: 'Unable to load park data. Please refresh.' })
        return
      }

      const visitedIds = new Set((visitsResult.data ?? []).map((v: { park_id: string }) => v.park_id))
      const enriched: DogPark[] = (parksResult.data ?? []).map((p: Omit<DogPark, 'visited'>) => ({
        ...p,
        visited: visitedIds.has(p.id),
      }))

      dispatch({ type: 'SET_PARKS', payload: enriched })
    }

    load()
  }, [userId, dispatch])
}
