import { supabase } from '@/src/lib/supabase'

export const BUCKET_NAME = 'prompt-media'

/** 비공개 검수 증빙용 버킷 (대시보드에서 생성, RLS로 사용자 본인 경로만 업로드 허용) */
export const ADMIN_EVIDENCE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_ADMIN_EVIDENCE_BUCKET ?? 'admin-storage'

export type UploadProgressCallback = (progress: number) => void

export async function uploadMediaFile(
  file: File,
  userId: string,
  onProgress?: UploadProgressCallback
): Promise<{ url: string; path: string }> {
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const filePath = `${userId}/${fileName}`

  if (onProgress) {
    await simulateProgress(onProgress)
  }

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw new Error(error.message)

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

  if (onProgress) onProgress(100)

  return { url: publicUrl, path: filePath }
}

/**
 * 검수 증빙 파일을 비공개 버킷에 업로드합니다. 공개 URL은 반환하지 않습니다.
 */
export async function uploadEvidenceFile(
  file: File,
  userId: string,
  onProgress?: UploadProgressCallback
): Promise<{ path: string }> {
  const ext = file.name.split('.').pop() || 'bin'
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const filePath = `${userId}/verification/${fileName}`

  if (onProgress) {
    await simulateProgress(onProgress)
  }

  const { error } = await supabase.storage
    .from(ADMIN_EVIDENCE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw new Error(error.message)

  if (onProgress) onProgress(100)

  return { path: filePath }
}

export function isAllowedMediaType(file: File): boolean {
  const allowed = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
  ]
  return allowed.includes(file.type)
}

async function simulateProgress(onProgress: UploadProgressCallback) {
  return new Promise<void>((resolve) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 80) {
        onProgress(80)
        clearInterval(interval)
        resolve()
      } else {
        onProgress(Math.round(progress))
      }
    }, 200)
  })
}
