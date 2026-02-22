import { useState, useEffect } from 'react'

const LOCAL_STORAGE_KEY = 'dpp_anonymous_user_id'

export function useAnonymousUserId(): string | null {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    try {
      let id = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (!id) {
        id = crypto.randomUUID()
        localStorage.setItem(LOCAL_STORAGE_KEY, id)
      }
      setUserId(id)
    } catch {
      // localStorage unavailable (private browsing mode)
      setUserId(crypto.randomUUID())
    }
  }, [])

  return userId
}
