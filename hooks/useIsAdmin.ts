'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { supabase } from '@/src/lib/supabase'

/** 로그인 사용자의 members.is_admin 여부 (클라이언트) */
export function useIsAdmin() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setIsAdmin(false)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    supabase
      .from('members')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle()
      .then(
        (res: {
          data: { is_admin: boolean | null } | null
          error: { message: string } | null
        }) => {
          if (cancelled) return
          if (res.error) {
            setIsAdmin(false)
          } else {
            setIsAdmin(Boolean(res.data?.is_admin))
          }
          setLoading(false)
        }
      )

    return () => {
      cancelled = true
    }
  }, [user])

  return { isAdmin, loading }
}
