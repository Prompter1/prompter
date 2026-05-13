import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { PromptDetailView } from '@/components/prompt/PromptDetailView'
import { fetchPromptPostById } from '@/src/lib/prompt-queries'

type Props = Readonly<{
  params: Promise<{ id: string }>
}>

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const result = await fetchPromptPostById(id)

  if (!result) {
    return { title: '프롬프트를 찾을 수 없습니다 | PROMPTER' }
  }

  // ✅ workflow_pages 대신 content(첫 스텝 대표 프롬프트) 사용
  const desc =
    result.post.content.length > 160
      ? `${result.post.content.slice(0, 157)}…`
      : result.post.content

  return {
    title: `${result.post.title} | PROMPTER`,
    description: desc || 'PROMPTER에서 프롬프트를 확인하세요.',
  }
}

export default async function PromptDetailPage({ params }: Props) {
  const { id } = await params
  const result = await fetchPromptPostById(id)

  if (!result) notFound()

  return (
    <>
      <Navbar />
      <PromptDetailView post={result.post} createdAt={result.createdAt} />
      <Footer />
    </>
  )
}
