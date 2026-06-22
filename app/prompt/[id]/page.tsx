import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { PromptDetailView } from '@/components/prompt/PromptDetailView'
import { fetchPromptPostById, normalizeResultMedia } from '@/src/lib/prompt-queries'

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

  const images = normalizeResultMedia(result.post.result_media)
  const ogImage = images[0]

  return {
    title: result.post.title,
    description: desc || 'PROMPTER에서 프롬프트를 확인하세요.',
    openGraph: {
      title: result.post.title,
      description: desc || 'PROMPTER에서 프롬프트를 확인하세요.',
      type: 'article',
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630, alt: result.post.title }],
      }),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title: result.post.title,
      description: desc || 'PROMPTER에서 프롬프트를 확인하세요.',
      ...(ogImage && { images: [ogImage] }),
    },
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
