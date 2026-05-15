'use client'

import { useAuth } from '@/providers/auth-provider'
import { Navbar } from '@/components/layout/Navbar'
import { EditForm } from './EditForm'

interface InitialStepData {
  aiType: string
  aiVersion: string
  inputPrompt: string
  inputMedia: string[]
  outputText: string
  outputMedia: string[]
}

interface InitialData {
  postId: number
  title: string
  content: string
  price: number
  ai_types: string[]
  ai_versions: string[]
  categories: string[]
  steps: InitialStepData[]
}

interface EditPageWrapperProps {
  initialData: InitialData
}

export function EditPageWrapper({
  initialData,
}: Readonly<EditPageWrapperProps>) {
  const { user } = useAuth()

  if (!user) return null

  const mappedUser = {
    ...user,
    nickname: user.user_metadata?.full_name || '사용자',
    avatar_url: user.user_metadata?.avatar_url || '/images/default-avatar.png',
  }

  return (
    <>
      <Navbar />
      <EditForm initialData={initialData} />
    </>
  )
}
