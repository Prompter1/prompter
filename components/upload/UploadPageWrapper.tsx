'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { Navbar } from '@/components/layout/Navbar'
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

  return (
    <>
      <Navbar />
      <UploadForm />
    </>
  )
}
