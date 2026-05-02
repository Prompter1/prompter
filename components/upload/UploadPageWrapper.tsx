'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import AuthNavbar from '@/components/layout/AuthNavbar'
import { UploadForm } from './UploadForm'

export function UploadPageWrapper() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) return null

  const mappedUser = {
    ...user,
    nickname: user.user_metadata?.full_name || '사용자',
    avatar_url: user.user_metadata?.avatar_url || '/images/default-avatar.png',
  }

  return (
    <>
      <AuthNavbar user={mappedUser} />
      <UploadForm />
    </>
  )
}
