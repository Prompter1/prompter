'use client'

import { useState } from 'react'
import { PromptMediaGallery } from '@/components/prompt/PromptMediaGallery'
import {
  PromptStepsViewer,
  type PromptStep,
} from '@/components/prompt/PromptStepsViewer'

interface PromptDetailClientProps {
  steps: PromptStep[]
  resultMedia: string[]
  price: number
  canViewFull: boolean
  isLoggedIn: boolean
  postId: number
  title: string
  alt: string
}

/** 스텝에서 표시할 미디어를 결정: output_media 우선, 없으면 input_media, 둘 다 없으면 [] */
function getStepMedia(step: PromptStep): string[] {
  if (step.output_media.length > 0) return step.output_media
  if (step.input_media.length > 0) return step.input_media
  return []
}

export function PromptDetailClient({
  steps,
  resultMedia,
  price,
  canViewFull,
  isLoggedIn,
  postId,
  title,
  alt,
}: Readonly<PromptDetailClientProps>) {
  // 스텝이 있으면 스텝 1의 미디어로 초기화, 없으면 대표 미디어
  const initialMedia = steps.length > 0 ? getStepMedia(steps[0]) : resultMedia

  const [activeStepMedia, setActiveStepMedia] = useState<string[]>(initialMedia)

  const handleStepChange = (outputMedia: string[], inputMedia: string[]) => {
    if (outputMedia.length > 0) {
      setActiveStepMedia(outputMedia)
    } else if (inputMedia.length > 0) {
      setActiveStepMedia(inputMedia)
    } else {
      // 미디어 없는 스텝 → 빈 배열 (갤러리에 빈 상태 표시)
      setActiveStepMedia([])
    }
  }

  // 스텝이 있으면 항상 activeStepMedia 사용, 없으면 resultMedia 폴백
  const displayMedia = steps.length > 0 ? activeStepMedia : resultMedia

  return (
    <div className="space-y-6">
      <PromptMediaGallery urls={[]} alt={alt} activeUrls={displayMedia} />
      {steps.length > 0 && (
        <PromptStepsViewer
          steps={steps}
          price={price}
          canViewFull={canViewFull}
          isLoggedIn={isLoggedIn}
          postId={postId}
          title={title}
          userId={''}
          onStepChange={handleStepChange}
        />
      )}
    </div>
  )
}
